import { RefreshTokenModel } from "@models/refresh-token.model";
import RefreshToken from "@schemas/refresh-token.schema";
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRE_TIME,
  JWT_SECRET,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "@shared/constants";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import { v4 as uuidv4 } from "uuid";

const secretOrKey = process.env.JWT_SECRET_KEY || JWT_SECRET;
interface CookiePayload {
  [ACCESS_TOKEN]: string;
  [REFRESH_TOKEN]?: string;
}

export const performRefreshToken = async (
  refreshToken: string | undefined
): Promise<CookiePayload | null> => {
  const storedToken = await verifyRefreshToken(refreshToken);
  if (storedToken) {
    await RefreshToken.deleteOne({ _id: storedToken._id });

    const refreshToken = await createNewRefreshToken(
      storedToken.userId.toString()
    );
    const accessToken = await createNewAccessToken(
      storedToken.userId.toString()
    );

    return {
      [ACCESS_TOKEN]: accessToken,
      [REFRESH_TOKEN]: refreshToken,
    };
  }

  return null;
};

export const verifyRefreshToken = async (refreshToken: string | undefined) => {
  if (refreshToken) {
    const { userId, token } = jwt.verify(
      refreshToken,
      secretOrKey
    ) as RefreshTokenModel;
    const result = await RefreshToken.findOne({ token, userId }).exec();
    if (result) {
      return result;
    }
    return null;
  }
  return null;
};

export const createNewRefreshToken = async (userId: string) => {
  const token = uuidv4();
  const payload = { token, userId };
  const refreshToken = jwt.sign(payload, secretOrKey, {
    expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
  });
  await new RefreshToken(payload).save();

  return refreshToken;
};

export const createNewAccessToken = (userId: string) => {
  const payload = { id: userId };
  const accessToken = jwt.sign(payload, secretOrKey, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
  return accessToken;
};

export const parseToken = (jwtPayload: string): CookiePayload => {
  const accessToken = get(JSON.parse(jwtPayload), ACCESS_TOKEN);
  const refreshToken = get(JSON.parse(jwtPayload), REFRESH_TOKEN);
  const result = { [ACCESS_TOKEN]: accessToken } as CookiePayload;
  if (refreshToken) {
    result[REFRESH_TOKEN] = refreshToken;
  }

  return result;
};

export const prepareCookiesPayload = (
  accessToken: string,
  refreshToken: string | null | undefined
) => {
  const result = { [ACCESS_TOKEN]: accessToken } as CookiePayload;
  if (refreshToken) {
    result[REFRESH_TOKEN] = refreshToken;
  }

  return JSON.stringify(result);
};
