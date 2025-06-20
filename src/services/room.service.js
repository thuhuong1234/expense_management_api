const { Role } = require("@prisma/client");
const prisma = require("../prisma");
const AppError = require("../utils/appError");
const apiFeature = require("../utils/apiFeature");
const { getTimeRange } = require("../utils/timeRange");
const getAllRooms = async (queryParams, userId, isAdmin = false) => {
  if (queryParams.all) {
    const rooms = await prisma.room.findMany({
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
    return { rooms };
  }
  const {
    where: baseWhere,
    orderBy,
    pagination,
  } = apiFeature({
    queryParams,
    searchableFields: ["name"],
    defaultSort: {
      createdAt: "desc",
    },
  });
  let where = { ...baseWhere };
  if (!isAdmin) {
    where.userRooms = {
      some: {
        userId: +userId,
        ...(where.userRooms?.some || {}),
      },
    };
  }
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

  await prisma.fund.create({
    data: {
      name: `Quỹ phòng #${newRoom.id}`,
      description: "Quỹ mặc định khi tạo phòng",
      roomId: newRoom.id,
      userId,
      balance: 0,
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
const addUserToRoom = async (roomId, memberIds, userId) => {
  const userRoom = await prisma.userRoom.findFirst({
    where: { roomId, userId },
  });
  if (!userRoom) {
    throw new AppError("Room is invalid ", 404);
  }
  if (userRoom.role !== Role.Leader) {
    throw new AppError("You do not have permission ", 403);
  }

  const existingUsers = await prisma.user.findMany({
    where: { id: { in: memberIds } },
  });
  const userIds = existingUsers.map((user) => user.id);
  const isNotExistUser = memberIds.filter((id) => !userIds.includes(id));
  if (isNotExistUser.length > 0) {
    throw new AppError(`Member not found : ${isNotExistUser.join(", ")}`, 404); //", 404);
  }

  const existingMembers = await prisma.userRoom.findMany({
    where: { roomId, userId: { in: userIds } },
  });
  const alreadyMemberIds = existingMembers.map((m) => m.userId);
  if (alreadyMemberIds.length > 0) {
    throw new AppError(
      `Members already in the room: ${alreadyMemberIds.join(", ")}`,
      400
    );
  }
  const addedUsers = memberIds
    .filter((id) => !alreadyMemberIds.includes(id))
    .map((id) => ({
      roomId,
      userId: +id,
      role: Role.Member,
    }));

  return await prisma.userRoom.createMany({
    data: addedUsers,
  });
};
const removeUserFromRoom = async (roomId, memberId, userId) => {
  const userRoom = await prisma.userRoom.findFirst({
    where: { roomId, userId },
  });
  if (!userRoom) {
    throw new AppError("Room is invalid ", 404);
  }
  if (userRoom.role !== Role.Leader) {
    throw new AppError("You do not have permission ", 403);
  }

  const memberToRemove = await prisma.userRoom.findFirst({
    where: { roomId, userId: memberId },
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
    where: { roomId, userId: memberId },
  });
  return updateRoomQuality(roomId);
};
const getEmailByUserId = async (userId) => {
  if (!userId) return {};
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  return {
    email: result?.email || "",
  };
};
const getCategoryById = async (categoryId) => {
  if (!categoryId) return {};
  const result = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { name: true },
  });
  return {
    name: result?.name || "",
  };
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
const fillWorksheetDetailRows = async (worksheet, data, currentRow = 3) => {
  const nameRoom = data.name;
  for (const transaction of data.transactions) {
    const usersTransactions = transaction.userTransactions || [];
    const rowspan = usersTransactions.length || 1;
    const category = await getCategoryById(transaction.categoryId);

    for (let i = 0; i < rowspan; i++) {
      const user = usersTransactions[i] || {};
      const row = worksheet.getRow(currentRow + i);

      if (i === 0) {
        row.getCell(1).value = nameRoom;
        row.getCell(2).value = transaction.description;
        row.getCell(3).value = Number(transaction.amount);
        row.getCell(4).value = category.name;
        row.getCell(7).value = transaction.date.toLocaleString("vi-VN");
      }

      const detailUser = await getEmailByUserId(user.userId);
      row.getCell(5).value = detailUser.email || "";
      row.getCell(6).value = Number(user.amount) || "";
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
const getCountUserInRoom = async ({ roomId, type = "month" }) => {
  const { from, to } = getTimeRange(type);
  const userTransactions = await prisma.userTransaction.findMany({
    where: {
      roomId: Number(roomId),
      transaction: {
        date: {
          gte: from,
          lte: to,
        },
      },
    },
    include: {
      user: true,
      transaction: {
        include: {
          category: true,
        },
      },
    },
  });

  const result = [];

  userTransactions.forEach((utx) => {
    const userId = utx.userId;
    const user = utx.user;
    const categoryType = utx.transaction.category?.categoryType;
    const amount = parseFloat(utx.amount);
    if (!result[userId]) {
      result[userId] = {
        userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        totalIncome: 0,
        totalExpense: 0,
      };
    }
    if (categoryType === "Income") result[userId].totalIncome += amount;
    else if (categoryType === "Expense") result[userId].totalExpense += amount;
  });
  return {
    roomId,
    type,
    from,
    to,
    data: Object.values(result),
  };
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
  fillWorksheetDetailRows,
  getCountUserInRoom,
};
