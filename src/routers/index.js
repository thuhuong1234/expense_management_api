const express = require("express");
const router = express.Router();
const categoryRouter = require("./category.router");
const routes = [
  {
    path: "/categories",
    route: categoryRouter,
  },
];

routes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
