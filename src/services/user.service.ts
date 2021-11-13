import { UserModel } from '@models/user.model'
import User from '@schemas/user.schema'
import bcrypt from 'bcryptjs'

export const getAll = async () => {
    return await User.find().exec()
}

export const createUser = async (user: UserModel) => {
    user.password = bcrypt.hashSync(user.password)
    return await new User(user).save()
}