"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOCK_FROST = exports.ADA_HANDLE = exports.GET_GAS = exports.GET_TRANSACTION = exports.TRANSFER_TOKEN = exports.APPROVE_TOKEN = exports.SEND_COIN = exports.GET_TOKEN_LIST = exports.GET_TOKEN = exports.GET_TOKEN_BALANCE = exports.GET_BALANCES = exports.GET_BALANCE = exports.IMPORT_ACCOUNT = exports.CREATE_ACCOUNT = exports.CREATE_MASTERSEED = exports.IMPORT_WALLET = exports.CREATE_WALLET = exports.GET_HEDERA_ACCOUNTID_ENDPOINT = exports.SOLANA_TOKENLIST_URI = exports.BWS_INSTANCE_URL = exports.ETHER_GASSTATION_API = exports.ETHER_GASSTATION_APIKEY = exports.LITECOIN_NETWORK_PROTOTYPE = exports.BTC_TESTNET = exports.BTC_REGTEST = exports.BTC_MAINNET = exports.DEVNET = exports.TESTNET = exports.MAINNET_BETA = exports.ERC721_INTERFACE_ID = exports.LITECOIN_DEFAULT = exports.TRON_DEFAULT = exports.BNB_BEACON_DEFAULT = exports.BITCOIN_DEFAULT = exports.SOLANA_DEFAULT = exports.ETHEREUM_DEFAULT = exports.TRON = exports.BNBCHAIN = exports.RIPPLE = exports.BITCOIN = exports.SOLANA = exports.ETHEREUM = exports.Mailgun_API_KEY = exports.SENDGRID_API_KEY = exports.USER_PASSWORD = exports.USER_EMAIL = exports.SERVER_PORT = exports.CLIENT_URI = exports.SERVER_URI = exports.SECRET_KEY = void 0;
exports.STELLAR_TESTNET_SERVER = exports.STELLAR_TESTNET_API = exports.STELLAR_MAINNET_SERVER = exports.TRON_DAPPCHAIN_EVENT_SERVER = exports.TRON_DAPPCHAIN_SOLIDITY_NODE = exports.TRON_DAPPCHAIN_FULL_NDOE = exports.TRON_TESTNET_EVENT_SERVER = exports.TRON_TESTNET_SOLIDITY_NODE = exports.TRON_TESTNET_FULL_NODE = exports.TRON_MAINNET_EVENT_SERVER = exports.TRON_MAINNET_SOLIDITY_NODE = exports.TRON_MAINNET_FULL_NODE = exports.TRON_DAPPCHAIN = exports.TRON_NILE_TESTNET = exports.TRON_SHASTA_TESTNET = exports.TRON_MAINNET = exports.RIPPLE_DEVNET_RPC_URL_2 = exports.RIPPLE_DEVNET_RPC_URL_1 = exports.RIPPLE_TESTNET_RPC_URL_2 = exports.RIPPLE_TESTNET_RPC_URL_1 = exports.RIPPLE_NETWORK_RPC_URL_2 = exports.RIPPLE_NETWORK_RPC_URL_1 = exports.SOLANA_MAINNET_RPC_URL = exports.SOLANA_TESTNET_RPC_URL = exports.SOLANA_DEVNET_RPC_URL = exports.AVALANCH_NETWORK_RPC_URL = exports.CRONOS_MAINNET_RPC_URL = exports.ARBITRUM_ONE_MAINNET_RPC_URL = exports.FANTOM_OPERA_MAINNET_RPC_URL = exports.POLYGON_MAINNET_RPC_URL = exports.BINANCE_SMART_CHAIN_RPC_URL = exports.ETHEREUM_MAINNET_RPC_URL_2 = exports.ETHERRUM_MAINNET_RPC_URL_1 = exports.INFURA_URL = exports.TRON_TRANSACTION = exports.BNBCHAIN_TRANSACTION = exports.ETHEREUM_TRANSACTION = exports.CAKE_TOKEN_ADDRESS_TRON = exports.CAKE_TOKEN_ADDRESS_ETH = exports.CAKE_TOKEN_ADDRESS_BNB = exports.USDT_TOKEN_ADDRESS_TRON = exports.USDT_TOKEN_ADDRESS_ETH = exports.USDT_TOKEN_ADDRESS_BNB = exports.BUSD_TOKEN_ADDRESS_TRON = exports.BUSD_TOKEN_ADDRESS_ETH = exports.BUSD_TOKEN_ADDRESS_BNB = exports.TRON_MAINNET_WEB3PROVIDER = exports.ETH_MAINNET_WEB3PROVIDER = exports.BSC_MAINNET_WEB3PROVIDER = exports.TRONGRID_API_KEY = void 0;
exports.WALLET_SERVER_URI = exports.APP_SERVER_URI = exports.ERRORS = exports.CARDANO_PREPROD_SERVER = exports.CARDANO_PREVIEW_SERVER = exports.CARDANO_TESTNET_SERVER = exports.CARDANO_MAINNET_SERVER = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**************************************  Server Consts variables  ***********************************/
exports.SECRET_KEY = process.env.SECRET_KEY || "bitsport-bitpool-node-project";
// export const SERVER_URI = "http://localhost";
exports.SERVER_URI = "https://api.bitpool.gg";
// export const CLIENT_URI = "http://localhost:3000";
exports.CLIENT_URI = "https://dev.bitpool.gg";
exports.SERVER_PORT = process.env.SERVER_PORT || 8000;
// Email Verification
exports.USER_EMAIL = process.env.USER_EMAIL || "AKIAVODMUBIM2GSPWU7I";
exports.USER_PASSWORD = process.env.USER_PASSWORD || "BLDR30JJ0GJ1dWtpamMFHPTxtMC2SQYufw6TwyzoFRGt";
exports.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
exports.Mailgun_API_KEY = process.env.SENDGRID_API_KEY || "95675b90fa10658571bdcdd6ae3b3459-73f745ed-16211593";
/***************************************   Wallet Consts variables  *********************************/
// Network Names
exports.ETHEREUM = "ETHEREUM";
exports.SOLANA = "SOLANA";
exports.BITCOIN = "BITCOIN";
exports.RIPPLE = "RIPPLE";
exports.BNBCHAIN = "BNB CHAIN";
exports.TRON = "TRON";
// Derived Path
exports.ETHEREUM_DEFAULT = "m/44'/60'/0'/0/";
exports.SOLANA_DEFAULT = "m/44'/501'/0'/0'";
exports.BITCOIN_DEFAULT = "m/44'/0'/0'/0";
exports.BNB_BEACON_DEFAULT = "m/44'/714'/0'/0";
exports.TRON_DEFAULT = "m/44'/195'/0/0";
exports.LITECOIN_DEFAULT = "m/44'/2'/0'/0";
// Ethereum Contract Data
exports.ERC721_INTERFACE_ID = "0x80ac58cd";
// Solana network cluster
exports.MAINNET_BETA = "mainnet-beta";
exports.TESTNET = "testnet";
exports.DEVNET = "devnet";
// Bitcoin network
exports.BTC_MAINNET = "bitcoin";
exports.BTC_REGTEST = "regtest";
exports.BTC_TESTNET = "testnet";
// Network Prototype
exports.LITECOIN_NETWORK_PROTOTYPE = {
    messagePrefix: "\x19Litecoin Signed Message:\n",
    bech32: "ltc",
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
};
// Ether Gasstation
exports.ETHER_GASSTATION_APIKEY = "9218ce9ba793ff0339045d78a4161ad4b9c5d1ebad3158197514ac957d40";
exports.ETHER_GASSTATION_API = `https://ethgasstation.info/api/ethgasAPI.json?api-key=${exports.ETHER_GASSTATION_APIKEY}`;
// Bitpay url
exports.BWS_INSTANCE_URL = "https://bws.bitpay.com/bws/api";
// Solana data API endpoint
exports.SOLANA_TOKENLIST_URI = "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json";
// hedera account id recover api endpoint
exports.GET_HEDERA_ACCOUNTID_ENDPOINT = "https://mainnet-public.mirrornode.hedera.com/api/v1/accounts?accountpublickey=";
// Actions
exports.CREATE_WALLET = "CREATE_WALLET";
exports.IMPORT_WALLET = "IMPORT_WALLET";
exports.CREATE_MASTERSEED = "CREATE_MASTERSEED";
exports.CREATE_ACCOUNT = "CREATE_ACCOUNT";
exports.IMPORT_ACCOUNT = "IMPORT_ACCOUNT";
exports.GET_BALANCE = "GET_BALANCE";
exports.GET_BALANCES = "GET_BALANCES";
exports.GET_TOKEN_BALANCE = "GET_TOKEN_BALANCE";
exports.GET_TOKEN = "GET_TOKEN";
exports.GET_TOKEN_LIST = "GET_TOKEN_LIST";
exports.SEND_COIN = "SEND_COIN";
exports.APPROVE_TOKEN = "APPROVE_TOKEN";
exports.TRANSFER_TOKEN = "TRANSFER_TOKEN";
exports.GET_TRANSACTION = "GET_TRANSACTION";
exports.GET_GAS = "GET_GAS";
// Cardano Ada Handle
exports.ADA_HANDLE = {
    mainnet: "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a",
    testnet: "8d18d786e92776c824607fd8e193ec535c79dc61ea2405ddf3b09fe3",
};
// Blockfrost API project ID
exports.BLOCK_FROST = {
    mainnet: "mainnetQf8DQD9zDkg91gBo2R8xmEG2IxCaS9fU",
    testnet: "",
    preprod: "",
    preview: "previewcGGHuIlBcwBsYE7PzkEC26AMCb0LztD0",
};
// Tron API key
exports.TRONGRID_API_KEY = {
    mainnet: "f0b1e38e-7bee-485e-9d3f-69410bf30681",
    testnet: "6739be94-ee43-46af-9a62-690cf0947269",
    dappchain: "a981e232-a995-4c81-9653-c85e4d05f599",
};
// Coin Addresses
exports.BSC_MAINNET_WEB3PROVIDER = "https://bsc-dataseed1.binance.org";
exports.ETH_MAINNET_WEB3PROVIDER = "https://mainnet.infura.io/v3/4b4f9d91a45846939231b666740bc499";
exports.TRON_MAINNET_WEB3PROVIDER = "https://api.trongrid.io";
exports.BUSD_TOKEN_ADDRESS_BNB = process.env.BUSD_TOKEN_ADDRESS_BNB ||
    "0xe9e7cea3dedca5984780bafc599bd69add087d56";
