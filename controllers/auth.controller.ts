import fs from "fs";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import ejs from "ejs";
import path from "path";
import { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import axios from "axios";
import mailgun from "mailgun-js";

import { generateToken } from "../service/helpers";
import {
  USER_EMAIL,
  USER_PASSWORD,
  APP_SERVER_URI,
  CLIENT_URI,
  SENDGRID_API_KEY,
  Mailgun_API_KEY,
} from "../config";
import { getEtherPrivateKeyAndWalletAddress } from "../service/wallet/ethers";
// import { getBTCPrivateKeyAndWalletAddress } from '../service/wallet/bitcoin';
import { getTronPrivateKeyAndWalletAddress } from "../service/wallet/tron";

const mg = mailgun({
  apiKey: Mailgun_API_KEY,
  domain: "bitpool.gg",
});
export const sendEmail = async (email, subject, content) => {
  const data = {
    from: "bitpool@mail.bitsport.gg", // Replace with your verified sender email (Mailgun domain email)
    to: email,
    subject: subject,
    html: content,
  };

  try {
    const result = await mg.messages().send(data);
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * User registration function
 * @param req
 * @param res
 * @returns
 */

const increaseReferralCnt = async (referralId: number) => {
  if (referralId == 0) return;
  const user = await User.findOne({ index: referralId });

  let tempCnt: number = user?.referralCnt as number;
  if (user && user.referralCnt !== undefined) {
    tempCnt++;
    user.referralCnt = tempCnt;
    await user.save();
  }
};

export const SignUp = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.json({
      success: false,
      message: "Please, send your email and password.",
    });
  }

  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.json({ success: false, message: "Username already exists!" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.json({ success: false, message: "User already exists!" });
  }

  const ether = getEtherPrivateKeyAndWalletAddress();
  // const btc = getBTCPrivateKeyAndWalletAddress();
  const tron = getTronPrivateKeyAndWalletAddress();

  const buyBitpAddr = getEtherPrivateKeyAndWalletAddress();

  let length = 0;
  await User.find()
    .countDocuments()
    .then((data: any) => (length = data));

  await increaseReferralCnt(req.body.referralId);

  const payload = {
    username: req.body.username,
    email: req.body.email,
    role: 0,
    password: req.body.password,
    referralId: req.body.referralId,
    referralCnt: 0,
    money: { busd: 0, usdt: 0, usd: 0, bitp: 0, quest: 3, cake: 0 },
    bonus: { busd: 0, usdt: 0, usd: 0, bitp: 0, quest: 0, cake: 0 },
    earnMoney: { busd: 0, usdt: 0, bitp: 0, cake: 0, usd: 0 },
    buy_BitpAddr: {
      privateKey: buyBitpAddr.privateKey,
      address: buyBitpAddr.address,
    },
    address: {
      ether: { privateKey: ether.privateKey, address: ether.address },
      bitcoin: { privateKey: ether.privateKey, address: ether.address },
      tron: {
        privateKey: (await tron).privateKey,
        address: (await tron).address,
      },
    },
    latestEarnAmount: 0,
    latestEarnUnit: "BUSD",
    latestPlayedTotalStreak: 0,
    latestPlayedCurStreak: 0,
    ipAddress: req.body.ipAddress,
    index: length + 1,
  };

  const newUser = new User(payload);
  await newUser.save();

  res.json({ success: true, token: generateToken(newUser) });

  // const transfer = nodemailer.createTransport({
  //   host: 'email-smtp.us-west-1.amazonaws.com',
  //   port: 587,
  //   auth: {
  //     user: USER_EMAIL,
  //     pass: USER_PASSWORD
  //   },
  //   secure: false,
  //   requireTLS: true,
  //   from: "welcome@bitsport.gg"
  // });
  // const templatePath = path.resolve('../server/template');
  // const templateFile = await fs.readFileSync(templatePath + "/welcome.hbs", "utf8");
  // const template = handlebars.compile(templateFile);
  // let data = { username: req.body.username };
  // let html = template(data);

  // transfer.sendMail({
  //   from: `Bitsports <welcome@bitsport.gg>`,
  //   to: `${req.body.email}`,
  //   subject: `Success to receive from ${newUser.firstname} ${newUser.lastname}!`,
  //   html
  // }, (err, data) => {
  //   if(err) res.json({ success: false, message: 'Sorry! Request has an error!' });
  // else
  // });
};

/**
 * User login function
 * @param req
 * @param res
 * @returns
 */
export const SignIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res.json({ success: false, message: "No Input Data!" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: false, message: "User does not exists!" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (isMatch) {
    await refreshUserInfo(user);
    return res.json({ success: true, token: generateToken(user) });
  }

  return res.json({
    success: false,
    message: "The email or password are incorrect!",
  });
};

/**
 * User forgotPassword function
 * @param req
 * @param res
 * @returns
 */
export const forgotPassword = async (req: Request, res: Response) => {
  if (!req.body.email) {
    return res.json({ success: false, message: "No Input Data!" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: false, message: "User does not exists!" });
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${CLIENT_URI}/passwordReset?token=${resetToken}&id=${user._id}`;

  // sgMail.setApiKey(`${SENDGRID_API_KEY}`);

  // const sendEmail = async (email, subject, content) => {
  //   const msg = {
  //     to: email,
  //     from: '', // Replace with your verified sender email
  //     subject: subject,
  //     html: content,
  //   };

  //   try {
  //     await sgMail.send(msg);
  //     console.log('Email sent successfully');
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // };

  const template = await ejs.renderFile("utils/email/template.ejs", {
    link,
  });

  await sendEmail(user.email, "Password Reset Request", template);

  return res.json({
    success: true,
    message: "Email sent successfully!",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  let passwordResetToken = await Token.findOne({ userId: req.body.userId });
  if (!passwordResetToken) {
    return res.json({
      success: false,
      message: "Invalid or expired password reset token!",
    });
  }
  const isValid = await bcrypt.compare(
    req.body.token,
    passwordResetToken.token
  );
  if (!isValid) {
    return res.json({
      success: false,
      message: "Invalid or expired password reset token!!",
    });
  }
  const hash = await bcrypt.hash(req.body.password, 10);
  await User.updateOne(
    { _id: req.body.userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: req.body.userId });

  await passwordResetToken.deleteOne();
  res.json({ success: true, message: "Updated your password successfully!" });
};

export const getReferalInfo = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.userId);
  const referralFriends = await User.find({ referralId: user?.index });
  const data = referralFriends.map((item) => {
    return { username: item.username, earnMoney: item.earnMoney };
  });
  return res.json({
    success: true,
    data: data,
  });
};

export const getEarnedMoney = async (req: Request, res: Response) => {
  const user = await User.findById(req.body.userId);
  return res.json({
    success: true,
    latestEarnedAmount: user?.latestEarnAmount,
    latestEarnedUnit: user?.latestEarnUnit,
    totalEarnedMoney: user?.earnMoney,
    totalStreak: user?.latestPlayedTotalStreak,
    curStreak: user?.latestPlayedCurStreak,
  });
};

export const getAllUser = async (req: Request, res: Response) => {
  User.find().then((models: any) => {
    res.json({ models });
  });
};

export const removeUser = async (req: Request, res: Response) => {
  User.findByIdAndDelete(req.body.userId).then((model: any) => {
    res.json({ success: true, model });
  });
};

export const refreshUserInfo = async (user: any) => {
  if (user.buy_BitpAddr.address == undefined) {
    user.buy_BitpAddr = getEtherPrivateKeyAndWalletAddress();
    await user.save();
  }
};

// export const edit = async (req: Request, res: Response) => {
//   User.findOne({
//     _id: req.body.userId,
//   }).then(async (model: any) => {
//     if (!model) res.json({ success: false, message: "The Task not exits!" });
//     model.title = req.body.title;
//     model.description = req.body.description;
//     model.reward = req.body.reward;
//     model.unit = req.body.unit;
//     model.status = req.body.status;
//     model.shared = req.body.shared;
//     model.save().then(() => {
//       res.json({ success: true, model });
//     });
//   });
// };
