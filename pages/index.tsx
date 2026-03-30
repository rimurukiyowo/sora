import React, { useState, useEffect } from 'react';

type FileItem = {
  id: string;
  name: string;
  link: string;
};

export default function Home() {
  const [folderInput, setFolderInput] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = 'AIzaSyD71nWVbtMxWK4T05Ty4qMuIRTP4ij2i48';

  const extractFolderId = (input: string) => {
    const match = input.match(/[-\w]{25,}/);
    return match ? match[0] : '';
  };

  const naturalSort = (a: string, b: string) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  };

  const fetchFiles = async () => {
    const folderId = extractFolderId(folderInput);
    if (!folderId) {
      setError('Masukkan link atau ID folder Google Drive yang valid.');
      setFiles([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&orderBy=name&key=${apiKey}&fields=files(id,name)`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        setFiles([]);
      } else {
        const fetchedFiles: FileItem[] = data.files
          .map((file: any) => ({
            id: file.id,
            name: file.name,
            link: `https://drive.google.com/file/d/${file.id}/view`,
          }))
          .sort((a, b) => naturalSort(a.name, b.name));

        setFiles(fetchedFiles);
      }
    } catch {
      setError('Terjadi kesalahan saat mengambil data.');
      setFiles([]);
    }

    setLoading(false);
  };

  const showAlert = (msg: string) => {
    if (typeof window !== "undefined") {
      alert(msg);
    }
  };

  const copyToClipboard = (content: string, message: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(content)
        .then(() => showAlert(message))
        .catch(() => fallbackCopy(content, message));
    } else {
      fallbackCopy(content, message);
    }
  };

  const fallbackCopy = (text: string, message: string) => {
    if (typeof document === "undefined") return;

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      showAlert(message);
    } catch {
      showAlert('Gagal menyalin.');
    }

    document.body.removeChild(textarea);
  };

  const copyAllNames = () => {
    if (files.length === 0) {
      showAlert('Tidak ada data untuk disalin!');
      return;
    }
    const names = files.map(file => file.name).join('\n');
    copyToClipboard(names, 'Semua nama berhasil disalin!');
  };

  const copyAllLinks = () => {
    if (files.length === 0) {
      showAlert('Tidak ada data untuk disalin!');
      return;
    }
    const links = files.map(file => file.link).join('\n');
    copyToClipboard(links, 'Semua link berhasil disalin!');
  };

  const copyAllNamesAndLinks = () => {
    if (files.length === 0) {
      showAlert('Tidak ada data untuk disalin!');
      return;
    }
    const combined = files.map(file => `${file.name} ${file.link}`).join('\n');
    copyToClipboard(combined, 'Semua nama dan link berhasil disalin!');
  };

  useEffect(() => {
    if (typeof window !== "undefined" && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .catch(() => {});
      });
    }
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>WinterLinkFindU</h1>

      <input
        type="text"
        placeholder="Paste Link atau ID Folder Google Drive"
        value={folderInput}
        onChange={(e) => setFolderInput(e.target.value)}
      />

      <button onClick={fetchFiles}>
        {loading ? 'Loading...' : 'Tampilkan File'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {files.length > 0 && (
        <>
          <button onClick={copyAllNames}>Copy Nama</button>
          <button onClick={copyAllNamesAndLinks}>Copy Semua</button>
          <button onClick={copyAllLinks}>Copy Link</button>

          <ul>
            {files.map(file => (
              <li key={file.id}>
                {file.name} - <a href={file.link} target="_blank">{file.link}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
