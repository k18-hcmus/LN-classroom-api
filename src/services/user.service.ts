import User from '@schemas/user.schema'

export const getAll = async () => {
    return await User.find().exec()
}



