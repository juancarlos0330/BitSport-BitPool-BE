"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const ChallengeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    difficulty: { type: Number, required: true },
    streak: { type: Number, required: true },
    amount: { type: Number, required: true },
    coin_sku: { type: Number, required: true },
    loss_back: { type: String },
    status: { type: Number, required: true, default: 1 },
    qc: { type: Number, required: true },
    number_of_players: { type: Number, required: true },
    played_number_count: { type: Number, required: true },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * ICHallenge Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("Challenge", ChallengeSchema);
