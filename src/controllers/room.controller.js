const roomService = require("../services/room.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const generateExcel = require("../utils/downloadFile");

const getAllRooms = catchAsyncError(async (req, res, next) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.isAdmin;
  const rooms = await roomService.getAllRooms(req.query, userId, isAdmin);
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
  const memberIds = req.body;
  const userId = req.user.id;

  const result = await roomService.addUserToRoom(
    +id,
    memberIds.userId,
    +userId
  );

  const updateRoomQuality = await roomService.updateRoomQuality(+id);
  return res.status(201).json(updateRoomQuality);
});

const removeUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const memberId = req.body;
  const userId = req.user.id;

  const result = await roomService.removeUserFromRoom(
    +id,
    +memberId.userId,
    +userId
  );
  return res.status(201).json(result);
});

const downloadRooms = catchAsyncError(async (req, res, next) => {
  const query = { ...req.query, all: true };
  const data = await roomService.getAllRooms(query);
  if (!data.rooms || !Array.isArray(data.rooms)) {
    return next(new AppError("Rooms not found", 404));
  }
  const columns = [
    { header: "ID", width: 10 },
    { header: "Name", width: 25 },
    { header: "Quality", width: 10 },
    { header: "Fund", width: 25 },
    { header: "Members", width: 30 },
    { header: "", key: "", width: 30 },
    { header: "Transactions", width: 30 },
  ];
  const rowTitle = ["", "", "", "", "Name", "Role", ""];
  const file = await generateExcel({
    rows: data.rooms,
    columns,
    rowTitle,
    sheetName: "Room_Report",
    customLayout: true,
    fillWorksheetRows: roomService.fillWorksheetRows,
  });

  res.download(file, (err) => {
    if (err) {
      return next(new AppError("File not found", 404));
    }
  });
});

const downloadDetailRoom = catchAsyncError(async (req, res, next) => {
  const data = await roomService.getRoom(+req.params.id);
  if (!data) {
    return next(new AppError("Room not found", 404));
  }
  const columns = [
    { header: "Room", width: 25 },
    { header: "Description", width: 30 },
    { header: "Amount", width: 25 },
    { header: "Category", width: 25 },
    { header: "User_transactions", width: 40 },
    { header: "", width: 20 },
    { header: "Date", width: 30 },
  ];
  const rowTitle = ["", "", "", "", "User", "Amount", ""];
  const file = await generateExcel({
    rows: data,
    columns,
    rowTitle,
    sheetName: "Room_Detail_Report",
    customLayout: true,
    fillWorksheetRows: roomService.fillWorksheetDetailRows,
  });

  res.download(file, (err) => {
    if (err) {
      return next(new AppError("File not found", 404));
    }
  });
});

const getCountUserInRoom = catchAsyncError(async (req, res, next) => {
  const { roomId, type } = req.query;
  if (!roomId) {
    return res.status(400).json({ message: "Missing roomId" });
  }
  const result = await roomService.getCountUserInRoom({ roomId, type });
  res.status(200).json({
    status: "success",
    ...result,
  });
  return res.status(201).json(result);
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
  downloadDetailRoom,
  getCountUserInRoom,
};
