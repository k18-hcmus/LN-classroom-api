import { UserModel } from '@models/user.model'
import User from '@schemas/user.schema'
import { EMAIL_EXISTED_ERROR, USERNAME_EXISTED_ERROR } from '@shared/constants'
import bcrypt from 'bcryptjs'

export const getAll = async () => {
    return await User.find().exec()
}

export const getUserById = async (id: string) => {
    return await User.findById(id).exec()
}

export const encryptPassword = (password: string) => {
    return bcrypt.hashSync(password)
}

export const createUser = async (user: UserModel) => {
    user.password = encryptPassword(user.password)
    return await new User(user).save()
}

export const updateUser = async (userId: string, opts: any) => {
    return await User.findByIdAndUpdate(userId, opts, {
        new: true
    }).exec()
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

export const isStudentIdInvalid = async (userId: string, studentId: string) => {
    const result = await User.findOne({ studentId: studentId }).exec()
    if (result) {
        return result._id.toString() === userId
    }
    return null
}

export const comparePassword = (user: UserModel, password: string) => {
    return bcrypt.compareSync(password, user.password)
}