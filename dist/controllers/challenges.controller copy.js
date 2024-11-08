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
exports.remove = exports.save = exports.index = void 0;
const Challenge_1 = __importDefault(require("../models/Challenge"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Challenge_1.default.find().then((models) => {
        res.json({ models });
    });
});
exports.index = index;
const save = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Challenge_1.default.findOne({
        title: req.body.title,
        qc: req.body.qc,
        difficulty: req.body.difficulty,
        streak: req.body.streak,
        amount: req.body.amount,
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
