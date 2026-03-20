// Hugging Face API Configuration
// Note: API key is now used in server.py (Flask backend)
const API_KEY = process.env.HUGGING_FACE_API_KEY || "";

// Working Models (FLUX models are free and publicly available)
const MODEL_URLS = {
    "black-forest-labs/FLUX.1-dev": "FLUX.1-dev - Best quality, slower (~30-40s)",
    "black-forest-labs/FLUX.1-schnell": "FLUX.1-schnell - Fast, good quality (~10-20s)"
};
