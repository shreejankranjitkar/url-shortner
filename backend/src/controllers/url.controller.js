import { urlsTable } from "../models/url.model.js";
import db from "../db/index.js";
import { createUrlPostRequestSchema } from "../validators/request.validator.js";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";

import { usersTable } from "../models/auth.model.js";

export const createShortUrl = async (req, res) => {
  try {
    // validating
    const validationResult = await createUrlPostRequestSchema.safeParseAsync(
      req.body,
    );

    if (validationResult.error) {
      return res
        .status(400)
        .json({ success: false, message: validationResult.error.format() });
    }

    const { url, code } = validationResult.data;

    // creating shorturl and saving to db

    const shortUrlCode = code ?? nanoid(10);

    const [result] = await db
      .insert(urlsTable)
      .values({
        shortCode: shortUrlCode,
        targetUrl: url,
        userId: req.userId,
      })
      .returning({
        id: urlsTable.id,
        shortCode: urlsTable.shortCode,
        targetUrl: urlsTable.targetUrl,
      });

    return res.status(201).json({
      success: true,
      message: "Short code created.",
      result,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Redirecting to the target url
export const redirectingToUrl = async (req, res) => {
  const { shortCode } = req.params;
  try {
    // checking the shortCode in db
    const [urlEntry] = await db
      .select({ targetUrl: urlsTable.targetUrl })
      .from(urlsTable)
      .where(eq(urlsTable.shortCode, shortCode));

    if (!urlEntry) {
      return res
        .status(404)
        .json({ success: false, message: "URL not found!" });
    }

    return res.redirect(urlEntry.targetUrl);
  } catch (error) {
    console.error("Error in redirectingToUrl:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get all shortCode
export const getAllShortCodes = async (req, res) => {
  try {
    const [user] = await db
      .select({
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
      })
      .from(usersTable)
      .where(eq(usersTable.id, req.userId));

    const allUrls = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.userId, req.userId));

    return res.status(200).json({
      success: true,
      message: `All URL of ${user.firstname} ${user.lastname}`,
      allUrls,
    });
  } catch (error) {
    console.error("Error in getAllShortCodes:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Deleting shortcode
export const deleteShortCode = async (req, res) => {
  try {
    const id = req.params.id;

    await db
      .delete(urlsTable)
      .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.userId)));

    return res
      .status(200)
      .json({ success: true, message: "Deleted successfully." });
  } catch (error) {
    console.error("Error in deleteShortCode:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
