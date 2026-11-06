import os
from dotenv import load_dotenv
from flask import send_from_directory

# Load local environment variables
load_dotenv()

# Import the main WSGI app from api.index
from api.index import app

DIST_DIR = os.path.join(os.path.dirname(__file__), "dist")

@app.route("/")
def home():
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return "React build not found. Run: npm run build"

if __name__ == "__main__":
    print("Nani Assistant Local Server running on http://127.0.0.1:5000")
    app.run(port=5000, debug=True)
