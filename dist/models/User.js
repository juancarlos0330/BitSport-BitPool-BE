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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Create a new Schema from mongoose
 */
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
    },
    airdropIndex: { type: Number, required: true, default: 0 },
    role: { type: Number, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    avatar: { type: String, required: false },
    money: {
        busd: { type: Number, required: true },
        usdt: { type: Number, required: true },
        usd: { type: Number, required: true },
        bitp: { type: Number, required: true },
        quest: { type: Number, required: true },
        cake: { type: Number, required: true },
    },
    bonus: {
        busd: { type: Number, required: true },
        usdt: { type: Number, required: true },
        usd: { type: Number, required: true },
        bitp: { type: Number, required: true },
        quest: { type: Number, required: true },
        cake: { type: Number, required: true },
    },
    referralId: { type: Number, required: true, default: 0 },
    referralCnt: { type: Number, required: true, default: 0 },
    earnMoney: {
        busd: { type: Number, required: true },
        usdt: { type: Number, required: true },
        bitp: { type: Number, required: true },
        cake: { type: Number, required: true },
        usd: { type: Number, required: true },
    },
    buy_BitpAddr: {
        privateKey: { type: String, required: true },
        address: { type: String, required: true },
    },
    address: {
        ether: {
            privateKey: { type: String, required: true },
            address: { type: String, required: true },
        },
        bitcoin: {
            privateKey: { type: String, required: true },
            address: { type: String, required: true },
        },
        tron: {
            privateKey: { type: String, required: true },
            address: { type: String, required: true },
        },
    },
    txcount: {
        usd: { type: Number, required: true, default: 0 },
        busd: { type: Number, required: true, default: 0 },
        usdt: { type: Number, required: true, default: 0 },
        cake: { type: Number, required: true, default: 0 },
    },
    latestEarnAmount: { type: Number, required: true, default: 0 },
    latestEarnUnit: { type: String, required: true, default: "BUSD" },
    latestPlayedTotalStreak: { type: Number, required: true, default: 0 },
    latestPlayedCurStreak: { type: Number, required: true, default: 0 },
    ipAddress: { type: String, default: "" },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * A promise to be either resolved with the encrypted data salt or rejected with an Error
 */
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password"))
            return next();
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(user.password, salt);
        user.password = hash;
        next();
    });
});
/**
 * IUser Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("User", UserSchema);
