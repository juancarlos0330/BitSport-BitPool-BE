"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
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
const task = __importStar(require("../controllers/task.controller"));
const tasksuccess = __importStar(
  require("../controllers/tasksuccess.controller")
);
const bugreport = __importStar(require("../controllers/bug.controller"));
const airdrop = __importStar(require("../controllers/airdrop.controller"));
// import Authenticate from "../service/auth";
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
/**
 * Router
 * Using Passport
 */
const router = (0, express_1.Router)();
const uploadDir = path_1.default.join(__dirname, "../uploads");
// Create a storage engine for Multer
const storage = multer_1.default.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = (0, uuid_1.v4)();
    const fileExtension = path_1.default.extname(file.originalname);
    const fileName = `${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  },
});
// Configure Multer with the storage engine
const upload = (0, multer_1.default)({ storage });
// AirDrop
router.post("/airdrop/followTwitter", airdrop.followerTwitter);
router.post("/airdrop/joinTelegram", airdrop.joinTelegram);
router.post("/airdrop/joinDiscord", airdrop.joinDiscord);
// Authentication
router.post("/signin", auth.SignIn);
router.post("/signup", auth.SignUp);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.post("/getReferalInfo", auth.getReferalInfo);
router.post("/getEarnedMoney", auth.getEarnedMoney);
router.post("/getAllUser", auth.getAllUser);
router.post("/removeUser", auth.removeUser);
// Bug-Report
router.post("/bug-report/create", bugreport.create);
router.post("/bug-report/getAll", bugreport.getAll);
router.post("/bug-report/getByUserId", bugreport.getByUserId);
router.post("/bug-report/updateBugStatus", bugreport.edit);
router.post("/bug-report/removeBugReport", bugreport.remove);
// User panel
router.post("/profile/names", profile.names);
router.post("/profile/pwd", profile.password);
router.post("/profile/avatar", upload.single("avatar"), avatar.avatar);
// Pool game
router.get("/pool-game/index", poolgame.index);
router.post("/pool-game/save", poolgame.save);
router.post("/pool-game/opensave", poolgame.opensave);
router.post("/pool-game/start", poolgame.start);
router.post("/pool-game/end", poolgame.end);
router.post("/pool-game/challengehistory", poolgame.getAdminChallengeHistory);
// Administrator challenges
router.get("/challenge/index", challenge.index);
router.post("/challenge/save", challenge.save);
router.delete("/challenge/remove/:id", challenge.remove);
router.post("/challenge/searchByUser", challenge.searchByUser);
// Wallet
router.post("/deposit", wallet.deposit);
router.post("/withdraw", wallet.withdraw);
router.post("/getUserInfo", wallet.getUserInfo);
router.post("/swap", wallet.swap);
router.post("/withdrawHistory", wallet.withdrawHistory);
router.post("/refreshWalletBalance", wallet.refreshWalletBalance);
router.post("/buyBitp", wallet.buyBITP);
// router.post("/charge", wallet.stripeCheck);
router.get("/admin/withdrawHistory", wallet.withdrawHistoryAdmin);
router.delete("/withdraw/remove/:id", wallet.remove);
router.get("/withdraw/check/:id", wallet.check);
// Game
router.post("/game/start", game.start);
router.post("/get-challenge-by-id", game.get_challenge_by_id);
router.post("/start-match", game.start_match);
router.post("/submit-match-result", game.submit_result);
router.post("/get-play-challenges", game.getPlayChallenges);
//Task
router.post("/task/getAll", task.getAll);
router.post("/task/new", task.create);
router.post("/task/remove", task.remove);
router.post("/task/edit", task.edit);
//TaskSuccess
router.post("/tasksuccess/userGetTaskData", tasksuccess.userGetTaskData);
router.post("/tasksuccess/userReportTask", tasksuccess.userReportTask);
router.post("/tasksuccess/adminGetTaskData", tasksuccess.adminGetTaskData);
router.post(
  "/tasksuccess/adminUpdateTaskStatus",
  tasksuccess.adminUpdateTaskStatus
);
exports.default = router;
