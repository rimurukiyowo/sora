import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { folderId } = req.query;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!folderId) {
    return res.status(400).json({ error: { message: "Folder ID diperlukan" } });
  }

  try {
    const query = encodeURIComponent(`'${folderId}' in parents`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: { message: error.message || "Gagal mengambil data" } });
  }
}
