"use strict";
// Put shared constants here
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIEWS = exports.UNEXPECTED_ERROR = exports.UPDATE_USER_FAILED = exports.INVITATION_EMAIL_ERROR = exports.INVITATION_EMAIL_EXPIRED = exports.INVITATION_EMAIL_SUBJECT = exports.USERNAME_EXISTED_ERROR = exports.STUDENT_ID_EXISTED_ERROR = exports.EMAIL_EXISTED_ERROR = exports.REFRESH_TOKEN_MESSAGE = exports.UNAUTHORIZE_MESSAGE = exports.JWT_SECRET = exports.JWT_KEY = exports.REFRESH_TOKEN = exports.ACCESS_TOKEN = exports.REFRESH_TOKEN_EXPIRE_TIME = exports.ACCESS_TOKEN_EXPIRE_TIME = exports.paramMissingError = void 0;
exports.paramMissingError = 'One or more of the required parameters was missing.';
exports.ACCESS_TOKEN_EXPIRE_TIME = '10m';
exports.REFRESH_TOKEN_EXPIRE_TIME = '10d';
exports.ACCESS_TOKEN = "accessToken";
exports.REFRESH_TOKEN = "refreshToken";
exports.JWT_KEY = "jwt";
exports.JWT_SECRET = "S3cr3t";
exports.UNAUTHORIZE_MESSAGE = "Unauthorize";
exports.REFRESH_TOKEN_MESSAGE = "Refresh token successfully!";
exports.EMAIL_EXISTED_ERROR = "Your email's already existed!";
exports.STUDENT_ID_EXISTED_ERROR = "Your student id's already existed!";
exports.USERNAME_EXISTED_ERROR = "Your username's already existed!";
exports.INVITATION_EMAIL_SUBJECT = "Invitation to classroom";
exports.INVITATION_EMAIL_EXPIRED = "7d";
exports.INVITATION_EMAIL_ERROR = "Invite link is invalid or expried!";
exports.UPDATE_USER_FAILED = "Failed to update profile!";
exports.UNEXPECTED_ERROR = "UNEXPECTED ERROR!";
var VIEWS;
(function (VIEWS) {
    VIEWS["CONFIRM_EMAIl"] = "confirm-email";
    VIEWS["INVITATION"] = "invitation";
})(VIEWS = exports.VIEWS || (exports.VIEWS = {}));
