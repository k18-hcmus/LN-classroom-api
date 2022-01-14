import { UNEXPECTED_ERROR, USER_ROLE } from "@shared/constants";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body.user;
    if (user.role !== USER_ROLE.ADMIN) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: UNEXPECTED_ERROR });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.FORBIDDEN).send(UNEXPECTED_ERROR);
  }
};

export default checkAdmin;
