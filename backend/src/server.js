import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRouter from "./routes/auth.route.js";
import urlRouter from "./routes/url.route.js";
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
