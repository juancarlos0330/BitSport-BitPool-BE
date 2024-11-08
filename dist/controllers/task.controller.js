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
exports.edit = exports.remove = exports.create = exports.getAll = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Task_1.default.find().then((models) => {
        res.json({ models });
    });
});
exports.getAll = getAll;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Task_1.default.findOne({
        title: req.body.title,
        description: req.body.description,
        reward: req.body.reward,
        unit: req.body.unit,
        status: req.body.status,
        shared: req.body.shared,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        if (model)
            res.json({ success: false, message: "The Task exits!" });
        let length = 0;
        yield Task_1.default.find()
            .countDocuments()
            .then((data) => (length = data));
        model = new Task_1.default();
        model.title = req.body.title;
        model.description = req.body.description;
        model.reward = req.body.reward;
        model.unit = req.body.unit;
        model.status = req.body.status;
        model.shared = req.body.shared;
        model.index = length + 1;
        model.save().then(() => {
            res.json({ success: true, model });
        });
    }));
});
exports.create = create;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Task_1.default.findByIdAndDelete(req.body.taskId).then((model) => {
        res.json({ success: true, model });
    });
});
exports.remove = remove;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Task_1.default.findOne({
        _id: req.body.taskId,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        if (!model)
            res.json({ success: false, message: "The Task not exits!" });
        model.title = req.body.title;
        model.description = req.body.description;
        model.reward = req.body.reward;
        model.unit = req.body.unit;
        model.status = req.body.status;
        model.shared = req.body.shared;
        model.save().then(() => {
            res.json({ success: true, model });
        });
    }));
});
exports.edit = edit;
