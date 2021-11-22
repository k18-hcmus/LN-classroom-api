import mongoose from 'mongoose';
import logger from './Logger';

export const pErr = (err: Error) => {
    if (err) {
        logger.err(err);
    }
};

export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export const stringToBoolean = (value: string) => {
    return (value === 'true')
}

export const stringToObjectId = (value: string) => {
    return new mongoose.Types.ObjectId(value)
}