exports.BUSD_TOKEN_ADDRESS_ETH = process.env.BUSD_TOKEN_ADDRESS_ETH ||
    "0x4fabb145d64652a948d72533023f6e7a623c7c53";
exports.BUSD_TOKEN_ADDRESS_TRON = process.env.BUSD_TOKEN_ADDRESS_TRON || "TMz2SWatiAtZVVcH2ebpsbVtYwUPT9EdjH ";
exports.USDT_TOKEN_ADDRESS_BNB = process.env.USDT_TOKEN_ADDRESS_BNB ||
    "0x55d398326f99059ff775485246999027b3197955";
exports.USDT_TOKEN_ADDRESS_ETH = process.env.USDT_TOKEN_ADDRESS_ETH ||
    "0xdac17f958d2ee523a2206206994597c13d831ec7";
exports.USDT_TOKEN_ADDRESS_TRON = process.env.USDT_TOKEN_ADDRESS_TRON || "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
exports.CAKE_TOKEN_ADDRESS_BNB = process.env.CAKE_TOKEN_ADDRESS_BNB ||
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
exports.CAKE_TOKEN_ADDRESS_ETH = process.env.CAKE_TOKEN_ADDRESS_ETH ||
    "0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898";
exports.CAKE_TOKEN_ADDRESS_TRON = process.env.CAKE_TOKEN_ADDRESS_TRON || "TPS2YfDckq9jwTw3kojvSpYXRgAiBKXiGm";
// Network api
exports.ETHEREUM_TRANSACTION = process.env.ETHEREUM_TRANSACTION || "https://api.etherscan.io/";
exports.BNBCHAIN_TRANSACTION = process.env.BNBCHAIN_TRANSACTION || "https://api.bscscan.com/";
exports.TRON_TRANSACTION = process.env.TRON_TRANSACTION || "https://api.trongrid.io/";
exports.INFURA_URL = process.env.INFURA_URL ||
    "https://mainnet.infura.io/v3/4b4f9d91a45846939231b666740bc499";
