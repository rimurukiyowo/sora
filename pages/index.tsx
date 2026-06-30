"use client";
import React, { useState } from "react";
import Head from "next/head";

type FileItem = {
  id: string;
  name: string;
  link: string;
};

export default function Home() {
  const [folderInput, setFolderInput] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "AIzaSyD71nWVbtMxWK4T05Ty4qMuIRTP4ij2i48"; // isi API KEY lo

  const extractFolderId = (input: string) => {
    const match = input.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };

  const fetchFiles = async () => {
    const folderId = extractFolderId(folderInput);

    if (!folderId) {
      setError("Masukkan link Google Drive");
      setFiles([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const query = encodeURIComponent(`'${folderId}' in parents`);
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data?.error?.message || "Gagal mengambil data.");
        setFiles([]);
        return;
      }

      const fetchedFiles: FileItem[] = (data.files || [])
        .map((f: any) => ({
          id: f.id,
          name: f.name,
          link: `https://drive.google.com/file/d/${f.id}/view?utm_source=sorasora&utm_medium=web_usp=drivesdk`,
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        );

      setFiles(fetchedFiles);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    alert(msg);
  };

  const copyNames = () => {
    if (!files.length) return alert("Tidak ada data!");
    copy(files.map((f) => f.name).join("\n"), "Nama disalin!");
  };

  const copyLinks = () => {
    if (!files.length) return alert("Tidak ada data!");
    copy(files.map((f) => f.link).join("\n"), "Link disalin!");
  };

  const copyAll = () => {
    if (!files.length) return alert("Tidak ada data!");
    copy(files.map((f) => `${f.name} ${f.link}`).join("\n"), "Semua disalin!");
  };

  const particles = Array.from({ length: 25 });
  const icons = ["💐", "🌸", "🍒", "🍃", "🍅", "💞", "☘️","🪷"];

  return (
    <>
      {/* FIX HEAD NEXT.JS */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SORA WINTER</title>
      </Head>

      <style>{`
        body { margin: 0; }

        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        input { font-size: 16px; }
      `}</style>

      <div style={styles.wrapper}>
        <div style={styles.particleWrap}>
          {particles.map((_, i) => (
            <span
              key={i}
              style={{
                ...styles.particle,
                left: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 10}s`,
                fontSize: `${14 + Math.random() * 12}px`,
              }}
            >
              {icons[i % icons.length]}
            </span>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
  <h1 style={styles.title}>SORA WINTER</h1>
  <p style={styles.subtitle}>💞💞</p>

  <div
    style={{
      marginTop: "12px",
      padding: "10px 14px",
      borderRadius: "10px",
      background: "rgba(255,255,255,0.15)",
      fontSize: "0.85rem",
      lineHeight: "1.6",
      textAlign: "left",
    }}
  >
    <strong>📢 Syarat Penggunaan</strong>
    <br />
    • Link ini hanya untuk penggunaan pribadi.
    <br />
    • Dilarang membagikan link kepada siapa pun.
    <br />
    • Dilarang membantu orang lain mengakses atau mengisi Drive tanpa izin.
    <br />
    • Jika syarat dilanggar, link akan dihapus sehingga semua pengguna kehilangan akses.
  </div>
</div>

          <div style={styles.inputWrap}>
            <input
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="Paste link / ID folder..."
              style={styles.input}
            />
            <button onClick={fetchFiles} style={styles.btnMain}>
              {loading ? "..." : "Ambil"}
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {files.length > 0 && (
            <>
              <div style={styles.actions}>
                <button style={styles.btn} onClick={copyNames}>Nama</button>
                <button style={styles.btn} onClick={copyAll}>Semua</button>
                <button style={styles.btn} onClick={copyLinks}>Link</button>
              </div>

              <p style={styles.total}>Total: {files.length}</p>

              <div style={styles.listWrap}>
                {files.map((f, i) => (
                  <div key={f.id} style={styles.listItem}>
                    <span style={styles.index}>#{i + 1}</span>
                    <span style={styles.name}>{f.name}</span>
                    <a href={f.link} target="_blank" rel="noreferrer" style={styles.link}>
                      Buka File
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const styles: any = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #ff8c42, #ff6b35, #ffb347, #ff7e5f)",
    backgroundSize: "300% 300%",
    animation: "gradientMove 12s ease infinite",
    fontFamily: "sans-serif",
    padding: "12px",
  },

  particleWrap: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },

  particle: {
    position: "absolute",
    top: "-20px",
    animation: "fall linear infinite",
    opacity: 0.8,
  },

card: {
  width: "100%",
  maxWidth: "420px",
  maxHeight: "95vh",
  borderRadius: "20px",
  padding: "16px",
  background: "rgba(255, 140, 66, 0.18)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#000", // <-- ubah dari #fff menjadi #000
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 10px 30px rgba(255,120,60,0.3)",
},
  header: {
    textAlign: "center",
    marginBottom: "15px",
  },

  title: {
    fontSize: "1.4rem",
    fontWeight: "700",
    margin: 0,
  },

  subtitle: {
    fontSize: "0.8rem",
    opacity: 0.85,
  },

  inputWrap: {
    display: "flex",
    gap: "8px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
  },

  btnMain: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#ff6b35",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },

  btn: {
    flex: 1,
    padding: "8px",
    borderRadius: "10px",
    border: "none",
    background: "#ff9f43",
    color: "#fff",
    cursor: "pointer",
  },

  total: {
    marginTop: "8px",
    fontSize: "0.85rem",
  },

  error: {
    color: "#ffe5d0",
    marginTop: "10px",
  },

  listWrap: {
    marginTop: "10px",
    overflowY: "auto",
    flex: 1,
  },

  listItem: {
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "8px",
    background: "rgba(255,255,255,0.12)",
  },

  index: {
    fontSize: "0.7rem",
    opacity: 0.7,
  },

  name: {
    fontWeight: 500,
  },

  link: {
    fontSize: "0.8rem",
    textDecoration: "underline",
    color: "#fff8e8",
  },
};
