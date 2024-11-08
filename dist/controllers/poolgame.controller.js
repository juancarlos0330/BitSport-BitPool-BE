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
exports.start = exports.end = exports.save = exports.opensave = exports.getAdminChallengeHistory = exports.index = void 0;
const PoolChallenges_1 = __importDefault(require("../models/PoolChallenges"));
const PoolChallengeHistory_1 = __importDefault(require("../models/PoolChallengeHistory"));
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../service/helpers");
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    PoolChallenges_1.default.find()
        .populate({
        path: "create_userid",
        select: "-address", // Exclude the "address" field from the populated "create_userid" document
    })
        .populate({
        path: "opponent_userid",
        select: "-address", // Exclude the "address" field from the populated "opponent_userid" document
    })
        .sort({ createdAt: -1 })
        .then((models) => {
        res.json({ models });
    })
        .catch((err) => {
        res.json({});
    });
});
exports.index = index;
const getAdminChallengeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    PoolChallengeHistory_1.default.find({ challengeid: req.body.challengeid })
        .populate("challengeid")
        .populate("game_userid")
        .then((poolchallengehistory) => {
        res.json(poolchallengehistory);
    })
        .catch((err) => {
        res.json({ success: false, message: "error!" });
    });
});
exports.getAdminChallengeHistory = getAdminChallengeHistory;
const opensave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findOne({
        _id: req.body.create_userid,
    }).then((cuser) => {
        var errFlag = false;
        if (req.body.coin_type === 1) {
            if (cuser.money.bitp < req.body.amount) {
                errFlag = true;
                res.json({ success: false, message: "Insufficient BITP balance!" });
            }
            else {
                errFlag = false;
            }
        }
        else if (req.body.coin_type === 2) {
            if (cuser.money.busd < req.body.amount) {
                errFlag = true;
                res.json({ success: false, message: "Insufficient BUSD balance!" });
            }
            else {
                errFlag = false;
            }
        }
        else if (req.body.coin_type === 3) {
            if (cuser.money.usdt < req.body.amount) {
                errFlag = true;
                res.json({ success: false, message: "Insufficient USDT balance!" });
            }
            else {
                errFlag = false;
            }
        }
        else {
            if (cuser.money.cake < req.body.amount) {
                errFlag = true;
                res.json({ success: false, message: "Insufficient CAKE balance!" });
            }
            else {
                errFlag = false;
            }
        }
        if (!errFlag) {
            const newPoolChallenge = new PoolChallenges_1.default({
                create_userid: req.body.create_userid,
                opponent_userid: req.body.create_userid,
                status_num: 0,
                coin_type: req.body.coin_type,
                amount: req.body.amount,
                gametype: false,
            });
            newPoolChallenge.save().then((poolchallenge) => {
                res.json({ success: true, message: "Success!" });
            });
        }
    });
});
exports.opensave = opensave;
const save = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("TEST DATA : ", req.body);
    User_1.default.findOne({
        username: req.body.opponent_username.substr(1, req.body.opponent_username.length),
    }).then((model) => {
        if (model) {
            User_1.default.findOne({
                _id: req.body.create_userid,
            }).then((cuser) => {
                var errFlag = false;
                if (req.body.coin_type === 1) {
                    if (cuser.money.bitp < req.body.amount) {
                        errFlag = true;
                        res.json({ success: false, message: "Insufficient BITP balance!" });
                    }
                    else {
                        errFlag = false;
                    }
                }
                else if (req.body.coin_type === 2) {
                    if (cuser.money.busd < req.body.amount) {
                        errFlag = true;
                        res.json({ success: false, message: "Insufficient BUSD balance!" });
                    }
                    else {
                        errFlag = false;
                    }
                }
                else if (req.body.coin_type === 3) {
                    if (cuser.money.usdt < req.body.amount) {
                        errFlag = true;
                        res.json({ success: false, message: "Insufficient USDT balance!" });
                    }
                    else {
                        errFlag = false;
                    }
                }
                else {
                    if (cuser.money.cake < req.body.amount) {
                        errFlag = true;
                        res.json({ success: false, message: "Insufficient CAKE balance!" });
                    }
                    else {
                        errFlag = false;
                    }
                }
                if (!errFlag) {
                    const newPoolChallenge = new PoolChallenges_1.default({
                        create_userid: req.body.create_userid,
                        opponent_userid: model.id,
                        status_num: 0,
                        coin_type: req.body.coin_type,
                        amount: req.body.amount,
                        gametype: true,
                    });
                    var transport = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
                        service: "Gmail",
                        auth: {
                            user: "play@bitpool.gg",
                            pass: "kowolybekwavwwvr",
                        },
                    }));
                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: "play@bitpool.gg",
                        to: model.email,
                        subject: "BitPoolGame Request from Bitsport",
                        html: `<html>
                <body>
                  <div>
                    <p style="font-size: 32px; font-weight: bolder">
                      You received a pool game request from ` +
                            cuser.email +
                            `</p>
                  </div>
                </body>
              </html>`,
                    };
                    // send mail with defined transport object
                    transport.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            // res.send({ error: "Something wrong!" });
                            console.log("Something wrong!");
                            console.log(error);
                        }
                        else {
                            console.log("mail sent!");
                        }
                    });
                    newPoolChallenge.save().then((poolchallenge) => {
                        res.json({ success: true, message: "Success!" });
                    });
                }
            });
        }
        else {
            res.json({ success: false, message: "The opponent is not existing!" });
        }
    });
});
exports.save = save;
const end = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    PoolChallenges_1.default.findById(req.body.cid)
        .then((poolchallenge) => {
        if (poolchallenge.coin_type === 1) {
            User_1.default.findById(req.body.uid).then((cuser) => {
                cuser.money.bitp = req.body.flag
                    ? cuser.money.bitp +
                        Number(Number(poolchallenge.amount + poolchallenge.amount) * 0.98)
                    : cuser.money.bitp;
                cuser
                    .save()
                    .then((users) => {
                    poolchallenge.status_num = poolchallenge.status_num + 1;
                    poolchallenge.save().then((pools) => {
                        const newPoolChallengeHistory = new PoolChallengeHistory_1.default({
                            challengeid: req.body.cid,
                            game_userid: req.body.uid,
                            game_result: req.body.result,
                        });
                        newPoolChallengeHistory.save().then((poolchallengehis) => {
                            res.json({
                                success: true,
                                message: "End",
                                token: (0, helpers_1.generateToken)(users),
                            });
                        });
                    });
                })
                    .catch((err) => {
                    res.json({ success: false, message: "error" });
                });
            });
        }
        else if (poolchallenge.coin_type === 2) {
            User_1.default.findById(req.body.uid).then((cuser) => {
                cuser.money.busd = req.body.flag
                    ? cuser.money.busd +
                        Number(Number(poolchallenge.amount + poolchallenge.amount) * 0.95)
                    : cuser.money.busd;
                cuser
                    .save()
                    .then((users) => {
                    poolchallenge.status_num = poolchallenge.status_num + 1;
                    poolchallenge.save().then((pools) => {
                        const newPoolChallengeHistory = new PoolChallengeHistory_1.default({
                            challengeid: req.body.cid,
                            game_userid: req.body.uid,
                            game_result: req.body.result,
                        });
                        newPoolChallengeHistory.save().then((poolchallengehis) => {
                            res.json({
                                success: true,
                                message: "End",
                                token: (0, helpers_1.generateToken)(users),
                            });
                        });
                    });
                })
                    .catch((err) => {
                    res.json({ success: false, message: "error" });
                });
            });
        }
        else if (poolchallenge.coin_type === 3) {
            User_1.default.findById(req.body.uid).then((cuser) => {
                cuser.money.usdt = req.body.flag
                    ? cuser.money.usdt +
                        Number(Number(poolchallenge.amount + poolchallenge.amount) * 0.95)
                    : cuser.money.usdt;
                cuser
                    .save()
                    .then((users) => {
                    poolchallenge.status_num = poolchallenge.status_num + 1;
                    poolchallenge.save().then((pools) => {
                        const newPoolChallengeHistory = new PoolChallengeHistory_1.default({
                            challengeid: req.body.cid,
                            game_userid: req.body.uid,
                            game_result: req.body.result,
                        });
                        newPoolChallengeHistory.save().then((poolchallengehis) => {
                            res.json({
                                success: true,
                                message: "End",
                                token: (0, helpers_1.generateToken)(users),
                            });
                        });
                    });
                })
                    .catch((err) => {
                    res.json({ success: false, message: "error" });
                });
            });
        }
        else {
            User_1.default.findById(req.body.uid).then((cuser) => {
                cuser.money.cake = req.body.flag
                    ? cuser.money.cake +
                        Number(Number(poolchallenge.amount + poolchallenge.amount) * 0.95)
                    : cuser.money.cake;
                cuser
                    .save()
                    .then((users) => {
                    poolchallenge.status_num = poolchallenge.status_num + 1;
                    poolchallenge.save().then((pools) => {
                        const newPoolChallengeHistory = new PoolChallengeHistory_1.default({
                            challengeid: req.body.cid,
                            game_userid: req.body.uid,
                            game_result: req.body.result,
                        });
                        newPoolChallengeHistory.save().then((poolchallengehis) => {
                            res.json({
                                success: true,
                                message: "End",
                                token: (0, helpers_1.generateToken)(users),
                            });
                        });
                    });
                })
                    .catch((err) => {
                    res.json({ success: false, message: "error" });
                });
            });
        }
    })
        .catch((err) => {
        res.json({ success: false, message: "error" });
    });
});
exports.end = end;
const start = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    PoolChallenges_1.default.findOne({ _id: req.body.cid })
        .then((poolchallenge) => {
        if (poolchallenge.gametype) {
            if (poolchallenge.create_userid == req.body.uid) {
                User_1.default.findOne({ _id: req.body.uid })
                    .then((cuser) => {
                    var errFlag = false;
                    if (poolchallenge.coin_type === 1) {
                        if (cuser.money.bitp < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient BITP balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinUser === false) {
                                poolchallenge.joinUser = true;
                                cuser.money.bitp = cuser.money.bitp - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    else if (poolchallenge.coin_type === 2) {
                        if (cuser.money.busd < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient BUSD balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinUser === false) {
                                poolchallenge.joinUser = true;
                                cuser.money.busd = cuser.money.busd - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    else if (poolchallenge.coin_type === 3) {
                        if (cuser.money.usdt < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient USDT balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinUser === false) {
                                poolchallenge.joinUser = true;
                                cuser.money.usdt = cuser.money.usdt - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    else {
                        if (cuser.money.cake < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient CAKE balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinUser === false) {
                                poolchallenge.joinUser = true;
                                cuser.money.cake = cuser.money.cake - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    // if (!errFlag) {
                    //   poolchallenge.status_num = poolchallenge.status_num + 1;
                    //   poolchallenge.save().then(() => {
                    //     res.json({
                    //       success: true,
                    //       message: "Connected the Game!",
                    //     });
                    //   });
                    // }
                })
                    .catch((err) => {
                    res.json({ success: false, message: err });
                });
            }
            else if (poolchallenge.opponent_userid == req.body.uid) {
                User_1.default.findOne({ _id: req.body.uid })
                    .then((cuser) => {
                    var errFlag = false;
                    if (poolchallenge.coin_type === 1) {
                        if (cuser.money.bitp < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient BITP balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinOpponent === false) {
                                poolchallenge.joinOpponent = true;
                                cuser.money.bitp = cuser.money.bitp - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    else if (poolchallenge.coin_type === 2) {
                        if (cuser.money.busd < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient BUSD balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinOpponent === false) {
                                poolchallenge.joinOpponent = true;
                                cuser.money.busd = cuser.money.busd - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    else if (poolchallenge.coin_type === 3) {
                        if (cuser.money.usdt < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient USDT balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinOpponent === false) {
                                poolchallenge.joinOpponent = true;
                                cuser.money.usdt = cuser.money.usdt - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    else {
                        if (cuser.money.cake < poolchallenge.amount) {
                            errFlag = true;
                            res.json({
                                success: false,
                                message: "Insufficient CAKE balance!",
                            });
                        }
                        else {
                            errFlag = false;
                            if (poolchallenge.joinOpponent === false) {
                                poolchallenge.joinOpponent = true;
                                cuser.money.cake = cuser.money.cake - poolchallenge.amount;
                            }
                            cuser.save().then((cusers) => {
                                poolchallenge.status_num = poolchallenge.status_num + 1;
                                poolchallenge.save().then((pppoolchange) => {
                                    User_1.default.findOne({ _id: req.body.uid })
                                        .then((users) => {
                                        res.json({
                                            success: true,
                                            message: "Connected the Game!",
                                            token: (0, helpers_1.generateToken)(users),
                                        });
                                    })
                                        .catch((err) => {
                                        res.json({
                                            success: false,
                                            message: "error",
                                            token: "",
                                        });
                                    });
                                });
                            });
                        }
                    }
                    if (!errFlag) {
                        poolchallenge.status_num = poolchallenge.status_num + 1;
                        poolchallenge.save().then(() => {
                            res.json({
                                success: true,
                                message: "Connected the Game!",
                            });
                        });
                    }
                    if (!errFlag) {
                        User_1.default.findOne({ _id: poolchallenge.create_userid }).then((createdUser) => {
                            var transport = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
                                service: "Gmail",
                                auth: {
                                    user: "stanislav.kogutstt2@gmail.com",
                                    pass: "phlbvyefyuiddptp",
                                },
                            }));
                            // setup e-mail data with unicode symbols
                            var mailOptions = {
                                from: "stanislav.kogutstt2@gmail.com",
                                to: createdUser.email,
                                subject: "BitPoolGame Acception from Bitsport",
                                html: `<html>
                        <body>
                          <div>
                            <p style="font-size: 32px; font-weight: bolder">
                            ` +
                                    cuser.username +
                                    ` accepted your pool game request. 
                            </p>
                          </div>
                        </body>
                      </html>`,
                            };
                            // send mail with defined transport object
                            transport.sendMail(mailOptions, function (error, response) {
                                if (error) {
                                    // res.send({ error: "Something wrong!" });
                                    console.log(error);
                                }
                                else {
                                    console.log("mail sent!");
                                }
                            });
                        });
                    }
                })
                    .catch((err) => {
                    res.json({ success: false, message: err });
                });
            }
            else {
                res.json({
                    success: false,
                    message: "You are not a creator or opponent!",
                });
            }
        }
        else {
            User_1.default.findOne({ _id: req.body.uid })
                .then((cuser) => {
                var errFlag = false;
                if (poolchallenge.coin_type === 1) {
                    if (cuser.money.bitp < poolchallenge.amount) {
                        errFlag = true;
                        res.json({
                            success: false,
                            message: "Insufficient BITP balance!",
                        });
                    }
                    else {
                        errFlag = false;
                        cuser.money.bitp = cuser.money.bitp - poolchallenge.amount;
                        cuser.save().then((cusers) => {
                            poolchallenge.status_num = poolchallenge.status_num + 1;
                            if (poolchallenge.create_userid.toString() ===
                                cuser._id.toString()) {
                                poolchallenge.create_userid = cuser._id;
                                poolchallenge.joinUser = true;
                            }
                            else {
                                poolchallenge.opponent_userid = cuser._id;
                                poolchallenge.joinOpponent = true;
                            }
                            poolchallenge.save().then((pppoolchange) => {
                                User_1.default.findOne({ _id: req.body.uid })
                                    .then((users) => {
                                    res.json({
                                        success: true,
                                        message: "Connected the Game!",
                                        token: (0, helpers_1.generateToken)(users),
                                    });
                                })
                                    .catch((err) => {
                                    res.json({
                                        success: false,
                                        message: "error",
                                        token: "",
                                    });
                                });
                            });
                        });
                    }
                }
                else if (poolchallenge.coin_type === 2) {
                    if (cuser.money.busd < poolchallenge.amount) {
                        errFlag = true;
                        res.json({
                            success: false,
                            message: "Insufficient BUSD balance!",
                        });
                    }
                    else {
                        errFlag = false;
                        cuser.money.busd = cuser.money.busd - poolchallenge.amount;
                        cuser.save().then((cusers) => {
                            poolchallenge.status_num = poolchallenge.status_num + 1;
                            if (poolchallenge.create_userid.toString() ===
                                cuser._id.toString()) {
                                poolchallenge.create_userid = cuser._id;
                                poolchallenge.joinUser = true;
                            }
                            else {
                                poolchallenge.opponent_userid = cuser._id;
                                poolchallenge.joinOpponent = true;
                            }
                            poolchallenge.save().then((pppoolchange) => {
                                User_1.default.findOne({ _id: req.body.uid })
                                    .then((users) => {
                                    res.json({
                                        success: true,
                                        message: "Connected the Game!",
                                        token: (0, helpers_1.generateToken)(users),
                                    });
                                })
                                    .catch((err) => {
                                    res.json({
                                        success: false,
                                        message: "error",
                                        token: "",
                                    });
                                });
                            });
                        });
                    }
                }
                else if (poolchallenge.coin_type === 3) {
                    if (cuser.money.usdt < poolchallenge.amount) {
                        errFlag = true;
                        res.json({
                            success: false,
                            message: "Insufficient USDT balance!",
                        });
                    }
                    else {
                        errFlag = false;
                        cuser.money.usdt = cuser.money.usdt - poolchallenge.amount;
                        cuser.save().then((cusers) => {
                            poolchallenge.status_num = poolchallenge.status_num + 1;
                            if (poolchallenge.create_userid.toString() ===
                                cuser._id.toString()) {
                                poolchallenge.create_userid = cuser._id;
                                poolchallenge.joinUser = true;
                            }
                            else {
                                poolchallenge.opponent_userid = cuser._id;
                                poolchallenge.joinOpponent = true;
                            }
                            poolchallenge.save().then((pppoolchange) => {
                                User_1.default.findOne({ _id: req.body.uid })
                                    .then((users) => {
                                    res.json({
                                        success: true,
                                        message: "Connected the Game!",
                                        token: (0, helpers_1.generateToken)(users),
                                    });
                                })
                                    .catch((err) => {
                                    res.json({
                                        success: false,
                                        message: "error",
                                        token: "",
                                    });
                                });
                            });
                        });
                    }
                }
                else {
                    if (cuser.money.cake < poolchallenge.amount) {
                        errFlag = true;
                        res.json({
                            success: false,
                            message: "Insufficient CAKE balance!",
                        });
                    }
                    else {
                        errFlag = false;
                        cuser.money.cake = cuser.money.cake - poolchallenge.amount;
                        cuser.save().then((cusers) => {
                            poolchallenge.status_num = poolchallenge.status_num + 1;
                            if (poolchallenge.create_userid.toString() ===
                                cuser._id.toString()) {
                                poolchallenge.create_userid = cuser._id;
                                poolchallenge.joinUser = true;
                            }
                            else {
                                poolchallenge.opponent_userid = cuser._id;
                                poolchallenge.joinOpponent = true;
                            }
                            poolchallenge.save().then((pppoolchange) => {
                                User_1.default.findOne({ _id: req.body.uid })
                                    .then((users) => {
                                    res.json({
                                        success: true,
                                        message: "Connected the Game!",
                                        token: (0, helpers_1.generateToken)(users),
                                    });
                                })
                                    .catch((err) => {
                                    res.json({
                                        success: false,
                                        message: "error",
                                        token: "",
                                    });
                                });
                            });
                        });
                    }
                }
            })
                .catch((err) => {
                res.json({ success: false, message: err });
            });
        }
    })
        .catch((err) => {
        res.json({ success: false, message: err });
    });
});
exports.start = start;
