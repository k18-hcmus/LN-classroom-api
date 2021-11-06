import { IUser } from "@schemas/user.schema";

declare module 'express' {
    export interface Request {
        body: {
            user: IUser
        };
    }
}
