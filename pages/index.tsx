import React, { useState } from "react";

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

  const apiKey = "AIzaSyD71nWVbtMxWK4T05Ty4qMuIRTP4ij2i48";

  const extractFolderId = (input: string) => {
    const match = input.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };

  const fetchFiles = async () => {
    const folderId = extractFolderId(folderInput);

    if (!folderId) {
      setError("Masukkan link / ID folder yang valid.");
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

      const fetchedFiles: FileItem[] = (data.files || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        link: `https://drive.google.com/file/d/${f.id}/view?utm_source=grfkflwr&utm_medium=web&utm_campaign=drivesdk`,
      }));

      setFiles(fetchedFiles);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Disalin!");
  };

  const particles = Array.from({ length: 25 });

  return (
    <>
      {/* 🔥 RESET BODY (HILANGIN PUTIH) */}
      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

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
      `}</style>

      <div style={styles.wrapper}>
        {/* ❄️🌸⭐ PARTICLES */}
        <div style={styles.particleWrap}>
          {particles.map((_, i) => (
            <span
              key={i}
              style={{
                ...styles.particle,
                left: `${Math.random() * 100}%`,
                animationDuration: `${12 + Math.random() * 10}s`,
                fontSize: `${12 + Math.random() * 10}px`,
              }}
            >
              {i % 3 === 0 ? "❄️" : i % 3 === 1 ? "🌸" : "⭐"}
            </span>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>WinterLinkFindU</h1>
            <p style={styles.subtitle}>winter uhuyyy!! </p>
            <p style={styles.subtitle}>💖mohon jangan disebar💖</p>
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
                <button
                  onClick={() => copy(files.map((f) => f.name).join("\n"))}
                >
                  Nama
                </button>
                <button
                  onClick={() => copy(files.map((f) => f.link).join("\n"))}
                >
                  Link
                </button>
                <button
                  onClick={() =>
                    copy(files.map((f) => `${f.name} ${f.link}`).join("\n"))
                  }
                >
                  Semua
                </button>
              </div>

              <div style={styles.list}>
                {files.map((f, i) => (
                  <div key={f.id} style={styles.item}>
                    <span>
                      {i + 1}. {f.name}
                    </span>
                    <a href={f.link} target="_blank" rel="noreferrer">
                      Buka
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
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    // 🔥 FULL COLOR TANPA PUTIH
    background:
      "linear-gradient(-45deg,#0f2027,#203a43,#2c5364,#1c92d2,#0f2027)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 15s ease infinite",
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
    opacity: 0.7,
  },

  card: {
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
    padding: "25px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "700px",
    color: "#fff",
    zIndex: 1,
  },

  header: {
    textAlign: "center",
    marginBottom: "15px",
  },

  title: {
    marginBottom: "5px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "0",
    opacity: 0.85,
    fontSize: "0.9rem",
  },

  inputWrap: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
  },

  btnMain: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#ffffff22",
    color: "#fff",
    cursor: "pointer",
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },

  list: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.1)",
    padding: "8px",
    borderRadius: "8px",
  },

  error: {
    color: "#ffb3b3",
    marginTop: "10px",
  },
};
