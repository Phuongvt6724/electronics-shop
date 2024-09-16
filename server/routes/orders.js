const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.get("/vnpay_return", (req, res) =>
  OrderController.vnpayReturn(req, res)
);

router.get("/", (req, res) => OrderController.getAllOrders(req, res));

router.get("/:id", (req, res) => OrderController.getOneOrder(req, res));

router.get("/:date/:productId", (req, res) =>
  OrderController.getOrderByProductId(req, res)
);

router.post("/", (req, res) => OrderController.createOrder(req, res));

router.put("/:id", (req, res) => OrderController.updateOrder(req, res));

router.delete("/:id", (req, res) => OrderController.deleteOrder(req, res));

router.post("/create_payment_url", (req, res) =>
  OrderController.createPaymentUrl(req, res)
);

module.exports = router;
