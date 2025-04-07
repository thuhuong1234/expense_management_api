const express = require("express");
const router = express.Router();
const categoryRouter = require("./category.router");
const transactionRouter = require("./transaction.router");
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const roomRouter = require("./room.router");

const routes = [
  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/transactions",
    route: transactionRouter,
  },
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/rooms",
    route: roomRouter,
  },
];

routes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
