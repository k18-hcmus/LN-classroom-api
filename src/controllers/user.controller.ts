import * as userService from "@services/user.service";
import { Request, Response } from "express";
import { UserModel } from "@models/user.model";
import { StatusCodes } from "http-status-codes";


export const createUser = async (req: Request, res: Response) => {
    const user = req.body as unknown as UserModel
    const validationResult = await userService.validateNewUser(user)
    if (validationResult) {
        return res.status(StatusCodes.BAD_REQUEST).json(validationResult)
    }
    const result = await userService.createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password
    } as UserModel)
    res.json({ _id: result._id })
}