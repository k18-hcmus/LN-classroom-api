import User from '@schemas/user.schema'
import { parseToken } from '@services/refresh-token.service'
import { JWT_KEY, JWT_SECRET, UNAUTHORIZE_MESSAGE } from '@shared/constants'
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { get } from 'lodash'

const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.cookies && req.cookies[JWT_KEY]) {
            const jwtPayload = req.cookies[JWT_KEY]
            const { accessToken } = parseToken(jwtPayload)

            const secretOrKey = process.env.JWT_SECRET_KEY || JWT_SECRET
            const decodeData = jwt.verify(accessToken, secretOrKey)
            const id = get(decodeData, "id")

            const user = await User.findById(id).exec()
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
            }
            req.body.user = user

            return next()
        }
        return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);

    } catch (err) {
        console.error(err)
        return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
    }
}


export default authenticateJWT;