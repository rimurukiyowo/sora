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

  const apiKey = "AIzaSyD71nWVbtMxWK4T05Ty4qMuIRTP4ij2i48"; // ganti API key kamu

  const extractFolderId = (input: string) => {
    const match = input.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };

  const fetchFiles = async () => {
    const folderId = extractFolderId(folderInput);

    if (!folderId) {
      setError("Masukkan link atau ID folder yang valid.");
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
        setError(
          data?.error?.message ||
            "Gagal mengambil data. Pastikan folder public & API valid.",
        );
        setFiles([]);
        return;
      }

      const fetchedFiles: FileItem[] = (data.files || [])
        .map((file: { id: string; name: string }) => ({
          id: file.id,
          name: file.name,
          link: `https://drive.google.com/file/d/${file.id}/view?utm_source=grfkflwr&utm_medium=web&utm_campaign=drivesdk`,
        }))
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
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

  const particles = Array.from({ length: 40 });

  return (
    <div style={styles.wrapper}>
      {/* ❄️🌸 PARTICLES */}
      <div style={styles.particleContainer}>
        {particles.map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${12 + Math.random() * 18}px`,
            }}
          >
            {i % 2 === 0 ? "❄️" : "🌸"}
          </span>
        ))}
      </div>

      <div style={styles.card}>
        <h1 style={styles.title}>❄️ WinterLinkFindU</h1>
        <p style={styles.subtitle}>winter uhuyyy!! 💖💖💖</p>
        <p style={styles.subtitle}>💖mohon jangan disebar💖</p>

        <div style={styles.inputWrap}>
          <input
            value={folderInput}
            onChange={(e) => setFolderInput(e.target.value)}
            placeholder="Paste link / ID folder..."
            style={styles.input}
          />
          <button onClick={fetchFiles} style={styles.mainBtn}>
            {loading ? "Loading..." : "Ambil"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {files.length > 0 && (
          <>
            <div style={styles.actions}>
              <button
                style={styles.btn}
                onClick={() =>
                  copy(files.map((f) => f.name).join("\n"), "Nama disalin!")
                }
              >
                Copy Nama
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  copy(
                    files.map((f) => `${f.name} ${f.link}`).join("\n"),
                    "Semua disalin!",
                  )
                }
              >
                Copy Semua
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  copy(files.map((f) => f.link).join("\n"), "Link disalin!")
                }
              >
                Copy Link
              </button>
            </div>

            <p style={styles.total}>Total: {files.length}</p>

            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f, i) => (
                    <tr key={f.id}>
                      <td>{i + 1}</td>
                      <td>{f.name}</td>
                      <td>
                        <a href={f.link} target="_blank" rel="noreferrer">
                          Buka
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ANIMASI */}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10px); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

const styles: any = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    position: "relative",
    overflow: "hidden",
  },

  particleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },

  particle: {
    position: "absolute",
    top: "-10px",
    animation: "fall linear infinite",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    padding: "25px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "800px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    zIndex: 1,
  },

  title: { textAlign: "center", fontSize: "2rem" },

  subtitle: { textAlign: "center", marginBottom: "15px" },

  inputWrap: { display: "flex", gap: "10px" },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
  },

  mainBtn: {
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(45deg,#ff9a9e,#fad0c4)",
    cursor: "pointer",
  },

  actions: { marginTop: "10px", display: "flex", gap: "10px" },

  btn: {
    padding: "8px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(45deg,#a1c4fd,#c2e9fb)",
    cursor: "pointer",
  },

  total: { marginTop: "10px" },

  error: { color: "#ff6b6b" },

  table: {
    width: "100%",
    marginTop: "10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
  },
};
