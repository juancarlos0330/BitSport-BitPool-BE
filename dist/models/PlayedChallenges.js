"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const PlayedChallengeSchema = new mongoose_1.Schema({
    user_id: { type: Number, required: true },
    challenge_id: { type: Number, required: true },
    start_match: { type: String, required: true, trim: true },
    end_match: { type: String, required: true, trim: true },
    winorloss: { type: String, required: true, trim: true },
    status: { type: Number },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * ICHallenge Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("PlayedChallenge", PlayedChallengeSchema);
