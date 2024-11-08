"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const Deposit_historySchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    network: { type: String, required: true },
    address: { type: String, required: true },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * IDHistory Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("deposit_history", Deposit_historySchema);
