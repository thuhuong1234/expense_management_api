const roomService = require("../services/room.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

const getAllRooms = catchAsyncError(async (req, res, next) => {
  const rooms = await roomService.getAllRooms();
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
  const room = await roomService.getRoom(id);
  if (!room) {
    return next(new AppError("Room not found", 404));
  }

  const deletedRoom = await roomService.deleteRoom(id);
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
module.exports = {
  getAllRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  addUser,
  removeUser,
};
