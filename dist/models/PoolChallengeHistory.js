"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const PoolChallengeHistorySchema = new mongoose_1.Schema({
    challengeid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PoolChallenge",
    },
    game_userid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    game_result: {
        type: String,
        required: true,
    },
}, { timestamps: true });
/**
 * ICHallenge Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("poolhistories", PoolChallengeHistorySchema);
