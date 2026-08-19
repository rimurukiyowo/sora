"use client";
import React, { useState } from "react";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

type FileItem = {
  id: string;
  name: string;
  link: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [folderInput, setFolderInput] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const animeParticles = ["🌸", "✨", "☁️", "🕊️", "🌷", "💫", "🫧", "🌸"];

  const extractFolderId = (input: string) => {
    const match = input.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };

  const fetchFiles = async () => {
    const folderId = extractFolderId(folderInput);
    if (!folderId) {
      setError("Masukkan link folder Drive yang valid ya!");
      setFiles([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/drive?folderId=${folderId}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data?.error?.message || "Gagal memetik data dari awan.");
        setFiles([]);
        return;
      }

      const fetchedFiles: FileItem[] = (data.files || [])
        .map((f: any) => ({
          id: f.id,
          name: f.name,
          link: `https://drive.google.com/file/d/${f.id}/view?usp=sharing`,
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        );

      setFiles(fetchedFiles);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    alert(msg);
  };

  if (status === "loading") {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loadingPulse}>✨</div>
       <p style={{ color: "#475569", marginTop: 14, fontWeight: 600 }}>
  Menyiapkan ruang kerja Sora... 🌸
</p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Head>
  <title>SORA WINTER 🌸</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  {/* 🔗 Tambahkan 2 baris ini: */}
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#fbc2eb" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />
</Head>

        <style>{styles.globalCss}</style>

        <div style={styles.wrapper}>
          <div style={styles.cloudsBg} />

          <div style={styles.floatingWrap}>
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                style={{
                  ...styles.particle,
                  left: `${(i * 100) / 18 + Math.random() * 4}%`,
                  animationDuration: `${8 + (i % 6) * 2.5}s`,
                  animationDelay: `${(i % 5) * 1.2}s`,
                  fontSize: `${14 + (i % 4) * 6}px`,
                }}
              >
                {animeParticles[i % animeParticles.length]}
              </span>
            ))}
          </div>

          <div style={styles.topBarPill}>
            <div style={styles.topBarHandle}>
              <span style={styles.handleDot}>●</span>
              @sora-winter
            </div>
            <div style={styles.topBarStatus}>
              © 2026 Verified{" "}
              <span style={{ filter: "drop-shadow(0 0 4px #ec4899)" }}>✨</span>
            </div>
          </div>

          <div style={styles.loginCard}>
            <div style={styles.badgeKapsul}>
              <span>🌸 Restricted Access</span>
            </div>

            <div style={styles.loginHeader}>
              <h1 style={styles.loginTitle}>SORA WINTER</h1>
              <p style={styles.loginSubtitle}>Exclusive</p>
            </div>

            <div style={styles.loginNoticeBox}>
              <p style={styles.loginNoticeText}>
                Gerbang ini hanya dapat dibuka oleh akun Google yang telah
                terdaftar di daftar whitelist.
              </p>
            </div>

            <button
              style={styles.btnGoogleModern}
              onClick={() => signIn("google")}
            >
              <div style={styles.googleIconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <span style={styles.googleBtnText}>Lanjutkan dengan Google</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>SORA WINTER 🌸</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{styles.globalCss}</style>

      <div style={styles.wrapper}>
        <div style={styles.cloudsBg} />

        <div style={styles.floatingWrap}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              style={{
                ...styles.particle,
                left: `${(i * 100) / 18 + Math.random() * 4}%`,
                animationDuration: `${8 + (i % 6) * 2.5}s`,
                animationDelay: `${(i % 5) * 1.2}s`,
                fontSize: `${14 + (i % 4) * 6}px`,
              }}
            >
              {animeParticles[i % animeParticles.length]}
            </span>
          ))}
        </div>

        <div style={styles.topBarPill}>
          <div style={styles.topBarHandle}>
            <span style={styles.handleDot}>●</span>
            @sora-winter
          </div>
          <div style={styles.topBarStatus}>
            © 2026 Verified{" "}
            <span style={{ filter: "drop-shadow(0 0 4px #ec4899)" }}>✨</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.userBar}>
            <div style={styles.userInfo}>
              <span style={styles.avatar}>🌸</span>
              <span style={styles.userEmail}>{session.user?.email}</span>
            </div>
            <button onClick={() => signOut()} style={styles.btnLogout}>
              Logout 🍃
            </button>
          </div>

          <div style={styles.header}>
            <h1 style={styles.title}>SORA WINTER</h1>
          </div>

          <div style={styles.noticeBox}>
            <div style={styles.noticeTitle}>🌸 Aturan Rumah Sora</div>
            <ul style={styles.noticeList}>
              <li>Tautan khusus untuk penggunaan pribadi.</li>
              <li>Dilarang menyebarkan akses ke siapapun.</li>
              <li>Pelanggaran akan menutup akses gerbang permanen.</li>
            </ul>
          </div>

          <div style={styles.inputWrap}>
            <input
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="Tempel link Google Drive di sini..."
              style={styles.input}
            />
            <button
              onClick={fetchFiles}
              disabled={loading}
              style={styles.btnPrimary}
            >
              {loading ? "Memetik..." : "Petik ✨"}
            </button>
          </div>

          {error && <div style={styles.errorBanner}>{error}</div>}

          {files.length > 0 && (
            <div style={styles.resultContainer}>
              <div style={styles.actionRow}>
                <button
                  style={styles.btnAction}
                  onClick={() =>
                    copy(
                      files.map((f) => f.name).join("\n"),
                      "🌸 Nama file disalin!"
                    )
                  }
                >
                  Salin Nama
                </button>
                <button
                  style={styles.btnAction}
                  onClick={() =>
                    copy(
                      files.map((f) => f.link).join("\n"),
                      "✨ Tautan disalin!"
                    )
                  }
                >
                  Salin Link
                </button>
                <button
                  style={styles.btnActionHighlight}
                  onClick={() =>
                    copy(
                      files.map((f) => `${f.name}\t${f.link}`).join("\n"),
                      "💖 Semua data disalin!"
                    )
                  }
                >
                  Salin Semua
                </button>
              </div>

              <div style={styles.countBadge}>
                Terkumpul: <strong>{files.length} Bunga File 🌷</strong>
              </div>

              <div style={styles.listWrap}>
                {files.map((f, i) => (
                  <div key={f.id} style={styles.listItem}>
                    <div style={styles.itemLeft}>
                      <span style={styles.itemIndex}>#{i + 1}</span>
                      <span style={styles.itemName} title={f.name}>
                        {f.name}
                      </span>
                    </div>
                    <a
                      href={f.link}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.itemLink}
                    >
                      Buka ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles: Record<string, any> = {
  globalCss: `
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      font-family: 'Quicksand', sans-serif; 
      background: #fbc2eb;
      overflow-x: hidden;
    }
    @keyframes dreamyFloat {
      0% { transform: translateY(-30px) rotate(0deg); opacity: 0; }
      20% { opacity: 0.85; }
      80% { opacity: 0.85; }
      100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
    }
    @keyframes auroraSky {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: rgba(244, 114, 182, 0.4); border-radius: 20px; }
  `,
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 30%, #ffd1ff 70%, #fad0c4 100%)",
    backgroundSize: "250% 250%",
    animation: "auroraSky 16s ease infinite",
    padding: "20px 14px",
    position: "relative",
    overflow: "hidden",
  },
  cloudsBg: {
    position: "absolute",
    width: "120%",
    height: "120%",
    background:
      "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.7) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  floatingWrap: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
    top: "-30px",
    animationName: "dreamyFloat",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  topBarPill: {
    width: "100%",
    maxWidth: "430px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 14px",
    marginBottom: "10px",
    borderRadius: "99px",
    background: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(16px)",
    border: "1.5px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 4px 15px rgba(236, 72, 153, 0.08)",
    zIndex: 2,
  },
  topBarHandle: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "99px",
    background:
      "linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))",
    border: "1px solid rgba(236, 72, 153, 0.35)",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#be185d",
    letterSpacing: "0.3px",
  },
  handleDot: {
    fontSize: "0.55rem",
    color: "#ec4899",
  },
  topBarStatus: {
    fontSize: "0.74rem",
    fontWeight: 700,
    color: "#6b21a8",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    letterSpacing: "0.2px",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    maxHeight: "90vh",
    borderRadius: "32px",
    padding: "22px 20px",
    background: "rgba(255, 255, 255, 0.68)",
    backdropFilter: "blur(20px) saturate(160%)",
    border: "2px solid rgba(255, 255, 255, 0.9)",
    boxShadow:
      "0 18px 45px rgba(236, 72, 153, 0.15), 0 4px 15px rgba(161, 196, 253, 0.25)",
    color: "#334155",
    display: "flex",
    flexDirection: "column",
    zIndex: 2,
  },
  loginCard: {
    width: "100%",
    maxWidth: "430px",
    borderRadius: "30px",
    padding: "32px 26px 28px 26px",
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(24px) saturate(180%)",
    border: "2px solid rgba(255, 255, 255, 0.95)",
    boxShadow:
      "0 20px 45px rgba(236, 72, 153, 0.12), 0 6px 20px rgba(139, 92, 246, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    zIndex: 2,
  },
  badgeKapsul: {
    padding: "5px 14px",
    borderRadius: "99px",
    background: "rgba(236, 72, 153, 0.1)",
    border: "1px solid rgba(236, 72, 153, 0.25)",
    color: "#db2777",
    fontSize: "0.75rem",
    fontWeight: 700,
    marginBottom: "16px",
    letterSpacing: "0.3px",
  },
  loginHeader: {
    marginBottom: "16px",
  },
  loginTitle: {
    fontSize: "1.75rem",
    fontWeight: 800,
    margin: "0 0 4px 0",
    letterSpacing: "0.5px",
    background: "linear-gradient(135deg, #ec4899 20%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  loginSubtitle: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#7c3aed",
    margin: 0,
    letterSpacing: "0.4px",
  },
  loginNoticeBox: {
    background: "rgba(255, 255, 255, 0.6)",
    border: "1px solid rgba(244, 114, 182, 0.3)",
    borderRadius: "16px",
    padding: "12px 16px",
    marginBottom: "24px",
    width: "100%",
  },
  loginNoticeText: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#64748b",
    lineHeight: "1.5",
    fontWeight: 600,
  },
  btnGoogleModern: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "12px 20px",
    borderRadius: "18px",
    border: "1.5px solid rgba(255, 255, 255, 0.9)",
    background: "#ffffff",
    boxShadow:
      "0 8px 22px rgba(139, 92, 246, 0.15), 0 2px 6px rgba(0,0,0,0.04)",
    cursor: "pointer",
  },
  googleIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnText: {
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "#334155",
    letterSpacing: "0.2px",
  },
  userBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
    borderBottom: "1px dashed rgba(244, 114, 182, 0.4)",
    marginBottom: "12px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  avatar: {
    fontSize: "1rem",
  },
  userEmail: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#64748b",
  },
  btnLogout: {
    background: "rgba(255, 255, 255, 0.8)",
    border: "1px solid rgba(244, 114, 182, 0.5)",
    borderRadius: "20px",
    color: "#db2777",
    padding: "4px 12px",
    fontSize: "0.75rem",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 2px 6px rgba(244, 114, 182, 0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "12px",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    margin: "0",
    letterSpacing: "1px",
    background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  noticeBox: {
    background: "rgba(255, 241, 242, 0.8)",
    border: "1px solid rgba(254, 205, 211, 0.9)",
    borderRadius: "18px",
    padding: "10px 14px",
    marginBottom: "14px",
  },
  noticeTitle: {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#e11d48",
    marginBottom: "4px",
  },
  noticeList: {
    margin: 0,
    paddingLeft: "14px",
    fontSize: "0.73rem",
    color: "#4b5563",
    lineHeight: "1.5",
    fontWeight: 600,
  },
  inputWrap: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },
  input: {
    flex: 1,
    padding: "11px 14px",
    borderRadius: "18px",
    border: "2px solid rgba(192, 132, 252, 0.4)",
    background: "rgba(255, 255, 255, 0.95)",
    color: "#334155",
    fontSize: "0.85rem",
    fontWeight: 600,
    outline: "none",
  },
  btnPrimary: {
    padding: "0 18px",
    borderRadius: "18px",
    border: "none",
    background: "linear-gradient(135deg, #f472b6, #c084fc)",
    color: "#ffffff",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(236, 72, 153, 0.35)",
  },
  errorBanner: {
    background: "rgba(255, 228, 230, 0.9)",
    border: "1px solid #fda4af",
    color: "#e11d48",
    padding: "8px 12px",
    borderRadius: "14px",
    fontSize: "0.75rem",
    fontWeight: 600,
    marginBottom: "10px",
    textAlign: "center",
  },
  resultContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  },
  actionRow: {
    display: "flex",
    gap: "6px",
    marginBottom: "6px",
  },
  btnAction: {
    flex: 1,
    padding: "8px 0",
    borderRadius: "14px",
    border: "1px solid rgba(192, 132, 252, 0.4)",
    background: "rgba(255, 255, 255, 0.8)",
    color: "#7c3aed",
    fontSize: "0.75rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnActionHighlight: {
    flex: 1,
    padding: "8px 0",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #f472b6, #ec4899)",
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(236, 72, 153, 0.25)",
  },
  countBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#db2777",
    margin: "4px 0 6px 0",
    textAlign: "center",
  },
  listWrap: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    paddingRight: "2px",
    maxHeight: "200px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.75)",
    border: "1px solid rgba(255, 255, 255, 0.9)",
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    overflow: "hidden",
  },
  itemIndex: {
    fontSize: "0.72rem",
    color: "#ec4899",
    fontWeight: 800,
  },
  itemName: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#334155",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "240px",
  },
  itemLink: {
    fontSize: "0.75rem",
    color: "#7c3aed",
    textDecoration: "none",
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: "8px",
    background: "rgba(192, 132, 252, 0.15)",
  },
  loadingPulse: {
    fontSize: "2.5rem",
    animation: "dreamyFloat 2s ease infinite",
  },
};
