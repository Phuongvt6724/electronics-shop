const OrderService = require("../services/OrderService");
const Joi = require("joi");
const moment = require("moment");
const UserService = require("../services/UserService");
const nodemailer = require("nodemailer");
const { domain, domainAPI } = require("../constant/domain");
const axios = require("axios");
const ordersTemporary = new Map();
const urlSuccess = `${domain}/success`;
const urlCancel = `${domain}/payment`;

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function formatVNDPrice(price) {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "phuongvtps31738@gmail.com",
      pass: "tkpwxvgvgkjytsqn",
    },
  });

  const mailOptions = {
    from: "phuongvtps31738@gmail.com",
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}

const orderSchema = Joi.object({
  name: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().integer().required(),
        brand: Joi.number().integer().required(),
        price: Joi.number().integer().required(),
        color: Joi.string().required(),
      })
    )
    .required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  feeShip: Joi.number().integer().required(),
  discount: Joi.number().integer().default(0),
  orderDate: Joi.string().required(),
  status: Joi.number().valid(1, 2).default(1),
  payment: Joi.number().valid(1, 2).default(1),
  idUser: Joi.string().required(),
});

class OrderController {
  async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getOneOrder(req, res) {
    try {
      const id = req.params.id;
      const order = await OrderService.getOneOrder(id);
      res.status(200).json(order);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getOrderByProductId(req, res) {
    try {
      const { date, productId } = req.params;
      const [year, month] = date.split("-");
      const orders = await OrderService.findByProductIdAndMonth(
        productId,
        month,
        year
      );
      res.status(200).json(orders);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async createOrder(req, res) {
    try {
      const { error, value } = orderSchema.validate(req.body);
      if (error) {
        throw new Error(error.details[0].message);
      }

      for (let item of value.items) {
        const product = await OrderService.getOneProduct(item.productId);

        const typeToUpdate = product.types.find(
          (type) => type.color === item.color
        );

        typeToUpdate.quantity -= item.quantity;

        await OrderService.updateProduct(item.productId, product);
      }

      const user = await OrderService.getOneUser(value.idUser);
      const result = await OrderService.createOrder(value);

      if (user) {
        const newOrder = { ...value };

        delete newOrder.idUser;

        if (!user.orders) {
          user.orders = [];
        }

        user.orders.push(newOrder);

        await OrderService.updateUser(value.idUser, user);
      }

      const htmlContent = `
      <html>
        <head>
          <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333;
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }
    p {
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    tfoot {
      font-weight: bold;
    }
    .thank-you {
      text-align: center;
      margin-top: 20px;
      font-style: italic;
    }
  </style>
</head>
<body>
 <div class="container">
  <p>Xin chào ${value.name},</p>
  <p>Dưới đây là chi tiết hóa đơn của bạn:</p>
  <table>
    <thead>
      <tr>
        <th>Sản phẩm</th>
        <th>Màu sắc</th>
        <th>Số lượng</th>
        <th>Đơn giá</th>
        <th>Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      ${value.items
        .map(
          (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.color}</td>
          <td>${item.quantity}</td>
          <td>${formatVNDPrice(item.price)}</td>
          <td>${formatVNDPrice(item.quantity * item.price)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
    <tfoot>
    <tr>
        <td colspan="4" style="text-align: right;"><strong>Giảm giá:</strong></td>
        <td>${formatVNDPrice(value.discount ? value.discount : 0)}</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right;"><strong>Phí vận chuyển:</strong></td>
        <td>${formatVNDPrice(value.feeShip)}</td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: right;"><strong>Tổng cộng:</strong></td>
        <td>${formatVNDPrice(
          calculateTotal(value.items) + value.feeShip - value.discount
        )}</td>
      </tr>
    </tfoot>
  </table>

  <p class="order-name" style="font-size: 14px">Tên người nhận hàng:
    <span style="font-size: 13px; font-weight: bold"> 
      ${value.name}
    </span>
  </p>

  <p class="order-email" style="font-size: 14px">Email người nhận hàng:
    <span style="font-size: 13px; font-weight: bold"> 
      ${value.email}
    </span>
  </p>

  <p class="order-phone" style="font-size: 14px">Số điện thoại người nhận hàng:
    <span style="font-size: 13px; font-weight: bold"> 
      ${value.phone}
    </span>
  </p>

  <p class="order-address" style="font-size: 14px">Địa chỉ người nhận hàng:
    <span style="font-size: 13px; font-weight: bold"> 
      ${value.address}
    </span>
  </p>

  <p class="order-orderDate" style="font-size: 14px">Ngày đặt hàng:
    <span style="font-size: 13px; font-weight: bold"> 
      ${value.orderDate}
    </span>
  </p>

  <p class="order-phone" style="font-size: 14px">Trạng thái đơn hàng:
    <span style="font-size: 13px; font-weight: bold"> 
      ${value.phone}
    </span>
  </p>

  <p class="order-status" style="font-size: 14px">Trạng thái đơn hàng:
    <span style="font-size: 13px; font-weight: bold"> 
      ${
        value.status === 1
          ? "Đang xử lí"
          : value.status === 2
          ? "Đã giao thành công"
          : ""
      }
    </span>
  </p>
  <p class="payment-method" style="font-size: 14px">Hình thức thanh toán:
    <span style="font-size: 13px; font-weight: bold"> 
    ${
      value.payment === 1
        ? "Thanh toán tiền mặt"
        : value.payment === 2
        ? "Thanh toán VNPAY"
        : ""
    }
     </span>
  </p>
  <p class="thank-you" style="font-size: 18px;">Cảm ơn bạn đã đặt hàng.</p>
</div>
</body>
</html>
    `;

      await sendEmail(user.email, "Thông báo xác nhận đơn hàng", htmlContent);

      res.status(201).json(result);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const id = req.params.id;
      const { status } = req.body;

      const order = await OrderService.getOneOrder(id);
      const userUpdate = await UserService.getOneUser(order.idUser);

      const findOrdersInUser = userUpdate.orders.find(
        (item) => item._id.toString() === id
      );

      order.status = status;

      findOrdersInUser.status = status;

      await UserService.updateStatusOrderByUser(order.idUser, userUpdate);
      await OrderService.updateOrder(id, order);
      res.status(200).json(order);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error updating the order");
    }
  }

  async deleteOrder(req, res) {
    try {
      const id = req.params.id;
      const result = await OrderService.deleteOrder(id);
      if (result.deletedCount === 1) {
        res.status(200).send("Order deleted successfully");
      } else {
        res.status(404).send("Order not found");
      }
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error deleting the order");
    }
  }

  // Thanh toán VNPAY
  async createPaymentUrl(req, res) {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = "N98XN914";
    let secretKey = "UEVP27WHTG7M2CM3LLE1SP3BKE2LVZIR";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = `${domainAPI}/order/vnpay_return`;
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    const newOrder = req.body.newOrder;

    ordersTemporary.set(orderId, newOrder);

    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    // res.redirect(vnpUrl);
    res
      .status(200)
      .json({ paymentUrl: vnpUrl, newOrder: ordersTemporary.get(orderId) });
  }

  async vnpayReturn(req, res) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];
    let orderId = vnp_Params["vnp_TxnRef"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = "N98XN914";
    let secretKey = "UEVP27WHTG7M2CM3LLE1SP3BKE2LVZIR";

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        const newOrder = ordersTemporary.get(orderId);

        if (newOrder) {
          newOrder.payment = 2;
          await axios.post(`${domainAPI}/order`, newOrder);
        }
        ordersTemporary.delete(orderId);
        res.redirect(urlSuccess);
      } else {
        ordersTemporary.delete(orderId);
        res.redirect(urlCancel);
      }
    } else {
      // Chuyển hướng đến trang hủy thanh toán nếu mã băm không khớp
      res.redirect(urlCancel);
    }
  }
}

module.exports = new OrderController();
