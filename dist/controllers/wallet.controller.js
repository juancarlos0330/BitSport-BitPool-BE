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
exports.check = exports.remove = exports.withdrawHistoryAdmin = exports.withdrawHistory = exports.swap = exports.buyBITP = exports.withdraw = exports.deposit = exports.refreshWalletBalance = exports.getUserInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const tronweb_1 = __importDefault(require("tronweb"));
const web3_1 = __importDefault(require("web3"));
const User_1 = __importDefault(require("../models/User"));
const Withdraw_history_1 = __importDefault(require("../models/Withdraw_history"));
const Deposit_history_1 = __importDefault(require("../models/Deposit_history"));
/*
// const stripe = require("stripe")(
//   "sk_test_51NhPLDICP61ZVN0fa2TEYer2ndG80Wr4GhLKctTlG07ijqooDzYXMi8KrhO7oZLGak1uVCfMo9kcx7L5X4u7GGiC00eqenp5CO"
// );
*/
const BigNumber = require("bignumber.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config_1 = require("../config");
const helpers_1 = require("../service/helpers");
const contractApi_1 = __importDefault(require("../service/contractApi"));
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => {
        if (user) {
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
exports.getUserInfo = getUserInfo;
const withdrawFunc = (web3Provider, coin_address, network, amount, withdrawAddr) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = new web3_1.default(web3Provider);
    const contractAbi = contractApi_1.default;
    const contractInstance = new web3.eth.Contract(contractAbi, coin_address);
    const gasPrice = yield web3.eth.getGasPrice();
    let withdrawAmount = new BigNumber(0);
    yield contractInstance.methods.decimals().call((error, result) => {
        if (!error) {
            console.log(`The ${coin_address} token has ${result} decimal places.`);
            withdrawAmount = amount * Math.pow(10, result);
        }
        else {
            console.error(error);
        }
    });
    const transferFunc = contractInstance.methods.transfer(withdrawAddr, withdrawAmount.toString());
    transferFunc
        .estimateGas({
        from: process.env.ADMIN_WALLET,
    })
        .then((gasAmount) => {
        web3.eth.getGasPrice().then((gasPrice) => __awaiter(void 0, void 0, void 0, function* () {
            const senderPrivateKey = process.env.ADMIN_PRIVATEKEY;
            const account = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
            web3.eth.defaultAccount = account.address;
            const txObject = {
                from: web3.eth.defaultAccount,
                to: coin_address,
                gas: gasAmount,
                gasPrice: gasPrice,
                data: contractInstance.methods
                    .transfer(withdrawAddr, withdrawAmount.toString())
                    .encodeABI(),
            };
            const signedTx = yield web3.eth.accounts.signTransaction(txObject, senderPrivateKey);
            const sentTx = yield web3.eth.sendSignedTransaction(signedTx.rawTransaction ? signedTx.rawTransaction : "");
            console.log(sentTx);
        }));
    });
});
const sendGasFeeTrx = (adminPrivateKey, userWalletAddress, gasFee) => __awaiter(void 0, void 0, void 0, function* () {
    const tronWeb = new tronweb_1.default({
        fullNode: "https://api.trongrid.io",
        solidityNode: "https://api.trongrid.io",
        eventServer: "https://api.trongrid.io",
        privateKey: adminPrivateKey,
    });
    const options = {
        feeLimit: 100000000,
        callValue: tronWeb.toSun(gasFee),
        shouldPollResponse: true,
    };
    const transaction = yield tronWeb.transactionBuilder.sendTrx(userWalletAddress, options.callValue);
    const signed = yield tronWeb.trx.sign(transaction, tronWeb.defaultPrivateKey);
    const receipt = yield tronWeb.trx.sendRawTransaction(signed);
    console.log("Transaction sent:", receipt.txid);
});
const sendTokenToAdmin = (userPrivateKey, adminWalletAddress, tokenAmount, contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const tronWeb = new tronweb_1.default("https://api.trongrid.io", "https://api.trongrid.io", "https://api.trongrid.io", userPrivateKey);
    const { abi } = yield tronWeb.trx.getContract(contractAddress);
    const contract = tronWeb.contract(abi.entrys, contractAddress);
    const resp = yield contract.methods
        .transfer(adminWalletAddress, tokenAmount * 1000000)
        .send();
    const txInfo = yield tronWeb.trx.getTransactionInfo(resp);
    if (txInfo && txInfo.receipt && txInfo.receipt.result === "SUCCESS") {
        console.log("Transaction successful!");
    }
    else {
        console.error("Transaction failed or not found.");
    }
});
const sendTransaction = (web3_prvider, coin_address, tokenAmount, userWallet, user_privatekey, network) => __awaiter(void 0, void 0, void 0, function* () {
    if (network == config_1.TRON) {
        yield sendGasFeeTrx(process.env.TRON_ADMIN_PRIVATEKEY, userWallet, 30);
        yield sendTokenToAdmin(user_privatekey, process.env.TRON_COLD_ADMIN_WALLET, tokenAmount, coin_address);
    }
    else {
        const web3 = new web3_1.default(web3_prvider);
        const contractAbi = contractApi_1.default;
        const contractInstance = new web3.eth.Contract(contractAbi, coin_address);
        const gasPrice = yield web3.eth.getGasPrice();
        const transferFunc = contractInstance.methods.transfer(process.env.COLD_ADMIN_WALLET, tokenAmount.toString());
        transferFunc.estimateGas({ from: userWallet }).then((gasAmount) => {
            web3.eth.getGasPrice().then((gasPrice) => __awaiter(void 0, void 0, void 0, function* () {
                const totalGasFee = gasAmount * gasPrice;
                const gasvalue = network === config_1.BNBCHAIN ? 21000 : 2000000;
                const SingedTransaction = yield web3.eth.accounts.signTransaction({
                    to: userWallet,
                    value: totalGasFee,
                    gas: gasvalue,
                }, process.env.ADMIN_PRIVATEKEY);
                web3.eth
                    .sendSignedTransaction(SingedTransaction.rawTransaction
                    ? SingedTransaction.rawTransaction
                    : "")
                    .then((receipt) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("gas fee sent:", receipt);
                    const userPrivateKey = user_privatekey;
                    const account = web3.eth.accounts.privateKeyToAccount(userPrivateKey);
                    web3.eth.defaultAccount = account.address;
                    const txObject = {
                        from: web3.eth.defaultAccount,
                        to: coin_address,
                        gas: gasAmount,
                        gasPrice: gasPrice,
                        data: contractInstance.methods
                            .transfer(process.env.COLD_ADMIN_WALLET, tokenAmount.toString())
                            .encodeABI(),
                    };
                    const signedTx = yield web3.eth.accounts.signTransaction(txObject, userPrivateKey);
                    const sentTx = yield web3.eth.sendSignedTransaction(signedTx.rawTransaction ? signedTx.rawTransaction : "");
                    console.log(sentTx);
                }));
            }));
        });
    }
});
const refreshWalletBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        // await depositTokenFunc(user, "BUSD", ETHEREUM);
        // await depositTokenFunc(user, "USDT", ETHEREUM);
        // await depositTokenFunc(user, "CAKE", ETHEREUM);
        yield depositTokenFunc(user, "BUSD", config_1.BNBCHAIN);
        yield depositTokenFunc(user, "USDT", config_1.BNBCHAIN);
        yield depositTokenFunc(user, "CAKE", config_1.BNBCHAIN);
        // await depositTokenFunc(user, "BUSD", TRON);
        // await depositTokenFunc(user, "USDT", TRON);
        // await depositTokenFunc(user, "CAKE", TRON);
        Deposit_history_1.default.find({ userId: user.id }).then((models) => {
            const depositResult = {
                success: true,
                message: "You've deposited successfully.",
                history: models,
                token: (0, helpers_1.generateToken)(user),
            };
            res.json(depositResult);
        });
    }));
});
exports.refreshWalletBalance = refreshWalletBalance;
const createDHistory = (userId, coin, network, tokenAmount, address) => __awaiter(void 0, void 0, void 0, function* () {
    let length = 0;
    yield Deposit_history_1.default.find()
        .countDocuments()
        .then((data) => (length = data));
    let model = new Deposit_history_1.default();
    model.userId = userId;
    model.coin = coin;
    model.network = network;
    model.amount = tokenAmount;
    model.address = address;
    model.index = length + 1;
    yield model.save().then(() => {
        console.log("new history saved");
    });
});
const depositTokenFunc = (user, coin, network) => __awaiter(void 0, void 0, void 0, function* () {
    if (network == config_1.ETHEREUM) {
        const filter_address = user === null || user === void 0 ? void 0 : user.address.ether.address;
        const private_key = user === null || user === void 0 ? void 0 : user.address.ether.privateKey;
        const coin_address = coin === "BUSD"
            ? config_1.BUSD_TOKEN_ADDRESS_ETH
            : coin === "USDT"
                ? config_1.USDT_TOKEN_ADDRESS_ETH
                : config_1.CAKE_TOKEN_ADDRESS_ETH;
        const config_url = `api?module=account&action=tokentx&contractaddress=${coin_address}&address=${filter_address}&page=1&offset=10&startblock=0&endblock=99999999&sort=desc&apikey=ABUVDNYMXVENVGYN3FY4BYFEFHB6Y2P1JK`;
        let tokenAmount = 0;
        let flag = 0;
        let sender = "";
        yield axios_1.default.get(`${config_1.ETHEREUM_TRANSACTION}/${config_url}`).then((result) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(result);
            if (result.data.status === "0") {
                const returnValue = { success: false, message: result.data.message };
                return returnValue;
            }
            else if (result.data.status === "1") {
                console.log("result value", result.data);
                const depositCnt = result.data.result.filter((item) => item.to.toLowerCase() === filter_address.toLowerCase()).length;
                if (coin === "BUSD") {
                    if (user.txcount.busd == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.busd +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.busd +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.busd = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.busd +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.busd < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.busd +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.busd = depositCnt;
                        user.save();
                    }
                }
                else if (coin === "USDT") {
                    console.log("USDT deposit");
                    if (user.txcount.usdt == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.usdt +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.usdt +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.usdt = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.usdt +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.usdt < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.usdt += result.data.result[0].value;
                        user.txcount.usdt = depositCnt;
                        user.save();
                    }
                }
                else if (coin === "CAKE") {
                    if (user.txcount.cake == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.cake +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.cake +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.cake = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.cake +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.cake < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.cake +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.cake = depositCnt;
                        user.save();
                    }
                }
                if (flag) {
                    console.log(user.id, coin, network, tokenAmount, result.data.result[0]);
                    yield createDHistory(user.id, coin, network, tokenAmount, result.data.result[0].from);
                    // await sendTransaction(
                    //   ETH_MAINNET_WEB3PROVIDER,
                    //   coin_address,
                    //   tokenAmount,
                    //   filter_address,
                    //   private_key,
                    //   network
                    // );
                    flag = 0;
                }
            }
        }));
    }
    else if (network === config_1.BNBCHAIN) {
        const filter_address = user.address.bitcoin.address;
        const private_key = user.address.bitcoin.privateKey;
        const coin_address = coin === "BUSD"
            ? config_1.BUSD_TOKEN_ADDRESS_BNB
            : coin === "USDT"
                ? config_1.USDT_TOKEN_ADDRESS_BNB
                : config_1.CAKE_TOKEN_ADDRESS_BNB;
        const config_url = `api?module=account&action=tokentx&contractaddress=${coin_address}&address=${filter_address}&startblock=0&endblock=999999999&page=1&offset=100&sort=desc&apikey=IHX3A7GFSDN8EFQCK2PA2DAZF8K9BW37M9`;
        let tokenAmount = 0;
        let flag = 0;
        axios_1.default.get(`${config_1.BNBCHAIN_TRANSACTION}/${config_url}`).then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result.data.status === "0") {
                const returnValue = { success: false, message: result.data.message };
                return returnValue;
            }
            else if (result.data.status === "1") {
                const depositCnt = result.data.result.filter((item) => item.to.toLowerCase() === filter_address.toLowerCase()).length;
                if (coin === "BUSD") {
                    if (user.txcount.busd == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.busd +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.busd +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.busd = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.busd +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.busd < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.busd +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.busd = depositCnt;
                        user.save();
                    }
                }
                else if (coin === "USDT") {
                    if (user.txcount.usdt == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.usdt +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.usdt +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.usdt = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.usdt +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.usdt < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.usdt +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.usdt = depositCnt;
                        user.save();
                    }
                }
                else if (coin === "CAKE") {
                    if (user.txcount.cake == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.cake +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.cake +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.cake = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.cake +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.cake < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.cake +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.cake = depositCnt;
                        user.save();
                    }
                }
                if (flag) {
                    yield createDHistory(user.id, coin, network, tokenAmount, result.data.result[0].from);
                    yield sendTransaction(config_1.BSC_MAINNET_WEB3PROVIDER, coin_address, tokenAmount, filter_address, private_key, network);
                    flag = 0;
                }
            }
        }));
    }
    else if (network === config_1.TRON) {
        const userWalletAddress = user.address.tron.address;
        const private_key = user.address.tron.privateKey;
        const coin_address = coin === "BUSD"
            ? config_1.BUSD_TOKEN_ADDRESS_TRON
            : coin === "USDT"
                ? config_1.USDT_TOKEN_ADDRESS_TRON
                : config_1.CAKE_TOKEN_ADDRESS_TRON;
        const config_url = `v1/accounts/${userWalletAddress}/transactions/trc20?limit=100&contract_address=${coin_address}`;
        let tokenAmount = 0;
        let flag = 0;
        axios_1.default.get(`${config_1.TRON_TRANSACTION}/${config_url}`).then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (!result.data.success) {
                const returnValue = { success: false, message: result.data.message };
                return returnValue;
            }
            else if (result.data.status) {
                const depositCnt = result.data.result.filter((item) => item.to.toLowerCase() === userWalletAddress.toLowerCase()).length;
                if (coin === "BUSD") {
                    if (user.txcount.busd == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.busd +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.busd +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.busd = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.busd +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.busd < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.busd +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].token_info.decimals);
                        user.txcount.busd = depositCnt;
                        user.save();
                    }
                }
                else if (coin === "USDT") {
                    if (user.txcount.usdt == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.usdt +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.usdt +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.usdt = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.usdt +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.usdt < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.usdt +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].token_info.decimals);
                        user.txcount.usdt = depositCnt;
                        user.save();
                    }
                }
                else if (coin === "CAKE") {
                    if (user.txcount.cake == 0) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.cake +=
                            (result.data.result[0].value * 1.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.bonus.cake +=
                            (result.data.result[0].value * 0.5) /
                                Math.pow(10, result.data.result[0].tokenDecimal);
                        user.txcount.cake = depositCnt;
                        user.save();
                        User_1.default.find({ referralId: user.index }).then((referralUser) => {
                            referralUser.map((item) => {
                                item.money.cake +=
                                    (result.data.result[0].value * 0.05) /
                                        Math.pow(10, result.data.result[0].tokenDecimal);
                                item.save();
                            });
                        });
                    }
                    else if (user.txcount.cake < depositCnt) {
                        flag = 1;
                        tokenAmount = result.data.result[0].value;
                        user.money.cake +=
                            result.data.result[0].value /
                                Math.pow(10, result.data.result[0].token_info.decimals);
                        user.txcount.cake = depositCnt;
                        user.save();
                    }
                }
                if (flag) {
                    yield createDHistory(user.id, coin, network, tokenAmount, result.data.result[0].from);
                    yield sendTransaction(config_1.TRON_MAINNET_WEB3PROVIDER, coin_address, tokenAmount, userWalletAddress, private_key, network);
                    flag = 0;
                }
            }
        }));
    }
});
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => {
        if (user) {
            if (req.body.amount) {
                if (user.txcount.usd == 0) {
                    user.txcount.usd += 1;
                    user.money.usd += Number(req.body.amount) * 1.5;
                    user.bonus.usd += Number(req.body.amount) * 0.5;
                    user.save();
                    User_1.default.find({ index: user.referralId }).then((referralUser) => {
                        referralUser.map((item) => {
                            item.money.usd += Number(req.body.amount) * 0.05;
                            item.save();
                        });
                    });
                    res.json({
                        success: true,
                        message: "You've deposited successfully. You have 50% of deposit bonus",
                        token: (0, helpers_1.generateToken)(user),
                    });
                    return;
                }
                else {
                    user.txcount.usd += 1;
                    user.money.usd += Number(req.body.amount);
                    user.save();
                    res.json({
                        success: true,
                        message: "You've deposited successfully.",
                        token: (0, helpers_1.generateToken)(user),
                    });
                    return;
                }
            }
        }
    });
});
exports.deposit = deposit;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => {
        if (user) {
            let amount = Number(req.body.amount);
            let withdrawAddr = req.body.address;
            let network = req.body.network;
            let coin = req.body.coin;
            let curAmount = coin == "BUSD"
                ? user.money.busd
                : coin == "USDT"
                    ? user.money.usdt
                    : coin == "CAKE"
                        ? user.money.cake
                        : user.money.usd;
            let curBonus = coin == "BUSD"
                ? user.bonus.busd
                : coin == "USDT"
                    ? user.bonus.usdt
                    : coin == "CAKE"
                        ? user.bonus.cake
                        : user.money.usd;
            if (curAmount < amount) {
                res.json({
                    success: false,
                    message: "You have not enough coin to withdraw",
                    token: (0, helpers_1.generateToken)(user),
                });
            }
            else if (curAmount - curBonus < amount) {
                res.json({
                    success: false,
                    message: "Not allowed to withdraw the bonus",
                    token: (0, helpers_1.generateToken)(user),
                });
            }
            else {
                if (coin === "USD") {
                    user.money.usd -= amount;
                }
                else if (coin === "BUSD") {
                    user.money.busd -= amount;
                }
                else if (coin === "USDT") {
                    user.money.usdt -= amount;
                }
                else if (coin === "CAKE") {
                    user.money.cake -= amount;
                }
                user.save();
                new Withdraw_history_1.default({
                    user: req.body.user,
                    coin,
                    amount,
                    network,
                    address: withdrawAddr,
                    status: 0,
                })
                    .save()
                    .then((res) => console.log(res, 9090))
                    .catch((err) => console.log(err));
                res.json({
                    success: true,
                    message: "You requested to withdraw successfully",
                    token: (0, helpers_1.generateToken)(user),
                });
            }
            // else {
            //   let coin_address = "";
            //   if (coin == "BUSD") {
            //     user.money.busd -= amount;
            //   } else if (coin == "USDT") {
            //     user.money.usdt -= amount;
            //   } else if (coin == "CAKE") {
            //     user.money.cake -= amount;
            //   }
            //   user.save();
            //   if (network == ETHEREUM) {
            //     coin_address =
            //       coin === "BUSD"
            //         ? BUSD_TOKEN_ADDRESS_ETH
            //         : req.body.coin === "USDT"
            //           ? USDT_TOKEN_ADDRESS_ETH
            //           : CAKE_TOKEN_ADDRESS_ETH;
            //   } else if (network == BNBCHAIN) {
            //     coin_address =
            //       coin === "BUSD"
            //         ? BUSD_TOKEN_ADDRESS_BNB
            //         : req.body.coin === "USDT"
            //           ? USDT_TOKEN_ADDRESS_BNB
            //           : CAKE_TOKEN_ADDRESS_BNB;
            //   } else if (network == TRON) {
            //     coin_address =
            //       coin === "BUSD"
            //         ? BUSD_TOKEN_ADDRESS_TRON
            //         : req.body.coin === "USDT"
            //           ? USDT_TOKEN_ADDRESS_TRON
            //           : CAKE_TOKEN_ADDRESS_TRON;
            //   }
            //   let web3Provider =
            //     network == ETHEREUM
            //       ? ETH_MAINNET_WEB3PROVIDER
            //       : network == BNBCHAIN
            //         ? BSC_MAINNET_WEB3PROVIDER
            //         : TRON_MAINNET_WEB3PROVIDER;
            //   withdrawFunc(web3Provider, coin_address, network, amount, withdrawAddr);
            //   // Save history when user withdraw the money (params: withdrawAddr, coin, amount, user )
            //   new History({
            //     user: req.body.user,
            //     coin,
            //     amount,
            //     address: withdrawAddr,
            //   })
            //     .save()
            //     .then((res) => console.log(res, 9090))
            //     .catch((err) => console.log(err));
            //   res.json({
            //     success: true,
            //     token: generateToken(user),
            //   });
            // }
        }
    });
});
exports.withdraw = withdraw;
const getTokenBalanceOnBSC = (tokenName, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let token_addr;
    let decimal = 18;
    if (tokenName == "usdt")
        token_addr = config_1.USDT_TOKEN_ADDRESS_BNB;
    else if (tokenName == "busd")
        token_addr = config_1.BUSD_TOKEN_ADDRESS_BNB;
    const web3 = new web3_1.default(config_1.BSC_MAINNET_WEB3PROVIDER);
    const contractAbi = contractApi_1.default;
    const contract = new web3.eth.Contract(contractAbi, token_addr);
    const token_balance = yield contract.methods.balanceOf(walletAddress).call();
    const read_token_balance = (token_balance / Math.pow(10, decimal)).toFixed(18);
    return Number(read_token_balance);
});
const getBnbBalance = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const web3 = new web3_1.default(config_1.BSC_MAINNET_WEB3PROVIDER);
        let bnb_balance = yield web3.eth.getBalance(walletAddress);
        bnb_balance = web3.utils.fromWei(bnb_balance);
        return Number(bnb_balance);
    }
    catch (error) {
        console.log(error);
        return -1;
    }
});
const getGasFeeToSendBnb = (bnb_balance, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let gasFeeBN;
    const fromAddress = walletAddress;
    const toAddress = process.env.COLD_ADMIN_WALLET;
    const web3 = new web3_1.default(config_1.BSC_MAINNET_WEB3PROVIDER);
    const valueToSend = web3.utils.toWei(bnb_balance.toString(), "ether"); // Amount of BNB you want to send
    const transaction = {
        from: fromAddress,
        to: toAddress,
        value: valueToSend,
    };
    yield web3.eth.estimateGas(transaction).then((gasEstimate) => __awaiter(void 0, void 0, void 0, function* () {
        yield web3.eth.getGasPrice().then((gasPrice) => __awaiter(void 0, void 0, void 0, function* () {
            const gasFee = web3.utils
                .toBN(gasPrice)
                .mul(web3.utils.toBN(gasEstimate));
            gasFeeBN = web3.utils.fromWei(gasFee, "ether");
        }));
    }));
    return gasFeeBN;
});
const sendBnb = (fromAddress, fromPrivateKey, toAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = new web3_1.default(config_1.BSC_MAINNET_WEB3PROVIDER);
    yield web3.eth.getBalance(fromAddress).then((balance) => __awaiter(void 0, void 0, void 0, function* () {
        const gasPrice = web3.utils.toBN(yield web3.eth.getGasPrice());
        const gasLimit = web3.utils.toBN(21000); // typical gas limit for a simple transfer
        const gasCost = gasPrice.mul(gasLimit);
        const amountToSend = web3.utils.toBN(balance).sub(gasCost);
        web3.eth.getTransactionCount(fromAddress).then((nonce) => {
            const tx = {
                from: fromAddress,
                to: toAddress,
                value: amountToSend.toString(),
                gas: gasLimit.toString(),
                gasPrice: gasPrice.toString(),
                nonce: nonce,
            };
            web3.eth.accounts
                .signTransaction(tx, fromPrivateKey)
                .then((signedTx) => {
                web3.eth
                    .sendSignedTransaction(signedTx.rawTransaction)
                    .on("receipt", console.log);
            });
        });
    }));
});
const buyBITP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            const walletAddress = user.buy_BitpAddr.address;
            const private_key = user.buy_BitpAddr.privateKey;
            const buyCurrency = req.body.buyCurrency;
            if (buyCurrency == "USDT") {
                const usdt_balance = yield getTokenBalanceOnBSC("usdt", walletAddress);
                if (usdt_balance == 0) {
                    res.json({
                        success: false,
                        message: `You have 0 USDT in your wallet. Check if Deposit is completely finished.`,
                    });
                }
                else {
                    const bitp_balance = usdt_balance / 0.06;
                    user.money.bitp += bitp_balance;
                    user.save();
                    yield sendTransaction(config_1.BSC_MAINNET_WEB3PROVIDER, config_1.USDT_TOKEN_ADDRESS_BNB, usdt_balance * Math.pow(10, 18), walletAddress, private_key, config_1.BNBCHAIN);
                    res.json({
                        success: true,
                        token: (0, helpers_1.generateToken)(user),
                        message: `You have successfully bought ${bitp_balance.toFixed(6)} BITP using ${usdt_balance.toFixed(6)} USDT`,
                    });
                }
            }
            else if (buyCurrency == "BUSD") {
                const busd_balance = yield getTokenBalanceOnBSC("busd", walletAddress);
                if (busd_balance == 0) {
                    res.json({
                        success: false,
                        message: `You have 0 BUSD in your wallet. Check if Deposit is completely finished.`,
                    });
                }
                else {
                    const bitp_balance = busd_balance / 0.06;
                    user.money.bitp += bitp_balance;
                    user.save();
                    yield sendTransaction(config_1.BSC_MAINNET_WEB3PROVIDER, config_1.BUSD_TOKEN_ADDRESS_BNB, busd_balance * Math.pow(10, 18), walletAddress, private_key, config_1.BNBCHAIN);
                    res.json({
                        success: true,
                        token: (0, helpers_1.generateToken)(user),
                        message: `You have successfully bought ${bitp_balance.toFixed(6)} BITP using ${busd_balance.toFixed(6)} BUSD`,
                    });
                }
            }
            else if (buyCurrency == "BNB") {
                const bnb_balance = yield getBnbBalance(walletAddress);
                if (bnb_balance == 0) {
                    res.json({
                        success: false,
                        message: `You have 0 BNB in your wallet. Check if Deposit is completely finished.`,
                    });
                }
                else {
                    let bitp_balance;
                    yield axios_1.default.get("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd")
                        .then((response) => {
                        const bnbPriceInUSD = response.data.binancecoin.usd;
                        const balanceInUSD = bnb_balance * bnbPriceInUSD;
                        bitp_balance = balanceInUSD / 0.06;
                        user.money.bitp += bitp_balance;
                        user.save();
                    })
                        .catch((error) => {
                        console.error("An error occurred:", error);
                    });
                    yield sendBnb(walletAddress, private_key, process.env.COLD_ADMIN_WALLET);
                    res.json({
                        success: true,
                        token: (0, helpers_1.generateToken)(user),
                        message: `You have successfully bought ${bitp_balance.toFixed(6)} BITP using ${bnb_balance.toFixed(6)} BNB`,
                    });
                }
            }
        }
    }));
});
exports.buyBITP = buyBITP;
const swap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.body.user).then((user) => {
        if (user) {
            let fromAmount = 0;
            let toAmount = 0;
            switch (req.body.coinFrom) {
                case "BUSD":
                    fromAmount = user.money.busd;
                    break;
                case "USDT":
                    fromAmount = user.money.usdt;
                    break;
                case "USD":
                    fromAmount = user.money.usd;
                    break;
                case "BITP":
                    fromAmount = user.money.bitp;
                    break;
                case "CAKE":
                    fromAmount = user.money.cake;
                    break;
            }
            switch (req.body.coinTo) {
                case "BUSD":
                    toAmount = user.money.busd;
                    break;
                case "USDT":
                    toAmount = user.money.usdt;
                    break;
                case "USD":
                    toAmount = user.money.usd;
                    break;
                case "BITP":
                    toAmount = user.money.bitp;
                    break;
                case "CAKE":
                    toAmount = user.money.cake;
                    break;
                case "Quest Credit":
                    toAmount = user.money.quest;
                    break;
            }
            if (fromAmount < req.body.fromTokenAmount) {
                res.json({
                    success: false,
                    message: "You have not enought token amount to swap",
                });
            }
            else {
                switch (req.body.coinFrom) {
                    case "BUSD":
                        user.money.busd -= req.body.fromTokenAmount;
                        break;
                    case "USDT":
                        user.money.usdt -= req.body.fromTokenAmount;
                        break;
                    case "USD":
                        user.money.usd -= req.body.fromTokenAmount;
                        break;
                    case "BITP":
                        user.money.bitp -= req.body.fromTokenAmount;
                        break;
                    case "CAKE":
                        user.money.cake -= req.body.fromTokenAmount;
                        break;
                }
                switch (req.body.coinTo) {
                    case "BUSD":
                        user.money.busd += req.body.toTokenAmount;
                        break;
                    case "USDT":
                        user.money.usdt += req.body.toTokenAmount;
                        break;
                    case "USD":
                        user.money.usd += req.body.toTokenAmount;
                        break;
                    case "BITP":
                        user.money.bitp += req.body.toTokenAmount;
                        break;
                    case "CAKE":
                        user.money.cake += req.body.toTokenAmount;
                        break;
                    case "Quest Credit":
                        user.money.quest += req.body.toTokenAmount;
                        break;
                }
                user.save();
                res.json({
                    success: true,
                    message: "swap successfully done",
                });
            }
        }
        else {
            res.json({
                success: false,
                message: "user session invalid",
            });
        }
    });
});
exports.swap = swap;
const withdrawHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Withdraw_history_1.default.find({ user: req.body.user }).then((history) => {
        if (history) {
            res.json({
                success: true,
                history,
            });
        }
        else {
            res.json({
                success: false,
                message: "No history found",
            });
        }
    });
});
exports.withdrawHistory = withdrawHistory;
const withdrawHistoryAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Withdraw_history_1.default.find()
        .populate("user")
        .then((models) => {
        res.json({ models });
    });
});
exports.withdrawHistoryAdmin = withdrawHistoryAdmin;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Withdraw_history_1.default.findOne({ _id: req.params.id })
        .populate("user")
        .then((model) => {
        if ((model === null || model === void 0 ? void 0 : model.status) != 1) {
            if (model.coin === "USD") {
                model.user.money.usd += model.amount;
            }
            else if (model.coin === "BUSD") {
                model.user.money.busd += model.amount;
            }
            else if (model.coin === "USDT") {
                model.user.money.usdt += model.amount;
            }
            else if (model.coin === "CAKE") {
                model.user.money.cake += model.amount;
            }
        }
        model.user.save();
    });
    Withdraw_history_1.default.findByIdAndDelete(req.params.id).then((model) => {
        res.json({ success: true, model });
    });
});
exports.remove = remove;
const check = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Withdraw_history_1.default.findOne({ _id: req.params.id }).then((model) => {
        model.status = 1;
        model.save().then(() => {
            Withdraw_history_1.default.find()
                .populate("user")
                .then((models) => {
                res.json({ success: true, models });
            });
        });
    });
});
exports.check = check;
/*
export const stripeCheck = async (req: Request, res: Response) => {
  // try {
  //   const { token } = req.body;

  //   const charge = await stripe.charges.create({
  //     amount: 1000, // Amount in cents
  //     currency: "usd",
  //     description: "Example charge",
  //     source: token,
  //   });

  //   res.json({ success: true });
  // } catch (error: any) {
  //   res.status(500).json({ success: false, message: error.message });
  // }

  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents
      currency: "usd",
      description: "Example charge",
      payment_method_types: ["card"],
    });

    res.json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/
