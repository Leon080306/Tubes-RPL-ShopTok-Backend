import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "tubes_rpl",
    host: process.env.DB_HOST || "localhost",
    dbPort: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres" as const,
    port: process.env.PORT || 5005 as number
};