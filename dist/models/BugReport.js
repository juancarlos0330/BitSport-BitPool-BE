"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const BugSchema = new mongoose_1.Schema({
    BugTitle: { type: String, required: true },
    BugDescription: { type: String, required: true },
    BugReportLink: { type: String },
    status: { type: Number, required: true, default: 0 },
    ReporterId: { type: String, required: true },
    ReportReply: { type: String },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * IUser Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("Bug", BugSchema);
