"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBTCPrivateKeyAndWalletAddress = void 0;
const bip32 = __importStar(require("bip32"));
const bip39 = __importStar(require("bip39"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const interfaces_1 = require("../interfaces");
const config_1 = require("../../config");
const generateBTCPrivateKey = (_network, derivedPath) => {
    let network;
    switch (_network) {
        case config_1.BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case config_1.BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case config_1.BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }
    const path = derivedPath || config_1.BITCOIN_DEFAULT;
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, network);
    const account = root.derivePath(path);
    const node = account.derive(0);
    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    }).address;
    return (0, interfaces_1.walletResponse)({
        address: address,
        privateKey: node.toWIF(),
        mnemonic: mnemonic,
    });
};
const importWalletFromBTCPrivateKey = (_network, mnemonic, derivedPath) => {
    let network;
    switch (_network) {
        case config_1.BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case config_1.BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case config_1.BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }
    const path = derivedPath || config_1.BITCOIN_DEFAULT;
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, network);
    const account = root.derivePath(path);
    const node = account.derive(0);
    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    }).address;
    return (0, interfaces_1.walletResponse)({
        address: address,
        privateKey: node.toWIF(),
        mnemonic: mnemonic,
    });
};
const getBTCPrivateKeyAndWalletAddress = () => {
    var _a;
    const wallet_info = generateBTCPrivateKey("");
    const mnemonic = (_a = wallet_info.mnemonic) !== null && _a !== void 0 ? _a : "";
    return importWalletFromBTCPrivateKey("", mnemonic);
};
exports.getBTCPrivateKeyAndWalletAddress = getBTCPrivateKeyAndWalletAddress;
