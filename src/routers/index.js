const express = require("express");
const router = express.Router();
const categoryRouter = require("./category.router");
const todoRouter = require("./todo.router");
const routes = [
  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/todos",
    route: todoRouter,
  },
];

routes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
