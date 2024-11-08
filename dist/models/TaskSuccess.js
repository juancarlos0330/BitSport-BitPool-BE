"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const TaskSuccessSchema = new mongoose_1.Schema({
    taskId: { type: String, required: true },
    userId: { type: String, required: true },
    reportDate: { type: Date, required: true },
    reportDesc: { type: String, required: true },
    reportLink: { type: String, required: true },
    taskStatus: { type: Number, required: true, default: -1 },
    statusNote: { type: String },
    getReward: { type: Boolean, required: true, default: false },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * IUser Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("TaskSuccess", TaskSuccessSchema);
