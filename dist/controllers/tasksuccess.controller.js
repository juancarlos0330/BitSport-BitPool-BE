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
exports.userReportTask = exports.userGetTaskData = exports.adminUpdateTaskStatus = exports.adminGetTaskData = void 0;
const TaskSuccess_1 = __importDefault(require("../models/TaskSuccess"));
const Task_1 = __importDefault(require("../models/Task"));
const User_1 = __importDefault(require("../models/User"));
const adminGetTaskData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    TaskSuccess_1.default.find({ taskId: req.body.taskId }).then((models) => {
        res.json({ models });
    });
});
exports.adminGetTaskData = adminGetTaskData;
const giveReward = (taskId, userId) => {
    let amount;
    let unit;
    Task_1.default.findOne({ _id: taskId }).then((model1) => __awaiter(void 0, void 0, void 0, function* () {
        amount = model1.reward;
        unit = model1.unit;
        User_1.default.findOne({ username: userId }).then((model2) => __awaiter(void 0, void 0, void 0, function* () {
            if (unit == "busd")
                model2.money.busd += amount;
            else if (unit == "cake")
                model2.money.cake += amount;
            else if (unit == "usdt")
                model2.money.usdt += amount;
            else if (unit == "bitp")
                model2.money.bitp += amount;
            model2.save();
        }));
    }));
};
const adminUpdateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    TaskSuccess_1.default.findOne({
        _id: req.body.taskSuccessId,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        if (!model)
            res.json({ success: false, message: "Error" });
        model.taskStatus = req.body.taskStatus;
        model.statusNote = req.body.statusNote;
        if (model.taskStatus == 1) {
            model.getReward = true;
            giveReward(model.taskId, model.userId);
        }
        model.save().then(() => {
            res.json({ success: true, model });
        });
    }));
});
exports.adminUpdateTaskStatus = adminUpdateTaskStatus;
const userGetTaskData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    TaskSuccess_1.default.find({
        userId: req.body.userId,
    }).then((models) => __awaiter(void 0, void 0, void 0, function* () {
        if (!models)
            res.json({ success: false, message: "nothing is reported" });
        res.json({ success: true, models });
    }));
});
exports.userGetTaskData = userGetTaskData;
const userReportTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    TaskSuccess_1.default.findOne({
        taskId: req.body.taskId,
        userId: req.body.userId,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        if (!model) {
            let length = 0;
            yield TaskSuccess_1.default.find()
                .countDocuments()
                .then((data) => (length = data));
            model = new TaskSuccess_1.default();
            model.index = length + 1;
        }
        model.taskId = req.body.taskId;
        model.userId = req.body.userId;
        model.reportDate = req.body.reportDate;
        model.reportDesc = req.body.reportDesc;
        model.reportLink = req.body.reportLink;
        model.taskStatus = 0;
        model.statusNote = "";
        model.getReward = false;
        model.save().then(() => {
            res.json({ success: true, model });
        });
    }));
});
exports.userReportTask = userReportTask;
