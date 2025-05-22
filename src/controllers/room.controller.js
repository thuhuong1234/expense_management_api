const roomService = require("../services/room.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const generateExcel = require("../utils/downloadFile");

const getAllRooms = catchAsyncError(async (req, res, next) => {
  const rooms = await roomService.getAllRooms(req.query);
  return res.status(201).json(rooms);
});

const createRoom = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const newRoom = await roomService.createRoom(req.body, userId);
  const updateRoomQuality = await roomService.updateRoomQuality(newRoom.id);

  return res.status(201).json(updateRoomQuality);
});

const getRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const room = await roomService.getRoom(+id);
  if (!room) {
    return next(new AppError("Room not found", 404));
  }

  return res.status(201).json(room);
});

const updateRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedRoom = await roomService.updateRoom(+id, req.body);

  return res.status(201).json(updatedRoom);
});

const deleteRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const room = await roomService.getRoom(+id);
  if (!room) {
    return next(new AppError("Room not found", 404));
  }

  const deletedRoom = await roomService.deleteRoom(+id, req.user.id);
  return res.status(201).json(deletedRoom);
});

const addUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const memberId = req.body;
  const userId = req.user.id;

  const result = await roomService.addUserToRoom(id, memberId.userId, userId);
  const updateRoomQuality = await roomService.updateRoomQuality(result.roomId);
  return res.status(201).json(updateRoomQuality);
});

const removeUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const memberId = req.body;
  const userId = req.user.id;

  const result = await roomService.removeUserFromRoom(
    id,
    memberId.userId,
    userId
  );
  return res.status(201).json(result);
});

const downloadRooms = catchAsyncError(async (req, res, next) => {
  const data = await roomService.getAllRooms(req.query);
  if (!data.rooms || !Array.isArray(data.rooms)) {
    return next(new AppError("Users not found", 404));
  }
  const columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Name", key: "name", width: 25 },
    { header: "Quality", key: "quality", width: 10 },
    { header: "Fund", key: "fund", width: 25 },
    { header: "Members", key: "userRooms", width: 30 },
    { header: "", key: "", width: 30 },
    { header: "Transactions", key: "transactions", width: 30 },
  ];
  const rowTitle = ["", "", "", "", "Name", "Role", "Transations"];
  const file = await generateExcel({
    rows: data.rooms,
    columns,
    rowTitle,
    sheetName: "Room Report",
    customLayout: true,
    fillWorksheetRows: roomService.fillWorksheetRows,
  });

  res.download(file.filePath, (err) => {
    if (err) {
      return next(new AppError("File not found", 404));
    }
  });
});

module.exports = {
  getAllRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  addUser,
  removeUser,
  downloadRooms,
};
