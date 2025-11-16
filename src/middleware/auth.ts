import jwt from "jsonwebtoken";
import { Response } from "express";
import { AppDataSource } from "../data-source";

export async function userAuth(req: any, res: Response, next: Function) {
  try {
    let access_token = req.headers["authorization"];
    const userRepo = AppDataSource.getRepository("User");
    access_token = access_token.split("Bearer")[1].trim();
    if (!access_token) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }
    const decodedToken = await jwt.verify(access_token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).send("Unauthorized");
    }
    const userId = decodedToken.id;
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
}
