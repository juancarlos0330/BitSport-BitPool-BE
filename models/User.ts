import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */
const UserSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

/**
 * A promise to be either resolved with the encrypted data salt or rejected with an Error
 */
UserSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

/**
 * IUser Interface Document class inheritance
 */
export default model<IUser>("User", UserSchema);
