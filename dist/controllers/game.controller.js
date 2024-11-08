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
exports.getPlayChallenges = exports.submit_result = exports.start_match = exports.get_challenge_by_id = exports.start = void 0;
const moment_1 = __importDefault(require("moment"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const PlayChallenges_1 = __importDefault(require("../models/PlayChallenges"));
const PlayedChallenges_1 = __importDefault(require("../models/PlayedChallenges"));
const User_1 = __importDefault(require("../models/User"));
const start = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.uid) {
        if (req.body.cid) {
            yield Challenge_1.default.findOne({ index: req.body.cid }).then((challenge_model) => __awaiter(void 0, void 0, void 0, function* () {
                if (challenge_model.played_number_count ==
                    challenge_model.number_of_players) {
                    res.json({ success: false, message: "Challenge closed." });
                }
                else {
                    let isValid = true;
                    if (challenge_model.coin_sku !== 1 && req.body.scratch) {
                        yield User_1.default.findOne({ index: req.body.uid }).then((user) => {
                            if (user.money.quest < challenge_model.qc) {
                                isValid = false;
                            }
                            else {
                                user.money.quest -= challenge_model.qc;
                                user.save().then((err) => {
                                    challenge_model.status = 2;
                                    challenge_model.save();
                                });
                            }
                        });
                    }
                    if (!isValid) {
                        res.json({
                            success: false,
                            message: "You have too low Quest Credit",
                        });
                    }
                    else {
                        let length = 0;
                        yield PlayChallenges_1.default.countDocuments().then((data) => (length = data));
                        yield PlayChallenges_1.default.findOne({
                            challenge_id: challenge_model.index,
                            user_id: req.body.uid,
                        }).then((play_model) => {
                            if (!play_model) {
                                play_model = new PlayChallenges_1.default();
                                play_model.user_id = req.body.uid;
                                play_model.challenge_id = challenge_model.index;
                                play_model.index = length + 1;
                                play_model.save();
                            }
                        });
                        res.json({ success: true });
                    }
                }
            }));
        }
        else {
            res.json({ success: false, message: "Please select correct challenge" });
        }
    }
    else {
        res.json({ success: false, message: "Please login!" });
    }
});
exports.start = start;
const get_challenge_by_id = (req, res) => {
    Challenge_1.default.findOne({ index: req.body.challenge_id }).then((data) => {
        if (data) {
            res.json({
                status: 1,
                data: {
                    id: data.index,
                    title: data.title,
                    description: null,
                    difficulty: data.difficulty,
                    streak: data.streak,
                    amount: data.amount,
                    coin_sku: data.coin_sku === 1
                        ? "BITP"
                        : data.coin_sku === 2
                            ? "BUSD"
                            : data.coin_sku === 3
                                ? "USDT"
                                : "CAKE",
                    loss_back: null,
                    qc: 1,
                    status: "1",
                    created_at: data.createdAt,
                    updated_at: data.updatedAt,
                },
            });
        }
    });
};
exports.get_challenge_by_id = get_challenge_by_id;
const start_match = (req, res) => {
    PlayChallenges_1.default.find({
        challenge_id: req.body.match_id,
        user_id: req.body.user_id,
    })
        .sort({ createdAt: -1 })
        .then((model) => {
        PlayedChallenges_1.default.find({ user_id: model[0].user_id })
            .sort({ createdAt: -1 })
            .then((prev_match) => __awaiter(void 0, void 0, void 0, function* () {
            if (prev_match.length > 0) {
                prev_match[0].winorloss = 0;
                prev_match[0].end_match = "Closed by system";
                prev_match[0].status = 2;
                prev_match[0].save();
            }
            let length = 0;
            yield PlayedChallenges_1.default.countDocuments().then((data) => (length = data));
            Challenge_1.default.findOne({ index: req.body.match_id }).then((data) => {
                if (data) {
                    data.played_number_count++;
                    data.save();
                }
            });
            const start = new PlayedChallenges_1.default();
            start.challenge_id = req.body.match_id;
            start.user_id = model[0].user_id;
            start.start_match = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
            start.end_match = "not set";
            start.winorloss = "not set";
            start.index = length + 1;
            start.save();
            Challenge_1.default.findOne({ index: req.body.match_id }).then((challenge_model) => {
                if (challenge_model) {
                    const option = {
                        status: 1,
                        message: "Match Started",
                        data: {
                            id: start.index,
                            challenge_id: challenge_model.index,
                            user_id: req.body.user_id,
                            start_match: start.start_match,
                            end_match: start.end_match,
                            winorloss: start.winorloss,
                        },
                    };
                    res.json(option);
                }
            });
        }));
    });
};
exports.start_match = start_match;
const submit_result = (req, res) => {
    const match_id = req.body.match_id;
    // win = 1 | loss = 0
    const result = req.body.result;
    let iswonchallenge = false;
    let isFinished = false;
    PlayedChallenges_1.default.findOne({ index: match_id }).then((played_model) => {
        const user_id = played_model.user_id;
        // update user match table
        played_model.winorloss = result;
        played_model.end_match = (0, moment_1.default)().format("YYYY-MM-DD");
        played_model.status = 2;
        played_model.save();
        // update user challenge table
        PlayChallenges_1.default.findOne({
            challenge_id: played_model.challenge_id,
            user_id,
        }).then((play_model) => {
            // get challenge info
            Challenge_1.default.findOne({ index: played_model.challenge_id }).then((main_challenge) => __awaiter(void 0, void 0, void 0, function* () {
                if (Number(result) === 1) {
                    play_model.win_match += 1;
                    play_model.current_match += 1;
                }
                else {
                    let contrast_temp = play_model.current_match - 2;
                    play_model.loss_match = play_model.loss_match + 1;
                    if (contrast_temp < 0) {
                        contrast_temp = 0;
                    }
                    play_model.current_match = contrast_temp;
                    if (main_challenge.coin_sku !== 1) {
                        main_challenge.save();
                    }
                    play_model.isFinished = true;
                    isFinished = true;
                }
                yield play_model.save();
                if (play_model.current_match === main_challenge.streak) {
                    play_model.status = 2;
                    play_model.iswonchallenge = 1;
                    play_model.isFinished = true;
                    yield play_model.save();
                    iswonchallenge = true;
                    isFinished = true;
                    main_challenge.status = 2;
                    yield main_challenge.save();
                }
                User_1.default.findOne({ index: play_model.user_id }).then((user) => {
                    user.latestPlayedTotalStreak = main_challenge.streak;
                    user.latestPlayedCurStreak = play_model.current_match;
                    user.save();
                });
                if (iswonchallenge) {
                    User_1.default.findOne({ index: play_model.user_id }).then((user) => {
                        if (main_challenge.coin_sku === 1) {
                            user.money.bitp += main_challenge.amount;
                            user.earnMoney.bitp += main_challenge.amount;
                            user.latestEarnUnit = "BITP";
                            // friend.money.bitp += main_challenge.amount * 0.05;
                        }
                        else if (main_challenge.coin_sku === 2) {
                            user.money.busd += main_challenge.amount;
                            user.earnMoney.busd += main_challenge.amount;
                            user.latestEarnUnit = "BUSD";
                            // friend.money.busd += main_challenge.amount * 0.05;
                        }
                        else if (main_challenge.coin_sku === 3) {
                            user.money.usdt += main_challenge.amount;
                            user.earnMoney.usdt += main_challenge.amount;
                            user.latestEarnUnit = "USDT";
                            // friend.money.usdt += main_challenge.amount * 0.05;
                        }
                        else if (main_challenge.coin_sku === 4) {
                            user.money.cake += main_challenge.amount;
                            user.earnMoney.cake += main_challenge.amount;
                            user.latestEarnUnit = "CAKE";
                            // friend.money.cake += main_challenge.amount * 0.05;
                        }
                        // User.findOne({ index: user.referralId }).then((friend: any) => {
                        //   friend.save();
                        // });
                        user.latestEarnAmount = main_challenge.amount;
                        user.latestPlayedTotalStreak = main_challenge.streak;
                        user.latestPlayedCurStreak = play_model.current_match;
                        user.save();
                    });
                }
                res.json({
                    status: 1,
                    iswon: iswonchallenge,
                    isFinished,
                    message: "Result submitted",
                });
            }));
        });
    });
};
exports.submit_result = submit_result;
const getPlayChallenges = (req, res) => {
    PlayChallenges_1.default.find({ user_id: req.body.userId }).then((models) => {
        res.json({ models });
    });
};
exports.getPlayChallenges = getPlayChallenges;
