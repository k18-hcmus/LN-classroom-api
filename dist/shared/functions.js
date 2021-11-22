"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToObjectId = exports.stringToBoolean = exports.getRandomInt = exports.pErr = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Logger_1 = __importDefault(require("./Logger"));
const pErr = (err) => {
    if (err) {
        Logger_1.default.err(err);
    }
};
exports.pErr = pErr;
const getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.getRandomInt = getRandomInt;
const stringToBoolean = (value) => {
    return (value === 'true');
};
exports.stringToBoolean = stringToBoolean;
const stringToObjectId = (value) => {
    return new mongoose_1.default.Types.ObjectId(value);
};
exports.stringToObjectId = stringToObjectId;
