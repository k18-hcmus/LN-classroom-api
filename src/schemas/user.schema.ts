import mongoose, { Schema } from "mongoose";
import { UserModel } from "@models/user.model";
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import bcrypt from 'bcryptjs'

const passwordValidation = (password: string) => {
    return isLength(password, { min: 6 })
}

const usernameValidation = (username: string) => {
    return isLength(username, { min: 6 })
}

interface UserDocument extends UserModel {
    comparePassword: (password: string) => boolean
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, index: { unique: true }, validate: [isEmail, 'Invalid email!'] },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true, index: { unique: true }, validate: [usernameValidation, 'Username must have at least 6 characters!'] },
        password: { type: String, required: true, validate: [passwordValidation, 'Password must have at least 6 characters!'] },
        isActive: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
)

UserSchema.methods.comparePassword = function (this: UserModel, password: string) {
    return bcrypt.compareSync(password, this.password)
};

export default mongoose.model<UserDocument>('users', UserSchema)