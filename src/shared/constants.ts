// Put shared constants here

export const paramMissingError = 'One or more of the required parameters was missing.';
export const ACCESS_TOKEN_EXPIRE_TIME = '10m'
export const REFRESH_TOKEN_EXPIRE_TIME = '1d'
export const ACCESS_TOKEN = "accessToken"
export const REFRESH_TOKEN = "refreshToken"
export const JWT_KEY = "jwt"
export const JWT_SECRET = "S3cr3t"
export const UNAUTHORIZE_MESSAGE = "Unauthorize"
export const REFRESH_TOKEN_MESSAGE = "Refresh token successfully!"
export const EMAIL_EXISTED_ERROR = "Your email's already existed!"
export const USERNAME_EXISTED_ERROR = "Your username's already existed!"
export const INVITATION_EMAIL_SUBJECT = "Invitation to classroom"
export const INVITATION_EMAIL_EXPIRED = "5m"
export const INVITATION_EMAIL_ERROR = "Invite link is invalid or expried!"

export enum VIEWS {
    CONFIRM_EMAIl = 'confirm-email',
    INVITATION = 'invitation'
}