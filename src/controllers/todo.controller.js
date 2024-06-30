const todoService = require("../services/todo.service");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/AppError");

const getAllTodos = catchAsyncError(async (req, res, next) => {
  const todos = await todoService.getAllTodos();
  return res.status(201).json(todos);
});

const createTodo = catchAsyncError(async (req, res, next) => {
  const newTodo = await todoService.createTodo(req.body);

  return res.status(201).json(newTodo);
});

const getTodo = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoService.getTodo(id);
  if (!todo) {
    return next(new AppError("Todo not found", 404));
  }

  return res.status(201).json(todo);
});

const updateTodo = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const todo = await todoService.getTodo(id);
  if (!todo) {
    return next(new AppError("Todo not found", 404));
  }

  const updatedTodo = await todoService.updateTodo(id, req.body);
  return res.status(201).json(updatedTodo);
});

const deleteTodo = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoService.getTodo(id);
  if (!todo) {
    return next(new AppError("Todo not found", 404));
  }

  const deletedTodo = await todoService.deleteTodo(id);
  return res.status(201).json(deletedTodo);
});

module.exports = {
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
};
