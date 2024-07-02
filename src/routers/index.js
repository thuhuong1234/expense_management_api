const express = require("express");
const router = express.Router();
const categoryRouter = require("./category.router");
const todoRouter = require("./todo.router");
const userRouter = require("./user.router");

const routes = [
  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/todos",
    route: todoRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
];

routes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
