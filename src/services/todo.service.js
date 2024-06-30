const prisma = require("../prisma");

const getAllTodos = () => {
  const todos = prisma.todo.findMany();
  return todos;
};
const createTodo = (data) => {
  const todo = prisma.todo.create({
    data,
  });
  return todo;
};

const getTodo = (id) => {
  const todo = prisma.todo.findUnique({
    where: {
      id: Number(id),
    },
  });
  return todo;
};

const updateTodo = (id, data) => {
  const todo = prisma.todo.update({
    where: {
      id: Number(id),
    },
    data,
  });
  return todo;
};

const deleteTodo = (id) => {
  const todo = prisma.todo.delete({
    where: {
      id: Number(id),
    },
  });
  return todo;
};

module.exports = {
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
};
