import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN || '*',
    credentials : true
}))

app.use(express.json({limit : "50mb"}));
app.use(urlencoded({extended : true, limit : "50mb"}));
app.use(express.static('public'));
app.use(cookieParser());

// Routes import 
import docsRouter from './docs.routes.js';
import userRouter from './routes/user.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import preferenceRouter from './routes/preference.routes.js';

// Routes declaration
app.use("/api/v1/docs", docsRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/preferences", preferenceRouter);

export {app};
