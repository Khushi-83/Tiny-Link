import { query } from "../../../lib/db";
import { isValidCode } from "../../../lib/validate";

export default async function handler(req, res) {
  const { code } = req.query;

  // Validate short code
  if (!isValidCode(code)) {
    return res.status(400).json({ error: "Invalid code format" });
  }

  // GET → return stats for one code
  if (req.method === "GET") {
    const data = await query(
      "SELECT code, target, total_clicks, last_clicked, created_at FROM links WHERE code = $1",
      [code]
    );

    if (data.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json(data.rows[0]);
  }

  // DELETE → delete link
  if (req.method === "DELETE") {
    const result = await query(
      "DELETE FROM links WHERE code = $1 RETURNING *",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json({ ok: true });
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
