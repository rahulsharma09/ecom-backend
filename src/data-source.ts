import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

console.log("DIRNAME:", __dirname);
console.log("Entity Paths:", path.join(__dirname, "/entities/*.{ts,js}"));

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.NEON_DB_URL, // Put full connection string here
  synchronize: true, // Auto-create tables in dev
  logging: false,
  entities: [User, path.join(__dirname, "/entities/*.{ts,js}")],
});
