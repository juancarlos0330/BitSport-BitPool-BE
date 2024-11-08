"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const TaskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    reward: { type: Number, required: true },
    unit: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    shared: { type: Boolean, required: true, default: true },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * IUser Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("Task", TaskSchema);
