from flask import Flask, request, jsonify, Response, stream_with_context
import requests
import os
import re
import json
from concurrent.futures import ThreadPoolExecutor
from google import genai

app = Flask(__name__)

# Gemini API Client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# Pexels API Key
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "")

SYSTEM_PROMPT = """You are Nani, an ultra-fast, accurate, and friendly AI voice assistant.
Provide direct, accurate, and concise answers in 2-3 clear sentences. Avoid unnecessary filler or preamble.
If the user explicitly asks for a list, steps, or code, format cleanly with short bullet points.
Prioritize speed, clarity, and factual accuracy."""

FALLBACK_MODELS = ["gemini-3-flash-preview", "gemini-3.1-flash-lite"]

STOP_WORDS = {
    "what", "is", "an", "a", "the", "are", "of", "in", "how", "does", "do",
    "can", "you", "tell", "me", "about", "show", "pictures", "photos", "images",
    "explain", "why", "who", "was", "where", "which", "give", "please", "some",
    "like", "with", "look", "hello", "hi", "hey", "write", "story"
}

def extract_visual_subject(query: str) -> str:
    words = re.findall(r'\b[a-zA-Z0-9-]+\b', query)
    meaningful = [w for w in words if w.lower() not in STOP_WORDS]
    if meaningful:
        return " ".join(meaningful[:3])
    return query.strip(" ?.!")

def get_wiki_images(subject: str, count=2):
    if not subject or len(subject) < 2:
        return []
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={subject}&gsrlimit={count}&prop=pageimages&pithumbsize=600&format=json"
        res = requests.get(url, headers={"User-Agent": "NaniAssistant/1.0"}, timeout=3)
        if res.status_code == 200:
            pages = res.json().get("query", {}).get("pages", {})
            images = []
            for _, page in pages.items():
                if "thumbnail" in page and "source" in page["thumbnail"]:
                    images.append(page["thumbnail"]["source"])
            return images
    except Exception:
        pass
    return []

def get_relevant_images(query: str, count=2):
    clean_query = query.lower().strip(" .!?,")
    if clean_query in {"hi", "hello", "hey", "thanks", "ok", "yes", "no"} or len(clean_query) < 3:
        return []

    subject = extract_visual_subject(query)
    images = []

    if PEXELS_API_KEY:
        try:
            res = requests.get(
                "https://api.pexels.com/v1/search",
                headers={"Authorization": PEXELS_API_KEY},
                params={"query": subject, "per_page": count},
                timeout=3.5
            )
            if res.status_code == 200:
                photos = res.json().get("photos", [])
                images = [photo["src"]["medium"] for photo in photos]
        except Exception:
            pass

    if len(images) < count:
        wiki_imgs = get_wiki_images(subject, count - len(images))
        images.extend(wiki_imgs)

    return images[:count]


@app.route("/chat/stream", methods=["POST"])
def chat_stream():
    """Real-time token streaming with concurrent visual photos"""
    data = request.get_json(silent=True) or {}
    user_msg = data.get("message", "").strip()

    if not user_msg:
        def empty_stream():
            yield f"data: {json.dumps({'text': 'Please enter a message!', 'done': True})}\n\n"
        return Response(empty_stream(), mimetype="text/event-stream")

    def event_stream():
        executor = ThreadPoolExecutor(max_workers=1)
        image_future = executor.submit(get_relevant_images, user_msg)

        stream_success = False
        models_to_try = [GEMINI_MODEL] + [m for m in FALLBACK_MODELS if m != GEMINI_MODEL]

        for model_id in models_to_try:
            try:
                stream = gemini_client.models.generate_content_stream(
                    model=model_id,
                    contents=user_msg,
                    config={
                        "system_instruction": SYSTEM_PROMPT,
                        "temperature": 0.25,
                        "max_output_tokens": 400
                    }
                )
                for chunk in stream:
                    if chunk.text:
                        yield f"data: {json.dumps({'text': chunk.text, 'done': False})}\n\n"
                stream_success = True
                break
            except Exception:
                continue

        if not stream_success:
            yield f"data: {json.dumps({'text': 'Unable to connect to AI engine. Please try again.', 'done': False})}\n\n"

        try:
            images = image_future.result(timeout=4)
            if images:
                yield f"data: {json.dumps({'images': images, 'done': False})}\n\n"
        except Exception:
            pass
        finally:
            executor.shutdown(wait=False)

        yield f"data: {json.dumps({'done': True})}\n\n"

    return Response(
        stream_with_context(event_stream()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_msg = data.get("message", "").strip()

    if not user_msg:
        return jsonify({"response": "Please enter a message!", "images": []})

    with ThreadPoolExecutor(max_workers=2) as executor:
        def get_ai():
            for m in [GEMINI_MODEL] + FALLBACK_MODELS:
                try:
                    res = gemini_client.models.generate_content(
                        model=m,
                        contents=user_msg,
                        config={"system_instruction": SYSTEM_PROMPT, "temperature": 0.25, "max_output_tokens": 400}
                    )
                    return res.text.strip()
                except Exception:
                    continue
            return "AI models are momentarily busy."

        ai_future = executor.submit(get_ai)
        image_future = executor.submit(get_relevant_images, user_msg)

        reply = ai_future.result()
        images = image_future.result()

    return jsonify({"response": reply, "images": images})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "Nani Voice Assistant"})
