import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { authRouter } from "./routes/auth-router";
import { errorHandler } from "./middlware/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    secure: true,
    signed: true
}))
app.use("/api/users/", authRouter);

app.all("*", () => {
  new NotFoundError();
});

app.use(errorHandler);


export default app;
