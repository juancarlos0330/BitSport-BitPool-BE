"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const PoolChallengeSchema = new mongoose_1.Schema({
    create_userid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    opponent_userid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    status_num: {
        type: Number,
        default: 0,
    },
    coin_type: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    gametype: {
        type: Boolean,
        default: true,
    },
    joinUser: {
        type: Boolean,
        default: false,
    },
    joinOpponent: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
/**
 * ICHallenge Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("PoolChallenge", PoolChallengeSchema);
