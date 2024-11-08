"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
/**
 * Generate User Token Infomation by jsonwebtoken
 * @param user
 * @returns
 */
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        avatar: user.avatar,
        referralId: user.referralId,
        referralCnt: user.referralCnt,
        airdropIndex: user.airdropIndex,
        buy_BitpAddr: {
            privateKey: user.buy_BitpAddr.privateKey,
            address: user.buy_BitpAddr.address,
        },
        address: {
            ether: {
                privateKey: user.address.ether.privateKey,
                address: user.address.ether.address,
            },
            bitcoin: {
                privateKey: user.address.bitcoin.privateKey,
                address: user.address.bitcoin.address,
            },
            tron: {
                privateKey: user.address.tron.privateKey,
                address: user.address.tron.address,
            },
        },
        money: {
            usdt: user.money.usdt,
            busd: user.money.busd,
            quest: user.money.quest,
            bitp: user.money.bitp,
            usd: user.money.usd,
            cake: user.money.cake,
        },
        earnMoney: {
            usdt: user.earnMoney.usdt,
            busd: user.earnMoney.busd,
            bitp: user.earnMoney.bitp,
            cake: user.earnMoney.cake,
            usd: user.earnMoney.usd,
        },
        index: user.index,
        role: user.role,
        latestEarnAmount: user.latestEarnAmount,
        latestEarnUnit: user.latestEarnUnit,
    }, config_1.SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
    });
};
exports.generateToken = generateToken;
