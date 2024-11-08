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
exports.joinTelegram = exports.joinDiscord = exports.followerTwitter = void 0;
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../service/helpers");
// export const setupWebSocket = (server) => {
//   const wss = new WebSocket.Server({ server });
//   wss.on("connection", (ws) => {
//     console.log("Client connected");
//     ws.on("message", (message) => {
//       console.log(`Received: ${message}`);
//     });
//     ws.send("Welcome to the server!");
//   });
//   console.log("WebSocket server set up");
// };
const followerTwitter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => {
        if (user) {
            user.airdropIndex = 1;
            user.save();
            res.json({
                success: true,
                token: (0, helpers_1.generateToken)(user),
            });
        }
        else {
            res.json({
                success: false,
            });
        }
    });
});
exports.followerTwitter = followerTwitter;
const joinDiscord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => {
        if (user) {
            user.airdropIndex = 3;
            user.save();
            if (user.referralId != 0) {
                User_1.default.findOne({ index: user.referralId }).then((user1) => {
                    if (user1.airdropIndex == 3) {
                        user1.money.bitp += 10;
                        user1.save();
                    }
                });
            }
            res.json({
                success: true,
                token: (0, helpers_1.generateToken)(user),
            });
        }
        else {
            res.json({
                success: false,
            });
        }
    });
});
exports.joinDiscord = joinDiscord;
const joinTelegram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => {
        if (user) {
            user.airdropIndex = 2;
            user.save();
            res.json({
                success: true,
                token: (0, helpers_1.generateToken)(user),
            });
        }
        else {
            res.json({
                success: false,
            });
        }
    });
});
exports.joinTelegram = joinTelegram;