// RPC_ENDPOINTS
/////////////////////////
//////FOR EVM CHAIN//////
/////////////////////////
// Ethereum
exports.ETHERRUM_MAINNET_RPC_URL_1 = "https://mainnet.infura.io/v3/";
exports.ETHEREUM_MAINNET_RPC_URL_2 = "https://rpc.ankr.com/eth/";
// Binance Smart Chain
exports.BINANCE_SMART_CHAIN_RPC_URL = "https://bsc-dataseed2.binance.org";
// Polygon network
exports.POLYGON_MAINNET_RPC_URL = "https://polygon-rpc.com";
// Fantom network
exports.FANTOM_OPERA_MAINNET_RPC_URL = "https://rpc.ftm.tools";
// Abitrum network
exports.ARBITRUM_ONE_MAINNET_RPC_URL = "https://arb-mainnet.g.alchemy.com/v2/TDx7fOwCQUo2nF4-kzxvyIAIGMrpBmnc";
// Cronos network
exports.CRONOS_MAINNET_RPC_URL = "https://cronosrpc-1.xstaking.sg";
// Avalanch network
exports.AVALANCH_NETWORK_RPC_URL = "https://1rpc.io/avax/c";
/////////////////////////
///////S O L A N A///////
/////////////////////////
exports.SOLANA_DEVNET_RPC_URL = "https://api.devnet.solana.com/";
exports.SOLANA_TESTNET_RPC_URL = "https://api.testnet.solana.com/";
exports.SOLANA_MAINNET_RPC_URL = "https://api.mainnet-beta.solana.com";
//////////////////////////
////////R I P P L E///////
//////////////////////////
exports.RIPPLE_NETWORK_RPC_URL_1 = "https://s1.ripple.com:51234/";
exports.RIPPLE_NETWORK_RPC_URL_2 = "wss://s1.ripple.com/";
exports.RIPPLE_TESTNET_RPC_URL_1 = "https://s.altnet.rippletest.net:51234/";
exports.RIPPLE_TESTNET_RPC_URL_2 = "wss://s.altnet.rippletest.net/";
exports.RIPPLE_DEVNET_RPC_URL_1 = "https://s.devnet.rippletest.net:51234/";
exports.RIPPLE_DEVNET_RPC_URL_2 = "wss://s.devnet.rippletest.net/";
///////////////////////////
//////////T R O N//////////
///////////////////////////
exports.TRON_MAINNET = "https://api.trongrid.io";
exports.TRON_SHASTA_TESTNET = "https://api.shasta.trongrid.io";
exports.TRON_NILE_TESTNET = "https://nile.trongrid.io";
exports.TRON_DAPPCHAIN = "https://sun.tronex.io";
exports.TRON_MAINNET_FULL_NODE = "https://api.trongrid.io";
exports.TRON_MAINNET_SOLIDITY_NODE = "https://api.trongrid.io";
exports.TRON_MAINNET_EVENT_SERVER = "https://api.trongrid.io";
exports.TRON_TESTNET_FULL_NODE = "https://api.shasta.trongrid.io";
exports.TRON_TESTNET_SOLIDITY_NODE = "https://api.shasta.trongrid.io";
exports.TRON_TESTNET_EVENT_SERVER = "https://api.shasta.trongrid.io";
exports.TRON_DAPPCHAIN_FULL_NDOE = "https://sun.tronex.io";
exports.TRON_DAPPCHAIN_SOLIDITY_NODE = "https://sun.tronex.io";
exports.TRON_DAPPCHAIN_EVENT_SERVER = "https://sun.tronex.io";
///////////////////////////
///////S T E L L A R///////
///////////////////////////
exports.STELLAR_MAINNET_SERVER = "https://horizon.stellar.org/";
exports.STELLAR_TESTNET_API = "https://friendbot.stellar.org?addr=";
exports.STELLAR_TESTNET_SERVER = "https://horizon-testnet.stellar.org/";
////////////////////////////
////////C A R D A N O///////
////////////////////////////
exports.CARDANO_MAINNET_SERVER = "https://cardano-mainnet.blockfrost.io/api/v0";
exports.CARDANO_TESTNET_SERVER = "https://cardano-testnet.blockfrost.io/api/v0";
exports.CARDANO_PREVIEW_SERVER = "https://cardano-preview.blockfrost.io/api/v0";
exports.CARDANO_PREPROD_SERVER = "https://cardano-preprod.blockfrost.io/api/v0";
// Errors
exports.ERRORS = {
    invalid_api_request: {
        message: "INVALID_API_REQUEST",
        description: "Invalid API request",
    },
    address_not_activated: {
        message: "ADDRESS_NOT_ACTIVATED",
        description: "This address must be activated to use",
    },
};
/************************************************************     GAME    ****************************************/
exports.APP_SERVER_URI = "https://app.bitsport.gg/api";
exports.WALLET_SERVER_URI = "https://wallet.bitpool.gg/api";
