// Put shared constants here

export const paramMissingError =
  "One or more of the required parameters was missing.";
export const ACCESS_TOKEN_EXPIRE_TIME = "10m";
export const REFRESH_TOKEN_EXPIRE_TIME = "10d";
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const JWT_KEY = "jwt";
export const JWT_SECRET = "S3cr3t";
export const UNAUTHORIZE_MESSAGE = "Unauthorize";
export const REFRESH_TOKEN_MESSAGE = "Refresh token successfully!";
export const EMAIL_EXISTED_ERROR = "Your email's already existed!";
export const STUDENT_ID_EXISTED_ERROR = "Your student id's already existed!";
export const USERNAME_EXISTED_ERROR = "Your username's already existed!";
export const INVITATION_EMAIL_SUBJECT = "Invitation to classroom";
export const INVITATION_EMAIL_EXPIRED = "7d";
export const INVITATION_EMAIL_ERROR = "Invite link is invalid or expried!";
export const UPDATE_USER_FAILED = "Failed to update profile!";
export const UNEXPECTED_ERROR = "UNEXPECTED ERROR!";
export const SUCCESSFULLY_MESSAGE = "SUCCESSFULLY!";
export const NO_HAVE_STUDENT = "No use has this studentId";
export const INVALID_BAN = "Cannot ban unactivated account!";
export const MAIL_VERIFICATION_SUBJECT =
  "Verification your account to join classroom management";
export const MAIL_RESET_PASSWORD_SUBJECT = "Reset your password";

export enum VIEWS {
  CONFIRM_EMAIl = "confirm-email",
  INVITATION = "invitation",
  RESET_PASSWORD = "reset-password",
}

export const DEFAULT_URL = process.env.CLIENT_HOST || "http://localhost:3000";

export enum USER_STATUS {
  ACTIVATED = "Activated",
  UNACTIVATED = "Unactivated",
  BANNED = "Banned",
}

export enum USER_ROLE {
  ADMIN = "Admin",
  MEMBER = "Member",
}
