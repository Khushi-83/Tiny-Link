import { query } from "../../../lib/db";
import { isValidUrl, isValidCode } from "../../../lib/validate";

export default async function handler(req, res) {
  // GET → return all links
  if (req.method === "GET") {
    const data = await query(
      "SELECT code, target, total_clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
    );
    return res.status(200).json(data.rows);
  }

  // POST → create new link
  if (req.method === "POST") {
    const { target, code } = req.body;

    // Validate target URL
    if (!isValidUrl(target)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Case 1: User provides custom code
    if (code) {
      if (!isValidCode(code)) {
        return res
          .status(400)
          .json({ error: "Code must be 6-8 alphanumeric characters" });
      }

      try {
        await query("INSERT INTO links (code, target) VALUES ($1, $2)", [
          code,
          target,
        ]);
        return res.status(201).json({ code, target });
      } catch (err) {
        // Duplicate code error
        if (err.code === "23505") {
          return res.status(409).json({ error: "Code already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
    }

    // Case 2: No custom code → auto-generate 6-char code
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const generateCode = () =>
      Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    for (let i = 0; i < 5; i++) {
      const autoCode = generateCode();

      try {
        await query("INSERT INTO links (code, target) VALUES ($1, $2)", [
          autoCode,
          target,
        ]);

        return res.status(201).json({ code: autoCode, target });
      } catch (err) {
        if (err.code === "23505") {
          // Collision, try again
          continue;
        }
        return res.status(500).json({ error: "Database error" });
      }
    }

    return res.status(500).json({ error: "Unable to generate unique code" });
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
