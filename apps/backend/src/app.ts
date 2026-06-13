import express from "express";
import cors from "cors";

import { getCorsOptions } from "./lib/cors";
import addressRoutes from "./routes/addresses.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import categoriesRoutes from "./routes/categories.routes";
import healthRoutes from "./routes/health.routes";
import orderRoutes from "./routes/orders.routes";
import productRoutes from "./routes/products.routes";
import userRoutes from "./routes/users.routes";
import wishlistRoutes from "./routes/wishlist.routes";

const app = express();

app.use(cors(getCorsOptions()));
app.options(/.*/, cors(getCorsOptions()));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server Running 🚀"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);

export default app;