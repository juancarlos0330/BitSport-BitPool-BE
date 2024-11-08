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
exports.remove = exports.password = exports.names = exports.index = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpers_1 = require("../service/helpers");
const User_1 = __importDefault(require("../models/User"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.find().then((models) => {
        res.json({ models });
    });
});
exports.index = index;
const names = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.userID).then((user) => {
        if (user) {
            user.username = req.body.userName;
            user.firstname = req.body.firstName;
            user.lastname = req.body.lastName;
            user.save();
            res.json({
                success: true,
                message: "You submitted successfully.",
                token: (0, helpers_1.generateToken)(user),
            });
            return;
        }
    });
});
exports.names = names;
const password = (req, res) => {
    User_1.default.findById(req.body.userID)
        .then((user) => {
        if (user) {
            return bcrypt_1.default.compare(req.body.currentPwd, user.password);
        }
        else {
            throw new Error("User not found");
        }
    })
        .then((isMatch) => {
        if (isMatch) {
            return bcrypt_1.default.hash(req.body.newPwd, 10); // Hash the new password
        }
        else {
            throw new Error("Incorrect old password. Please try again.");
        }
    })
        .then((hashedPassword) => {
        return User_1.default.findByIdAndUpdate(req.body.userID, { password: hashedPassword }, { new: true });
    })
        .then((updatedUser) => {
        res.json({
            success: true,
            message: "Password updated successfully.",
            token: (0, helpers_1.generateToken)(updatedUser),
        });
    })
        .catch((error) => {
        res.json({
            success: false,
            message: error.message,
        });
    });
};
exports.password = password;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findByIdAndDelete(req.params.id).then((model) => {
        res.json({ success: true, model });
    });
});
exports.remove = remove;
