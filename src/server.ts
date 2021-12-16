import logger from '@shared/Logger';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import rootRouter from './routes';



const app = express();
const { BAD_REQUEST } = StatusCodes;



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

// Connect to mongoose
mongoose.connect(process.env.MONGO_DB_URI as string).then(() => console.log("Database connected")).catch((err) => console.log('Connection failed:\n', err))
app.set('trust proxy', 1)
app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin)
    },
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
app.use(morgan('dev'));

app.use(helmet());
app.use(passport.initialize());

// Add APIs
app.use('/api', rootRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Export express instance
export default app;
