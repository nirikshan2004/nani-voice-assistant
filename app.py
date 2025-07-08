from flask import Flask, request, jsonify, render_template
import requests
import os
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

# Load environment variables
load_dotenv()
app = Flask(__name__)

# API keys
OPENROUTER_API_KEY = os.getenv("OPENAI_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL")  # should be: https://openrouter.ai/api/v1
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

# ✅ Fast and free model
MODEL_ID = "mistralai/mistral-7b-instruct"

# Function to get GPT response
def get_gpt_response(query):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": MODEL_ID,
        "messages": [
            {"role": "system", "content": "You are a friendly and smart assistant who explains topics in a simple way."},
            {"role": "user", "content": query}
        ]
    }

    try:
        res = requests.post(f"{OPENROUTER_BASE_URL}/chat/completions", headers=headers, json=data)
        if res.status_code == 200:
            return res.json()["choices"][0]["message"]["content"].strip()
        else:
            return f"❌ GPT Error {res.status_code}: {res.text}"
    except Exception as e:
        return f"❌ GPT Exception: {str(e)}"

# Function to get images from Pexels
def get_pexels_images(query, count=2):  # Reduced count = faster
    try:
        res = requests.get(
            "https://api.pexels.com/v1/search",
            headers={"Authorization": PEXELS_API_KEY},
            params={"query": query, "per_page": count}
        )
        if res.status_code == 200:
            photos = res.json().get("photos", [])
            return [photo["src"]["medium"] for photo in photos]
    except Exception as e:
        print("Pexels Error:", e)
    return []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message", "").strip()
    if not user_msg:
        return jsonify({"response": "Please enter a message!", "images": []})

    # ⚡ Run GPT + Pexels calls in parallel
    with ThreadPoolExecutor() as executor:
        gpt_future = executor.submit(get_gpt_response, user_msg)
        image_future = executor.submit(get_pexels_images, user_msg)

        reply = gpt_future.result()
        images = image_future.result()

    return jsonify({"response": reply, "images": images})

if __name__ == "__main__":
    app.run(debug=True)
