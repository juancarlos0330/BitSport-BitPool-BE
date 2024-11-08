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
exports.remove = exports.save = exports.searchByUser = exports.index = void 0;
const Challenge_1 = __importDefault(require("../models/Challenge"));
const PlayChallenges_1 = __importDefault(require("../models/PlayChallenges"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Challenge_1.default.find().then((models) => {
        res.json({ models });
    });
});
exports.index = index;
const getCurrentMatch = (challenge_id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return PlayChallenges_1.default.findOne({
        user_id: userId,
        challenge_id: challenge_id,
        isFinished: false,
    }).then((model) => {
        let current_match = 0;
        if (model)
            current_match = model.current_match;
        return current_match;
    });
});
const searchByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    PlayChallenges_1.default.find({
        user_id: req.body.userId,
        isFinished: true,
    }).then((models) => {
        const data = models.map((item) => {
            return item.challenge_id;
        });
        Challenge_1.default.find().then((challenge_models) => __awaiter(void 0, void 0, void 0, function* () {
            const filteredData = challenge_models.filter((item) => {
                return !data.includes(item.index);
            });
            let newData = [];
            for (let index = 0; index < filteredData.length; index++) {
                const element = filteredData[index];
                let current_match = yield getCurrentMatch(element.index, req.body.userId);
                newData.push({ challenge_id: element.index, current_match });
            }
            res.json({ data: { filteredData, newData } });
        }));
    });
});
exports.searchByUser = searchByUser;
const save = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Challenge_1.default.findOne({
        title: req.body.title,
        qc: req.body.qc,
        difficulty: req.body.difficulty,
        streak: req.body.streak,
        amount: req.body.amount,
        number_of_players: req.body.number_of_players,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        if (model)
            res.json({ success: false, message: "The challenge exits!" });
        let length = 0;
        yield Challenge_1.default.find()
            .countDocuments()
            .then((data) => (length = data));
        model = new Challenge_1.default();
        model.title = req.body.title;
        model.difficulty = req.body.difficulty;
        model.qc = req.body.qc;
        model.streak = req.body.streak;
        model.amount = req.body.amount;
        model.coin_sku = req.body.cointype;
        model.number_of_players = req.body.number_of_players;
        model.played_number_count = 0;
        model.index = length + 1;
        model.save().then(() => {
            res.json({ success: true, model });
        });
    }));
});
exports.save = save;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Challenge_1.default.findByIdAndDelete(req.params.id).then((model) => {
        res.json({ success: true, model });
    });
});
exports.remove = remove;
