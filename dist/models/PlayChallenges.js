"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const PlayChallengeSchema = new mongoose_1.Schema({
    user_id: { type: Number, required: true },
    challenge_id: { type: Number, required: true, default: 0 },
    current_match: { type: Number, required: true, trim: true, default: 0 },
    isFinished: { type: Boolean, required: true, default: false },
    win_match: { type: Number, required: true, trim: true, default: 0 },
    loss_match: { type: Number, required: true, trim: true, default: 0 },
    tot_match: { type: Number, required: true, trim: true, default: 0 },
    wonchallenge: { type: Number, required: true, trim: true, default: 0 },
    status: { type: Number, required: true, trim: true, default: 0 },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * IPlayCHallenge Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("PlayChallenge", PlayChallengeSchema);
