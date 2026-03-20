# AI Image Generator with Flask Backend

## 🚀 Quick Start

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Flask Backend
```bash
python server.py
```
You'll see:
```
🚀 Starting Flask server on http://localhost:5000
📸 AI Image Generator Backend Ready!
```

### 3. Open the Frontend
In another terminal/browser:
```
http://localhost:8000
```
(Or just open `index.html` directly in your browser)

### 4. Generate Images!
- Fill in all fields
- Click Generate
- Wait 20-30 seconds for first image
- Enjoy! 🎨

---

## 📁 Project Structure

```
image generator/
├── server.py          ← Flask backend (handles API calls)
├── requirements.txt   ← Python dependencies
├── index.html         ← Frontend UI
├── style.css          ← Styling
├── script.js          ← Calls Flask backend
├── config.js          ← Not used (kept for reference)
└── test.png           ← Placeholder
```

---

## 🎯 How It Works

```
Browser → Flask (localhost:5000) → Hugging Face API ✅
```

- **Frontend** calls Flask backend at `localhost:5000/generate-image`
- **Flask backend** securely calls Hugging Face API
- **No CORS issues!** Backend-to-backend communication
- **API key is safe** on the server side

---

## 🔧 Dependencies

- **Flask** - Python web framework
- **flask-cors** - Enables CORS
- **requests** - HTTP library for API calls

Install with:
```bash
pip install -r requirements.txt
```

---

## 🎨 Features

- ✅ Beautiful UI with dark/light theme
- ✅ Random prompt generator
- ✅ 4 AI models to choose from
- ✅ Custom aspect ratios (1:1, 16:9, 4:3, 9:16)
- ✅ Generate 1-4 images at once
- ✅ Download functionality
- ✅ Loading animations
- ✅ **No CORS issues!**

---

## ⚙️ Configuration

API key is loaded from environment variables in `server.py`:
```python
API_KEY = os.getenv("HUGGING_FACE_API_KEY", "")
```

Available models:
- FLUX.1-dev
- FLUX.1-schnell
- Stable Diffusion XL
- OpenJourney

---

## 🐛 Troubleshooting

**"Connection refused" error:**
- Make sure Flask server is running (`python server.py`)
- Check it's running on port 5000

**"Module not found" error:**
- Install dependencies: `pip install -r requirements.txt`

**Images not generating:**
- Check Flask server terminal for error messages
- First generation takes 20-30s (models loading)
- Try OpenJourney model (fastest)

---

## 🚀 Production Deployment

To deploy:
1. Use a platform like Heroku, Railway, or Render
2. Add `gunicorn` to requirements.txt
3. Create `Procfile`: `web: gunicorn server:app`
4. Deploy!

---

## 🎉 You're All Set!

Run `python server.py` and start generating amazing AI images! 🎨✨
