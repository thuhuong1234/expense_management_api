const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const roomRouter = express.Router();

const roomController = require("../controllers/room.controller");
roomRouter.use(authMiddleware);
roomRouter.route("/").get(roomController.getAllRooms);
roomRouter.route("/download").get(roomController.downloadRooms);
roomRouter
  .route("/statistics/users-by-room")
  .get(roomController.getCountUserInRoom);
roomRouter.route("/download-detail/:id").get(roomController.downloadDetailRoom);
roomRouter.route("/").post(roomController.createRoom);
roomRouter.route("/:id").get(roomController.getRoom);
roomRouter.route("/:id").put(roomController.updateRoom);
roomRouter.route("/:id").delete(roomController.deleteRoom);
roomRouter.route("/:id/add-user").put(roomController.addUser);
roomRouter.route("/:id/remove-user").delete(roomController.removeUser);

module.exports = roomRouter;
