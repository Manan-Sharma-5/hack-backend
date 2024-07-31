import express from "express";
import authroute from "./routes/authRoute";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authroute);

export default app;
