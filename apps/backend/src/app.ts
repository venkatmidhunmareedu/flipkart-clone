import express from "express";
import cors from "cors";

import userRoutes from "./routes/users.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server Running 🚀"
  });
});

app.use("/api/users", userRoutes);

export default app;