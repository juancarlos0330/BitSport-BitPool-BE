"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatar = void 0;
const express_1 = require("express");
const helpers_1 = require("../service/helpers");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
const avatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.userID)
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            const multerReq = req;
            if (!(multerReq === null || multerReq === void 0 ? void 0 : multerReq.file)) {
                // No file was uploaded, handle error
                res.status(400).json({ success: false, message: "No file uploaded" });
                return;
            }
            // Access the uploaded file using req.file
            const { filename, originalname } = multerReq.file;
            user.avatar = filename;
            yield user.save();
            // Process the file as needed (e.g., save the filename to the user's profile)
            res.json({
                success: true,
                message: "Avatar uploaded successfully",
                filename,
                originalname,
                token: (0, helpers_1.generateToken)(user),
            });
        }
        else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    }))
        .catch((error) => {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: "An error occurred" });
    });
});
exports.avatar = avatar;
exports.default = router;
