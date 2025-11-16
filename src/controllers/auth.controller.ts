import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

// User signup
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    // Check if user exists
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = userRepo.create({ email, password: hashedPassword });
    await userRepo.save(newUser);
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    // Check if user email exists
    const userRepo = AppDataSource.getRepository(User);
    const checkUser = await userRepo.findOne({ where: { email } });
    console.log(checkUser);
    if (!checkUser) {
      return res.status(401).json({ message: "User does not exists" });
    }
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Return user email and auth token
    const token = jwt.sign({ id: checkUser.id }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });
    return res
      .status(200)
      .json({
        message: "Login Success",
        user: checkUser.email,
        access_token: token,
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
