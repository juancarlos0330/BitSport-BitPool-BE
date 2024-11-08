"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserInfo = exports.removeUser = exports.getAllUser = exports.getEarnedMoney = exports.getReferalInfo = exports.resetPassword = exports.forgotPassword = exports.SignIn = exports.SignUp = exports.sendEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ejs_1 = __importDefault(require("ejs"));
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const crypto_1 = __importDefault(require("crypto"));
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const helpers_1 = require("../service/helpers");
const config_1 = require("../config");
const ethers_1 = require("../service/wallet/ethers");
// import { getBTCPrivateKeyAndWalletAddress } from '../service/wallet/bitcoin';
const tron_1 = require("../service/wallet/tron");
const mg = (0, mailgun_js_1.default)({
    apiKey: config_1.Mailgun_API_KEY,
    domain: "bitpool.gg",
});
const sendEmail = (email, subject, content) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        from: "bitpool@mail.bitsport.gg",
        to: email,
        subject: subject,
        html: content,
    };
    try {
        const result = yield mg.messages().send(data);
        console.log("Email sent successfully:", result);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendEmail = sendEmail;
/**
 * User registration function
 * @param req
 * @param res
 * @returns
 */
const increaseReferralCnt = (referralId) => __awaiter(void 0, void 0, void 0, function* () {
    if (referralId == 0)
        return;
    const user = yield User_1.default.findOne({ index: referralId });
    let tempCnt = user === null || user === void 0 ? void 0 : user.referralCnt;
    if (user && user.referralCnt !== undefined) {
        tempCnt++;
        user.referralCnt = tempCnt;
        yield user.save();
    }
});
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.json({
            success: false,
            message: "Please, send your email and password.",
        });
    }
    const existingUser = yield User_1.default.findOne({ username: req.body.username });
    if (existingUser) {
        return res.json({ success: false, message: "Username already exists!" });
    }
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (user) {
        return res.json({ success: false, message: "User already exists!" });
    }
    const ether = (0, ethers_1.getEtherPrivateKeyAndWalletAddress)();
    // const btc = getBTCPrivateKeyAndWalletAddress();
    const tron = (0, tron_1.getTronPrivateKeyAndWalletAddress)();
    const buyBitpAddr = (0, ethers_1.getEtherPrivateKeyAndWalletAddress)();
    let length = 0;
    yield User_1.default.find()
        .countDocuments()
        .then((data) => (length = data));
    yield increaseReferralCnt(req.body.referralId);
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
                privateKey: (yield tron).privateKey,
                address: (yield tron).address,
            },
        },
        latestEarnAmount: 0,
        latestEarnUnit: "BUSD",
        latestPlayedTotalStreak: 0,
        latestPlayedCurStreak: 0,
        ipAddress: req.body.ipAddress,
        index: length + 1,
    };
    const newUser = new User_1.default(payload);
    yield newUser.save();
    res.json({ success: true, token: (0, helpers_1.generateToken)(newUser) });
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
});
exports.SignUp = SignUp;
/**
 * User login function
 * @param req
 * @param res
 * @returns
 */
const SignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.json({ success: false, message: "No Input Data!" });
    }
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ success: false, message: "User does not exists!" });
    }
    const isMatch = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (isMatch) {
        yield (0, exports.refreshUserInfo)(user);
        return res.json({ success: true, token: (0, helpers_1.generateToken)(user) });
    }
    return res.json({
        success: false,
        message: "The email or password are incorrect!",
    });
});
exports.SignIn = SignIn;
/**
 * User forgotPassword function
 * @param req
 * @param res
 * @returns
 */
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        return res.json({ success: false, message: "No Input Data!" });
    }
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ success: false, message: "User does not exists!" });
    }
    let token = yield Token_1.default.findOne({ userId: user._id });
    if (token) {
        yield token.deleteOne();
    }
    let resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const hash = yield bcrypt_1.default.hash(resetToken, 10);
    yield new Token_1.default({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();
    const link = `${config_1.CLIENT_URI}/passwordReset?token=${resetToken}&id=${user._id}`;
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
    const template = yield ejs_1.default.renderFile("utils/email/template.ejs", {
        link,
    });
    yield (0, exports.sendEmail)(user.email, "Password Reset Request", template);
    return res.json({
        success: true,
        message: "Email sent successfully!",
    });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let passwordResetToken = yield Token_1.default.findOne({ userId: req.body.userId });
    if (!passwordResetToken) {
        return res.json({
            success: false,
            message: "Invalid or expired password reset token!",
        });
    }
    const isValid = yield bcrypt_1.default.compare(req.body.token, passwordResetToken.token);
    if (!isValid) {
        return res.json({
            success: false,
            message: "Invalid or expired password reset token!!",
        });
    }
    const hash = yield bcrypt_1.default.hash(req.body.password, 10);
    yield User_1.default.updateOne({ _id: req.body.userId }, { $set: { password: hash } }, { new: true });
    const user = yield User_1.default.findById({ _id: req.body.userId });
    yield passwordResetToken.deleteOne();
    res.json({ success: true, message: "Updated your password successfully!" });
});
exports.resetPassword = resetPassword;
const getReferalInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.body.userId);
    const referralFriends = yield User_1.default.find({ referralId: user === null || user === void 0 ? void 0 : user.index });
    const data = referralFriends.map((item) => {
        return { username: item.username, earnMoney: item.earnMoney };
    });
    return res.json({
        success: true,
        data: data,
    });
});
exports.getReferalInfo = getReferalInfo;
const getEarnedMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.body.userId);
    return res.json({
        success: true,
        latestEarnedAmount: user === null || user === void 0 ? void 0 : user.latestEarnAmount,
        latestEarnedUnit: user === null || user === void 0 ? void 0 : user.latestEarnUnit,
        totalEarnedMoney: user === null || user === void 0 ? void 0 : user.earnMoney,
        totalStreak: user === null || user === void 0 ? void 0 : user.latestPlayedTotalStreak,
        curStreak: user === null || user === void 0 ? void 0 : user.latestPlayedCurStreak,
    });
});
exports.getEarnedMoney = getEarnedMoney;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.find().then((models) => {
        res.json({ models });
    });
});
exports.getAllUser = getAllUser;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findByIdAndDelete(req.body.userId).then((model) => {
        res.json({ success: true, model });
    });
});
exports.removeUser = removeUser;
const refreshUserInfo = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.buy_BitpAddr.address == undefined) {
        user.buy_BitpAddr = (0, ethers_1.getEtherPrivateKeyAndWalletAddress)();
        yield user.save();
    }
});
exports.refreshUserInfo = refreshUserInfo;
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
