import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./routes/auth.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();
const _dirname = path.resolve();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", router);
// app.use("/api/messages", message);

if (process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(_dirname, "../frontend/dist")));
   app.get("*", (_, res) => {
      res.sendFile(path.join(_dirname, "../frontend/dist/index.html"));
   });
}
app.listen(PORT, () => {
   console.log("Server running at : ", PORT);
   connectDB();
});
