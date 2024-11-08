"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
/**
 * Create a new Schema from mongoose
 */
const Withdraw_historySchema = new mongoose_1.Schema({
    user: { type: mongoose_2.default.Types.ObjectId, ref: 'User' },
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    network: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: Number, required: true }
}, { timestamps: true });
/**
 * IHistory Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("Withdraw_history", Withdraw_historySchema);
