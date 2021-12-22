import { UserModel } from "@models/user.model";
import User from "@schemas/user.schema";
import * as userService from "@services/user.service";
import { UNAUTHORIZE_MESSAGE } from "@shared/constants";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import { OAuth2Client } from "google-auth-library";

const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = get(req.body, "token");
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
    }

    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket.getPayload()) {
      return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
    }
    const { given_name, family_name, email } = ticket.getPayload()!;

    let user = await User.findOne({ email, provider: "google" }).exec();
    if (!user) {
      user = await userService.createUser({
        firstName: given_name || " ",
        lastName: family_name || " ",
        username: email,
        email: email,
        password: token,
        provider: "google",
      } as UserModel);
    }
    req.body.user = user;
    return next();
  } catch (err: any) {
    console.error(err);
    return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
  }
};

export default googleAuth;
