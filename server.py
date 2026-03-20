from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient
import base64
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your Hugging Face API key
API_KEY = os.getenv("HUGGING_FACE_API_KEY", "")

# Initialize Hugging Face Inference Client with latest version
client = InferenceClient(token=API_KEY)

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get('prompt')
        model = data.get('model')
        width = data.get('width', 512)
        height = data.get('height', 512)

        if not prompt or not model:
            return jsonify({'error': 'Missing prompt or model'}), 400

        print(f"\n🎨 Generating image...")
        print(f"📝 Model: {model}")
        print(f"💭 Prompt: {prompt[:60]}...")

        try:
            # Use official Hugging Face SDK with latest syntax
            # The SDK automatically handles the correct endpoints
            image = client.text_to_image(
                prompt,
                model=model
            )
            
            # Convert PIL Image to base64
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            image_bytes = buffered.getvalue()
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            
            print(f"✅ Image generated successfully!\n")
            
            return jsonify({
                'image': f'data:image/png;base64,{image_base64}'
            })

        except Exception as api_error:
            error_msg = str(api_error)
            print(f"❌ API Error: {error_msg}\n")
            
            # Handle model loading state
            if 'loading' in error_msg.lower():
                return jsonify({
                    'error': 'Model is loading',
                    'estimated_time': 20
                }), 503
            
            return jsonify({
                'error': f'HuggingFace Error: {error_msg}'
            }), 500

    except Exception as e:
        print(f"💥 Server Error: {str(e)}\n")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Flask AI Image Generator Server")
    print("=" * 50)
    print("📍 Running on: http://localhost:5000")
    print("🤖 Using: Hugging Face Inference SDK v1.1.6")
    print("✅ CORS Enabled")
    print("=" * 50)
    print("\nServer is ready! Waiting for requests...\n")
    app.run(debug=True, port=5000, use_reloader=False)
