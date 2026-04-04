import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "Leon080306",
    database: process.env.DB_NAME || "belajarorm",
    host: process.env.DB_HOST || "localhost",
    dbPort: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres" as const,
    port: process.env.PORT
};