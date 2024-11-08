"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEtherPrivateKeyAndWalletAddress = void 0;
const ethers_1 = require("ethers");
const interfaces_1 = require("../interfaces");
const config_1 = require("../../config");
const generateEtherPrivateKey = (derivationPath, nonce) => {
    var _a;
    const path = derivationPath || config_1.ETHEREUM_DEFAULT;
    const index = nonce || Math.floor(Math.random() * 10);
    const wallet = ethers_1.ethers.Wallet.createRandom({ path: path + index });
    return (0, interfaces_1.walletResponse)({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: (_a = wallet.mnemonic) === null || _a === void 0 ? void 0 : _a.phrase,
        nonce: index
    });
};
const importWalletFromEtherPrivateKey = (mnemonic, nonce, derivationPath) => {
    const path = derivationPath || config_1.ETHEREUM_DEFAULT;
    const index = nonce || 0;
    const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic, path + index);
    return (0, interfaces_1.walletResponse)({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
        nonce: index
    });
};
const getEtherPrivateKeyAndWalletAddress = () => {
    var _a;
    const wallet_info = generateEtherPrivateKey();
    const mnemonic = (_a = wallet_info.mnemonic) !== null && _a !== void 0 ? _a : '';
    return importWalletFromEtherPrivateKey(mnemonic, wallet_info.nonce);
};
exports.getEtherPrivateKeyAndWalletAddress = getEtherPrivateKeyAndWalletAddress;
