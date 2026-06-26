import {
  loginPostRequestSchema,
  registerPostRequestSchema,
} from "../validators/request.validator.js";
import bcrypt from "bcryptjs";
import db from "../db/index.js";
import { usersTable } from "../models/auth.model.js";
import { eq } from "drizzle-orm";
import { generateAndSetCookie } from "../utils/generateAndSetCookie.js";

export const registerUser = async (req, res) => {
  try {
    const validationResult = await registerPostRequestSchema.safeParseAsync(
      req.body,
    );
    if (validationResult.error) {
      return res
        .status(400)
        .json({ success: false, message: validationResult.error.format() });
    }

    const { firstname, lastname, email, password } = validationResult.data;

    // check email
    const [existingUser] = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(usersTable)
      .values({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
      });

    // Authenticate user and generate token
    generateAndSetCookie(res, newUser.id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const validationResult = await loginPostRequestSchema.safeParseAsync(
      req.body,
    );
    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.format(),
      });
    }

    const { email, password } = validationResult.data;

    // check email
    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Authenticate user and generate token

    generateAndSetCookie(res, user.id);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Current user fetched successfully and logged in as ${user.firstname} ${user.lastname}`,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
