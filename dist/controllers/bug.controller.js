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
exports.remove = exports.getByUserId = exports.edit = exports.create = exports.getAll = void 0;
const BugReport_1 = __importDefault(require("../models/BugReport"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    BugReport_1.default.find().then((models) => {
        res.json({ models });
    });
});
exports.getAll = getAll;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    BugReport_1.default.findOne({
        BugTitle: req.body.BugTitle,
        BugDescription: req.body.BugDescription,
        BugReportLink: req.body.BugReportLink,
        ReporterId: req.body.userId,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        if (model)
            res.json({ success: false, message: "The BugReport exits!" });
        let length = 0;
        yield BugReport_1.default.find()
            .countDocuments()
            .then((data) => (length = data));
        model = new BugReport_1.default();
        model.BugTitle = req.body.BugTitle;
        model.BugDescription = req.body.BugDescription;
        model.BugReportLink = req.body.BugReportLink;
        model.ReporterId = req.body.userId;
        model.status = 0;
        model.ReportReply = "";
        model.index = length + 1;
        yield model.save().then(() => {
            res.json({ success: true, model });
        });
    }));
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    BugReport_1.default.findOne({
        _id: req.body.bugId,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        if (!model)
            res.json({ success: false, message: "The BugReport not exits!" });
        model.status = req.body.status;
        model.ReportReply = req.body.reportReply;
        yield model.save().then(() => {
            res.json({ success: true, model });
        });
    }));
});
exports.edit = edit;
const getByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    BugReport_1.default.find({
        ReporterId: req.body.userId,
    }).then((model) => __awaiter(void 0, void 0, void 0, function* () {
        res.json({ success: true, model });
    }));
});
exports.getByUserId = getByUserId;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    BugReport_1.default.findByIdAndDelete(req.body.bugId).then((model) => {
        res.json({ success: true, model });
    });
});
exports.remove = remove;
