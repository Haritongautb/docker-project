import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import paypal from "paypal-rest-sdk";
import UserModel from "../models/User.js";
import ReceiptModel from "../models/Receipt.js";
import { connectStateMsgs } from "../configMsgs/index.js";

export const createOwner = async () => {
  try {
    await UserModel.findOneAndDelete({
      email: process.env.OWNER_EMAIL,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.OWNER_PASS, salt);

    const doc = new UserModel({
      email: process.env.OWNER_EMAIL,
      fullName: "Khanh",
      avatarUrl: null,
      passwordHash: hash,
      role: "owner",
    });

    const user = await doc.save();

    if (user) {
      console.log("owner was created =>>>>");
    }
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
      role: req.body.role,
    });

    const user = await doc.save();

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      ...userData,
    });
  } catch (error) {
    console.log(connectStateMsgs.errorMsg("register error =>>>>", error));
    return res.status(500).json({
      message: "failed to register",
    });
  }
};

export const signIN = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Incorrect login or password",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.status(404).json({
        message: "Incorrect login or password",
      });
    }

    const updatedToken = jwt.sign(
      {
        _id: user._id,
      },
      `${process.env.TOKEN_KEY}`,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    return res.json({
      ...userData,
      token: updatedToken,
    });
  } catch (error) {
    console.log(connectStateMsgs.errorMsg("singIN error =>>>>", error));
    return res.status(500).json({
      message: "failed to sign in",
    });
  }
};

export const getDataAboutMe = async (req, res) => {
  try {
    const user = await UserModel.findById({
      _id: req.body.userID,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    return res.json(userData);
  } catch (error) {
    console.log(connectStateMsgs.errorMsg("getDataABoutMe error =>>>>", error));
    return res.status(500).json({
      message: "No access",
    });
  }
};

export const getDataAboutAdmin = async (req, res) => {
  try {
    const user = await UserModel.findById({
      _id: req.body.userID,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    return res.json(userData);
  } catch (error) {
    console.log(connectStateMsgs.errorMsg("getDataABoutMe error =>>>>", error));
    return res.status(500).json({
      message: "No access",
    });
  }
};

export const removeMyAccount = async (req, res) => {
  try {
    const userDoc = await UserModel.findByIdAndDelete(req.body.userID);
    if (!userDoc) {
      return res.status(404).json({
        message: "Couldn't remove your account. Something is wrong",
      });
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldn't remove your account. Something is wrong",
    });
  }
};

export const updateMyAccount = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const updatedDoc = await UserModel.findByIdAndUpdate(
      {
        _id: req.body.userID,
      },
      {
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
        date: new Date(),
      },
      {
        new: true,
      }
    );

    if (!updatedDoc) {
      return res.status(404).json({
        message: "Couldn't find post",
      });
    }

    return res.json({
      ...updatedDoc._doc,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldn't find account",
    });
  }
};

export const createSubscribe = async (req, res) => {
  console.log("req body =>>>>", req.body);
  const { userID, amount, title } = req.body;

  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.subscribed) {
      return res.json({
        message: "You're already subscribed",
      });
    }

    paypal.payment.create(
      {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          cancel_url: "https://i.redd.it/ser7dxmw2lr21.jpg",
        },
        transactions: [
          {
            amount: {
              currency: "USD",
              total: amount,
            },
            description: `Payment for subscribe to news by ${user.fullName}`,
          },
        ],
      },
      async function (error, payment) {
        if (error) {
          throw error;
        } else {
          const receipt = new ReceiptModel({
            title,
            user: userID,
            amount,
          });

          const savedReceipt = await receipt.save();
          user.subscribed = true;
          user.receipts.push(savedReceipt._id);
          await user.save();

          console.log(payment);

          return res.json({ approval_url: payment.links[1].href });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error creating subscription",
    });
  }
};

export const checkIsSuccess = async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.subscribed = true;
    await user.save();

    return res.json({
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Error updating subscription status:", error);
    res.status(500).json({ message: "Error updating subscription status" });
  }
};
