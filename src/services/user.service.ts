import { UserModel } from '@models/user.model'
import User from '@schemas/user.schema'
import mongoose from 'mongoose'

export const getAll = async () => {
    return await User.find().exec()
}

export const createUser = async (user: UserModel) => {
    return await new User(user).save()
}