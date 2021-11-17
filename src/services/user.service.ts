import { UserModel } from '@models/user.model'
import User from '@schemas/user.schema'
import { EMAIL_EXISTED_ERROR, USERNAME_EXISTED_ERROR } from '@shared/constants'
import bcrypt from 'bcryptjs'

export const getAll = async () => {
    return await User.find().exec()
}

export const createUser = async (user: UserModel) => {
    user.password = bcrypt.hashSync(user.password)
    return await new User(user).save()
}

export const validateNewUser = async (user: UserModel) => {
    const result = { email: "", username: "" }
    const email = await User.findOne({ email: user.email }).exec()
    const username = await User.findOne({ username: user.username }).exec()
    if (email || username) {
        email && (result.email = EMAIL_EXISTED_ERROR)
        username && (result.username = USERNAME_EXISTED_ERROR)
        return result
    }
    return null
}