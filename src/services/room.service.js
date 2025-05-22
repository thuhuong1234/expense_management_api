const { Role } = require("@prisma/client");
const prisma = require("../prisma");
const AppError = require("../utils/appError");
const apiFeature = require("../utils/apiFeature");
const getAllRooms = async (queryParams) => {
  const { where, orderBy, pagination } = apiFeature({
    queryParams,
    searchableFields: ["name"],
    defaultSort: {
      createdAt: "desc",
    },
  });
  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      include: {
        userRooms: true,
        transactions: {
          include: {
            userTransactions: true,
          },
        },
        fund: true,
      },
      orderBy,
      ...pagination,
    }),
    prisma.room.count({ where }),
  ]);

  return {
    rooms,
    total,
    page: parseInt(queryParams.page) || 1,
    limit: pagination.take || 10,
    totalPage: Math.ceil(total / pagination.take),
  };
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

const getRoom = async (id) => {
  return prisma.room.findUnique({
    where: { id },
    include: {
      userRooms: true,
      transactions: {
        include: {
          userTransactions: true,
        },
      },
      fund: true,
    },
  });
};
const updateRoom = async (id, updateData) => {
  return await prisma.room.update({
    where: { id },
    data: updateData,
  });
};
const deleteRoom = async (roomId, userId) => {
  const userRoom = await prisma.userRoom.findFirst({
    where: { roomId, userId },
  });

  if (!userRoom) {
    throw new AppError("Room is invalid", 404);
  }
  if (userRoom.role !== Role.Leader) {
    throw new AppError("You do not have permission", 403);
  }
  await prisma.room.delete({
    where: {
      id: roomId,
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
const fillWorksheetRows = async (worksheet, data, currentRow = 3) => {
  for (const room of data) {
    const users = room.userRooms || [];
    const rowspan = users.length || 1;
    const fundBalance = Number(room.fund?.[0]?.balance) || 0;
    const transactions = room.transactions?.length || 0;

    for (let i = 0; i < rowspan; i++) {
      const user = users[i] || {};
      const row = worksheet.getRow(currentRow + i);

      if (i === 0) {
        row.getCell(1).value = room.id;
        row.getCell(2).value = room.name;
        row.getCell(3).value = room.quality;
        row.getCell(4).value = fundBalance;
        row.getCell(7).value = transactions;
      }
      const getEmailByUserId = async (userId) => {
        const result = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });
        return {
          email: result?.email || "",
        };
      };
      const detailUser = await getEmailByUserId(user.userId);
      row.getCell(5).value = detailUser.email || "";
      row.getCell(6).value = user.role || "";
    }

    if (rowspan > 1) {
      worksheet.mergeCells(`A${currentRow}:A${currentRow + rowspan - 1}`);
      worksheet.mergeCells(`B${currentRow}:B${currentRow + rowspan - 1}`);
      worksheet.mergeCells(`C${currentRow}:C${currentRow + rowspan - 1}`);
      worksheet.mergeCells(`D${currentRow}:D${currentRow + rowspan - 1}`);
      worksheet.mergeCells(`G${currentRow}:G${currentRow + rowspan - 1}`);
    }
    currentRow += rowspan;
  }
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
  fillWorksheetRows,
};
