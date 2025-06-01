const userService = require("../services/user.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const bcryptService = require("../services/bcrypt");
const generateExcel = require("../utils/downloadFile");
const createUser = catchAsyncError(async (req, res, next) => {
  const { password } = req.body;
  const hashedPassword = await bcryptService.hashPassword(password);
  const newUser = await userService.createUser({
    ...req.body,
    password: hashedPassword,
  });

  return res.status(201).json(newUser);
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await userService.getAllUsers(req.query);
  if (!users) {
    return next(new AppError("Users not found", 404));
  }

  return res.status(201).json(users);
});

const getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userService.getUser(+id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(201).json(user);
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const avatar = req.file?.filename;
  req.body.avatar = avatar;
  const user = await userService.getUser(+id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const updatedUser = await userService.updateUser(+id, req.body);
  return res.status(201).json(updatedUser);
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userService.getUser(+id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const deletedUser = await userService.deleteUser(+id);
  return res.status(201).json(deletedUser);
});

const downloadListUser = catchAsyncError(async (req, res, next) => {
  const query = { ...req.query, all: true };
  const data = await userService.getAllUsers(query);
  if (!data.users || !Array.isArray(data.users)) {
    return next(new AppError("Users not found", 404));
  }
  const columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 25 },
  ];
  const rows = data.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  }));

  const file = await generateExcel({
    rows,
    columns,
    sheetName: "User_Report",
  });
  res.download(file, (err) => {
    if (err) {
      return next(new AppError("File not found", 404));
    }
  });
});
const getCountByUserId = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const count = await userService.getCountByUserId(+userId);
  return res.status(201).json(count);
});

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  downloadListUser,
  getCountByUserId,
};
