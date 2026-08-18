import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

async function getWhitelistedEmails(): Promise<string[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!sheetId || !apiKey) return [];

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A2:A?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values) return [];
    return data.values
      .map((row: string[]) => row[0]?.trim().toLowerCase())
      .filter(Boolean);
  } catch (error) {
    console.error("Gagal membaca Google Sheets:", error);
    return [];
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 365 Hari
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      const allowedEmails = await getWhitelistedEmails();

      if (email === "roracandyss@gmail.com" || allowedEmails.includes(email)) {
        return true;
      }

      return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
