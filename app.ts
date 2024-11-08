import { SERVER_PORT } from "./config";
import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";

import passport from "passport";
import middlewarePassport from "./service/passport";

import apiRoutes from "./routes/api.routes";
const app = express();

// Settings
app.set("port", SERVER_PORT);

// Middlewares
app.use(cors());

app.use(express.json());
app.use(express.static("./client/build"));
app.use(express.urlencoded({ extended: false }));

// Passport
app.use(passport.initialize());
passport.use(middlewarePassport);

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", apiRoutes);

app.get("*", (req, res) => {
  fs.readFile(
    "./client/build/index.html",
    { encoding: "utf-8" },
    (err, data) => {
      if (!data) res.send("Server is running on Port 8000");
      else res.send(data);
    }
  );
});

export default app;
