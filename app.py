from flask import Flask, redirect, url_for, session, request, render_template_string
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
from google.auth.transport.requests import Request
import os

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev_secret_key")

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
CLIENT_SECRETS_FILE = "client_secret.json"


def credentials_to_dict(credentials):
    return {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }


def extract_drive_id(url_or_id):
    if "id=" in url_or_id:
        return url_or_id.split("id=")[1].split("&")[0]
    elif "drive.google.com" in url_or_id:
        parts = url_or_id.split("/")
        if "folders" in url_or_id:
            return parts[-1]
        elif "file" in url_or_id:
            return parts[-2]
    return url_or_id


@app.route("/")
def index():
    if "credentials" not in session:
        return redirect(url_for("authorize"))

    return render_template_string("""
      <!DOCTYPE html>
      <html>
      <head>
        <title>Drive Copier</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(120deg, #89f7fe, #66a6ff);
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            text-align: center;
            width: 350px;
            z-index: 10;
          }
          input, button {
            margin: 10px 0;
            padding: 10px;
            width: 90%;
            border-radius: 10px;
            border: 1px solid #ccc;
          }
          button {
            background: #66a6ff;
            color: white;
            font-weight: bold;
            cursor: pointer;
          }
          .snowflake {
            position: fixed;
            color: white;
            font-size: 1em;
            pointer-events: none;
            z-index: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Copy File Google Drive</h2>
          <form action="/copy" method="post">
            <input type="text" name="file_id" placeholder="File ID / URL" required><br>
            <input type="text" name="folder_id" placeholder="Folder ID (opsional)"><br>
            <input type="number" name="count" placeholder="Jumlah copy" min="1" value="1"><br>
            <button type="submit">Copy</button>
          </form>
        </div>

        <script>
          // Animasi salju
          function createSnow() {
            const snow = document.createElement("div");
            snow.classList.add("snowflake");
            snow.textContent = "❄";
            snow.style.left = Math.random() * window.innerWidth + "px";
            snow.style.animationDuration = (Math.random() * 3 + 2) + "s";
            snow.style.fontSize = Math.random() * 10 + 10 + "px";
            document.body.appendChild(snow);

            setTimeout(() => { snow.remove(); }, 5000);
          }
          setInterval(createSnow, 200);
        </script>
      </body>
      </html>
    """)


@app.route("/authorize")
def authorize():
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES
    )
    flow.redirect_uri = url_for("oauth2callback", _external=True)
    authorization_url, state = flow.authorization_url(access_type="offline", include_granted_scopes="true")
    session["state"] = state
    return redirect(authorization_url)


@app.route("/oauth2callback")
def oauth2callback():
    state = session["state"]
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state
    )
    flow.redirect_uri = url_for("oauth2callback", _external=True)
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    session["credentials"] = credentials_to_dict(credentials)
    return redirect(url_for("index"))

@app.route("/copy", methods=["POST"])
def copy_file():
    credentials = google.oauth2.credentials.Credentials(**session["credentials"])
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
        session["credentials"] = credentials_to_dict(credentials)

    drive_service = googleapiclient.discovery.build("drive", "v3", credentials=credentials)

    file_id = extract_drive_id(request.form["file_id"])
    folder_id = extract_drive_id(request.form["folder_id"]) if request.form["folder_id"] else None
    count = int(request.form["count"])

    # Ambil nama file asli
    original = drive_service.files().get(fileId=file_id, fields="name").execute()
    original_name = original.get("name", "Copy")

    for i in range(count):
        copied_file = {
            "name": f"{original_name} ({i+1})"
        }
        if folder_id:
            copied_file["parents"] = [folder_id]
        drive_service.files().copy(fileId=file_id, body=copied_file).execute()

    # Halaman loading + popup selesai
    return render_template_string("""
      <!DOCTYPE html>
      <html>
      <head>
        <title>Copying...</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f0f0f0;
            font-family: Arial;
          }
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div>
          <div class="loader"></div>
          <p>Sedang mengcopy file...</p>
        </div>

        <script>
          // Setelah 1 detik, tampilkan popup berhasil
          setTimeout(() => {
            Swal.fire({
              title: "Berhasil!",
              text: "File berhasil dicopy sebanyak {{count}} kali.",
              icon: "success",
              confirmButtonText: "OK"
            }).then(() => { window.location.href = "/" });
          }, 1000);
        </script>
      </body>
      </html>
    """, count=count)



if __name__ == "__main__":
    app.run(debug=True)
