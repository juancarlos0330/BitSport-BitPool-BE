"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth = __importStar(require("../controllers/auth.controller"));
const profile = __importStar(require("../controllers/profiles.controller"));
const avatar = __importStar(require("../controllers/avatar.controller"));
const challenge = __importStar(require("../controllers/challenges.controller"));
const wallet = __importStar(require("../controllers/wallet.controller"));
const game = __importStar(require("../controllers/game.controller"));
const poolgame = __importStar(require("../controllers/poolgame.controller"));
// import Authenticate from "../service/auth";
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
/**
 * Router
 * Using Passport
 */
const router = express_1.Router();
const uploadDir = path_1.default.join(__dirname, '../../uploads');
// Create a storage engine for Multer
const storage = multer_1.default.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const uniqueSuffix = uuid_1.v4();
        const fileExtension = path_1.default.extname(file.originalname);
        const fileName = `${uniqueSuffix}${fileExtension}`;
        cb(null, fileName);
    },
});
// Configure Multer with the storage engine
const upload = multer_1.default({ storage });
// Authentication
router.post("/signin", auth.SignIn);
router.post("/signup", auth.SignUp);
// User panel
router.post("/profile/names", profile.names);
router.post("/profile/pwd", profile.password);
router.post("/profile/avatar", upload.single('avatar'), avatar.avatar);
// Pool game
router.get("/pool-game/index", poolgame.index);
router.post("/pool-game/save", poolgame.save);
router.post("/pool-game/opensave", poolgame.opensave);
router.post("/pool-game/start", poolgame.start);
router.post("/pool-game/end", poolgame.end);
// Administrator challenges
router.get("/challenge/index", challenge.index);
router.post("/challenge/save", challenge.save);
router.delete("/challenge/remove/:id", challenge.remove);
// Wallet
router.post("/deposit", wallet.deposit);
router.post("/withdraw", wallet.withdraw);
router.post("/getUserInfo", wallet.getUserInfo);
router.post("/swap", wallet.swap);
router.post("/withdrawHistory", wallet.withdrawHistory);
router.get("/admin/withdrawHistory", wallet.withdrawHistoryAdmin);
router.delete('/withdraw/remove/:id', wallet.remove);
router.get('/withdraw/check/:id', wallet.check);
// Game
router.post("/game/start", game.start);
router.post("/get-challenge-by-id", game.get_challenge_by_id);
router.post("/start-match", game.start_match);
router.post("/submit-match-result", game.submit_result);
exports.default = router;
