import { UserModel } from "@models/user.model";
import * as RefreshTokenService from "@services/refresh-token.service";
import { JWT_KEY, REFRESH_TOKEN_MESSAGE, UNAUTHORIZE_MESSAGE } from "@shared/constants";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";

export const checkAuthentication = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const login = async (req: Request, res: Response) => {
    const user = req.user as UserModel
    const rememberMe = get(req.body, "rememberMe")
    const { password, ...response } = user.toObject()

    const accessToken = RefreshTokenService.createNewAccessToken(user.id)
    let refreshToken = null
    if (rememberMe) {
        refreshToken = await RefreshTokenService.createNewRefreshToken(user.id)
    }

    const jwtPayload = RefreshTokenService.prepareCookiesPayload(accessToken, refreshToken)
    res.clearCookie(JWT_KEY)
    res.cookie(JWT_KEY, jwtPayload, { httpOnly: true })
    res.json(response)
}

export const googleLogin = async (req: Request, res: Response) => {
    const user = req.user as UserModel

    const accessToken = RefreshTokenService.createNewAccessToken(user.id)
    const refreshToken = await RefreshTokenService.createNewRefreshToken(user.id)
    const jwtPayload = RefreshTokenService.prepareCookiesPayload(accessToken, refreshToken)
    res.clearCookie(JWT_KEY)
    res.cookie(JWT_KEY, jwtPayload, { httpOnly: true })
    res.redirect(`${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`)
}

export const refreshToken = async (req: Request, res: Response,) => {
    try {
        if (req.cookies && req.cookies[JWT_KEY]) {
            const jwtPayload = req.cookies[JWT_KEY]
            const { refreshToken } = RefreshTokenService.parseToken(jwtPayload)
            const tokens = await RefreshTokenService.performRefreshToken(refreshToken)
            if (tokens) {
                const { accessToken, refreshToken } = tokens
                const newJwtPayload = RefreshTokenService.prepareCookiesPayload(accessToken, refreshToken)

                res.clearCookie(JWT_KEY)
                res.cookie(JWT_KEY, newJwtPayload, { httpOnly: true })
                return res.json({ message: REFRESH_TOKEN_MESSAGE })
            }
            return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
        }
        return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);

    } catch (err) {
        console.error(err)
        return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
    }
}