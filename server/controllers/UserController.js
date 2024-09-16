const UserService = require("../services/UserService");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const validator = require("validator");
const domain = require("../constant/domain");

const userSchema = Joi.object({
  lastName: Joi.string().required(),
  firstName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string(),
  role: Joi.number().valid(1, 2).required(),
  method: Joi.number().valid(1, 2),
  status: Joi.number().valid(1, 2).required(),
});

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getOneUser(req, res) {
    try {
      const id = req.params.id;
      const user = await UserService.getOneUser(id);
      res.status(200).json(user);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error querying the data");
    }
  }

  async getUserByToken(req, res) {
    try {
      const token = req.params.token;
      const user = await UserService.getUserByToken(token);
      if (!user) {
        throw new Error("Token không hợp lệ!");
      }

      if (user.resetTokenExpiration && user.resetTokenExpiration < Date.now()) {
        throw new Error("Token đã hết hạn!");
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error.stack);
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const { lastName, firstName, email, password, confirmPassword, role } =
        req.body;

      if (!lastName || !firstName || !email || !password || !confirmPassword) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }

      if (!validator.isEmail(email)) {
        throw new Error("Định dạng email không hợp lệ");
      }

      const checkUserExits = async (email) => {
        const user = await UserService.findEmail(email);
        return !!user;
      };

      const isExits = await checkUserExits(email);

      if (isExits) {
        throw new Error("Email đã tồn tại");
      }

      if (password !== confirmPassword) {
        throw new Error("Mật khẩu không trùng khớp");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userData = {
        lastName,
        firstName,
        email,
        password: hashedPassword,
        role: role ? role : 1,
        method: 1,
        status: 1,
      };

      const { error, value } = userSchema.validate(userData);
      if (error) {
        throw new Error(error.details[0].message);
      }

      await UserService.createUser(value);
      res.status(201).json(value);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }

      if (!validator.isEmail(email)) {
        throw new Error("Định dạng email không hợp lệ");
      }

      const user = await UserService.findEmail(email);
      if (!user) {
        throw new Error("Người dùng không tồn tại");
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Mật khẩu không đúng");
      }

      if (user.status === 2) {
        throw new Error("Tài khoản của bạn đã bị khóa !");
      }

      const accessToken = jwt.sign({ user: user }, "vothanhphuong", {
        expiresIn: 1 * 60,
      });

      const refreshToken = jwt.sign({ user: user }, "vothanhphuong", {
        expiresIn: 90 * 24 * 60 * 60,
      });

      res.status(200).json({ user: user, accessToken, refreshToken });
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async loginGoogle(req, res) {
    try {
      const { token } = req.body;
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userInfo = userInfoResponse.data;

      const user = await UserService.findEmail(userInfo.email);
      if (!user) {
        const userData = {
          lastName: userInfo.given_name,
          firstName: userInfo.family_name,
          email: userInfo.email,
          role: 1,
          status: 1,
          method: 2,
        };

        await UserService.createUser(userData);

        const user = await UserService.findEmail(userData.email);

        const accessToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 1 * 60,
        });

        const refreshToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 90 * 24 * 60 * 60,
        });

        res.status(200).json({ user: user, accessToken, refreshToken });
      } else {
        if (user.status === 2) {
          throw new Error("Tài khoản của bạn đã bị khóa !");
        }

        const accessToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 1 * 60,
        });

        const refreshToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 90 * 24 * 60 * 60,
        });

        res.status(200).json({ user: user, accessToken, refreshToken });
      }
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async loginFacebook(req, res) {
    try {
      const { token } = req.body;
      const userInfoResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
      );

      const userInfo = userInfoResponse.data;

      const user = await UserService.findEmail(userInfo.email);
      if (!user) {
        const nameParts = userInfo.name.split(" ");

        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        const userData = {
          lastName: lastName,
          firstName: firstName,
          email: userInfo.email,
          role: 1,
          status: 1,
          method: 2,
        };

        await UserService.createUser(userData);

        const user = await UserService.findEmail(userData.email);

        const accessToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 1 * 60,
        });

        const refreshToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 90 * 24 * 60 * 60,
        });

        res.status(200).json({ user: user, accessToken, refreshToken });
      } else {
        if (user.status === 2) {
          throw new Error("Tài khoản của bạn đã bị khóa !");
        }

        const accessToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 1 * 60,
        });

        const refreshToken = jwt.sign({ user: user }, "vothanhphuong", {
          expiresIn: 90 * 24 * 60 * 60,
        });

        res.status(200).json({ user: user, accessToken, refreshToken });
      }
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      let { refreshToken } = req.body;
      const data = jwt.verify(refreshToken, "vothanhphuong");
      const accessToken = jwt.sign({ user: data.user }, "vothanhphuong", {
        expiresIn: 1 * 60,
      });
      refreshToken = jwt.sign({ user: data.user }, "vothanhphuong", {
        expiresIn: 90 * 24 * 60 * 60,
      });
      res.status(200).json({ user: data.user, accessToken, refreshToken });
    } catch (error) {
      res.status(414).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const { status } = req.body;

      const user = await UserService.getOneUser(id);

      if (!user) {
        throw new Error("user không tồn tại");
      }

      user.status = status;

      await UserService.updateUser(id, user);
      res.status(200).json(user);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async updatePhone(req, res) {
    try {
      const id = req.params.id;
      const { phone } = req.body;

      await UserService.updatePhone(id, phone);

      res.status(200).send(phone);
    } catch (error) {
      console.error(error.stack);
      res.status(500).send({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const result = await UserService.deleteUser(id);
      if (result.deletedCount === 1) {
        res.status(200).send("User deleted successfully");
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error(error.stack);
      res.status(500).send("Error deleting the user");
    }
  }

  async sendContact(req, res) {
    try {
      const { name, email, message } = req.body;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "phuongvtps31738@gmail.com",
          pass: "tkpwxvgvgkjytsqn",
        },
      });

      const mailOptions = {
        from: email,
        to: "phuongvtps31738@gmail.com",
        subject: `Liên lạc mới PHONE TECHNOLOGY`,
        html: `
          <h1>Thông tin liên lạc</h1>
          <p><strong>Tên:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Nội dung:</strong> ${message}</p>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).send({ message: "Lỗi khi gửi email" });
        } else {
          return res.status(200).send({ message: "Email sent" });
        }
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const emailExist = await UserService.findEmail(email);

      if (!emailExist) {
        throw new Error("Người dùng không tồn tại!");
      }

      // Kiểm tra và loại bỏ token cũ nếu có

      // Loại bỏ token cũ
      emailExist.resetToken = undefined;
      emailExist.resetTokenExpiration = undefined;
      await UserService.updateUser(emailExist._id, {
        resetToken: undefined,
        resetTokenExpiration: undefined,
      });

      // Tạo mã token mới
      const resetToken = jwt.sign({ user: emailExist }, "vothanhphuong", {
        expiresIn: "5m",
      });

      // Cập nhật người dùng với token mới và thời gian hết hạn của nó
      await UserService.updateUser(emailExist._id, {
        resetToken: resetToken,
        resetTokenExpiration: Date.now() + 5 * 60 * 1000,
      });

      // Gửi email reset mật khẩu
      const link = `${domain}/forgot?token=${resetToken}`;

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "phuongvtps31738@gmail.com",
          pass: "tkpwxvgvgkjytsqn",
        },
      });

      var mailOptions = {
        from: "phuongvtps31738@gmail.com",
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `<table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f5f5f5; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 20px;">
                      <h1 style="color: #333; margin-bottom: 10px;">Đặt lại mật khẩu</h1>
                      <p style="color: #666; margin-bottom: 20px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Vui lòng nhấp vào liên kết bên dưới trong vòng 5 phút để hoàn tất quy trình:</p>
                      <table style="width: 100%; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                        <tr>
                          <td style="padding: 20px;">
                            <a href="${link}" style="display: block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; text-align: center;">Đặt lại mật khẩu</a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #666; margin-top: 20px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                      <p style="color: #666; margin-top: 10px;">Trân trọng,<br>Đội ngũ hỗ trợ<br><em><strong>Phone Technology - TP</strong></em></p>
                    </td>
                  </tr>
                </table>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).send({ emailExist, resetToken });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const id = req.params.id;
      const { oldPassword, newPassword } = req.body;

      const user = await UserService.getOneUser(id);

      if (!oldPassword || !newPassword) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }

      if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error("Mật khẩu cũ không đúng");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const result = await UserService.updateUser(id, {
        password: hashedPassword,
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async resetPasswordPut(req, res) {
    try {
      const id = req.params.id;
      const { password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await UserService.updateUser(id, {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiration: undefined,
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

module.exports = new UserController();
