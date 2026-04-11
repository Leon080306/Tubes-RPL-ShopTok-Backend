import "reflect-metadata"
import express from "express";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "./models/appConfig";

import cartRoutes from "./routes/cart.routes"
import wishlistRoutes from "./routes/wishlist.routes"
import voucherRoutes from "./routes/voucher.routes"

import { Addresses } from "./models/Addresses"
import { CartItems } from "./models/CartItems"
import { Categories } from "./models/Categories"
import { Chats } from "./models/Chats"
import { Likes } from "./models/Likes"
import { Notifications } from "./models/Notifications"
import { OrderItems } from "./models/OrderItems"
import { Orders } from "./models/Orders"
import { Products } from "./models/Products"
import { ProductVariants } from "./models/ProductVariants"
import { Ratings } from "./models/Ratings"
import { Shops } from "./models/Shops"
import { Users } from "./models/Users"
import { Vouchers } from "./models/Vouchers"
import { VouchersUsed } from "./models/VouchersUsed"
import { Wishlists } from "./models/Wishlists"

const sequelize = new Sequelize({
    username: appConfig.username,
    password: appConfig.password as string,
    database: appConfig.database,
    host: appConfig.host,
    port: Number(appConfig.dbPort),
    dialect: appConfig.dialect,
    models: [Addresses, CartItems, Categories, Chats, Likes, Notifications, OrderItems, Orders, Products, ProductVariants, Ratings, Shops, Users, Vouchers, VouchersUsed, Wishlists]
});

const app = express();

app.use(express.json());


app.use("/cart", cartRoutes)
app.use("/wishlist", wishlistRoutes)
app.use("/voucher",voucherRoutes)


app.get("/", async (req, res) => {
    res.send("Hello World!");
});

// app.listen(appConfig.port, () => {
// });

// START SERVER

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB CONNECT");

    const PORT = appConfig.port;

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("DB GA CONNECT:", error);
  }
}

start();