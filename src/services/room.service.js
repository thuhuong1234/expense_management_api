const { Role } = require("@prisma/client");
const prisma = require("../prisma");
const AppError = require("../utils/AppError");
const getAllRooms = () => {
  return prisma.room.findMany();
};
const createRoom = async (data, userId) => {
  const newRoom = await prisma.room.create({
    data: {
      ...data,
      userId,
    },
  });

  await prisma.userRoom.create({
    data: {
      userId,
      roomId: newRoom.id,
      role: Role.Leader,
      isLeader: true,
    },
  });

  return newRoom;
};
const updateRoomQuality = async (roomId) => {
  const userCount = await prisma.userRoom.count({
    where: { roomId },
  });

  return await prisma.room.update({
    where: { id: roomId },
    data: { quality: userCount },
  });
};

const getRoom = async (roomId) => {
  return prisma.room.findUnique({
    where: { id: Number(roomId) },
    include: {
      userRooms: true,
    },
  });
};
const updateRoom = async (roomId, updateData) => {
  const updatedRoom = await prisma.room.update({
    where: { id: Number(roomId) },
    data: updateData,
  });

  return updatedRoom;
};
const deleteRoom = async (roomId, userId) => {
  const userRoom = await prisma.userRoom.findFirst({
    where: { roomId: Number(roomId), userId },
  });

  if (!userRoom) {
    throw new AppError("Room is invalid", 404);
  }
  if (userRoom.role !== Role.Leader) {
    throw new AppError("You do not have permission", 403);
  }
  await prisma.room.delete({
    where: {
      id: Number(roomId),
    },
  });
  return {
    message: "Room deleted successfully",
  };
};
const addUserToRoom = async (roomId, memberId, userId) => {
  const userRoom = await prisma.userRoom.findFirst({
    where: { roomId: Number(roomId), userId },
  });
  if (!userRoom) {
    throw new AppError("Room is invalid ", 404);
  }
  if (userRoom.role !== Role.Leader) {
    throw new AppError("You do not have permission ", 403);
  }

  const existUser = await prisma.user.findUnique({
    where: { id: memberId },
  });
  if (!existUser) {
    throw new AppError("Member not found", 404);
  }

  const existingMember = await prisma.userRoom.findFirst({
    where: { roomId: Number(roomId), userId: Number(memberId) },
  });

  if (existingMember) {
    throw new AppError("Member already in the room", 400);
  }
  return await prisma.userRoom.create({
    data: {
      roomId: Number(roomId),
      userId: Number(memberId),
      role: Role.Member,
    },
  });
};
const removeUserFromRoom = async (roomId, memberId, userId) => {
  const userRoom = await prisma.userRoom.findFirst({
    where: { roomId: Number(roomId), userId },
  });
  if (!userRoom) {
    throw new AppError("Room is invalid ", 404);
  }
  if (userRoom.role !== Role.Leader) {
    throw new AppError("You do not have permission ", 403);
  }

  const memberToRemove = await prisma.userRoom.findFirst({
    where: { roomId: Number(roomId), userId: Number(memberId) },
  });
  if (!memberToRemove) {
    throw new AppError("There is no user in this room.", 404);
  }
  if (memberToRemove.role === Role.Leader && memberId !== userId) {
    throw new AppError(
      "Cannot delete leader unless leaving the room yourself",
      403
    );
  }

  await prisma.userRoom.deleteMany({
    where: { roomId: Number(roomId), userId: Number(memberId) },
  });
  return updateRoomQuality(Number(roomId));
};

module.exports = {
  getAllRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  addUserToRoom,
  removeUserFromRoom,
  updateRoomQuality,
};
