const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const promptBtn = document.querySelector('.prompt-btn');
const promptForm = document.querySelector('.prompt-form');
const promptInput = document.querySelector('#prompt-input');

const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeToggle.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

themeToggle.addEventListener('click', toggleTheme);


//random prompt generator

promptBtn.addEventListener('click', () => {
    const prompts = [
        "A beautiful landscape with a mountain range in the background, a river flowing through the foreground, and a forest in the distance.",
        "A futuristic cityscape with tall buildings and flying cars, with a beautiful sunset in the background.",
        "A magical forest with glowing mushrooms, fairies, and unicorns, with a beautiful sunset in the background.",
        "A serene beach at sunset with palm trees, golden sand, and calm waves reflecting the orange sky.",
        "A steampunk-inspired city with mechanical creatures, airships, and Victorian architecture.",
        "A cozy cottage in a snow-covered valley with smoke rising from the chimney and northern lights in the sky.",
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptInput.value = randomPrompt;
});

// Function to calculate dimensions based on aspect ratio
function getImageDimensions(aspectRatio) {
    const dimensions = {
        "1/1": { width: 512, height: 512 },
        "16/9": { width: 768, height: 432 },
        "4/3": { width: 640, height: 480 },
        "9/16": { width: 432, height: 768 }
    };
    return dimensions[aspectRatio] || dimensions["1/1"];
}

// Function to generate a single image using local Flask backend
async function generateImage(prompt, modelName, aspectRatio, index) {
    const dimensions = getImageDimensions(aspectRatio);

    try {
        // Call local Flask backend
        const response = await fetch('http://localhost:5000/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                model: modelName,
                width: dimensions.width,
                height: dimensions.height,
            })
        });

        if (!response.ok) {
            // Handle model loading state
            if (response.status === 503) {
                const error = await response.json();
                if (error.error && error.error.includes('loading')) {
                    // Retry after estimated time
                    const waitTime = (error.estimated_time || 20) * 1000;
                    console.log(`Model loading, waiting ${waitTime / 1000}s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return generateImage(prompt, modelName, aspectRatio, index);
                }
            }

            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.image; // Returns base64 data URL
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}

// Form submission handler
promptForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    const modelSelect = document.querySelector('#model-select').value;
    const imageCount = parseInt(document.querySelector('#image-count').value);
    const aspectRatio = document.querySelector('#aspect-ratio').value;

    // Validate all required fields
    if (!prompt || !modelSelect || !imageCount || !aspectRatio) {
        alert('Please fill in all fields before generating images.');
        return;
    }

    const galleryGrid = document.querySelector('.gallery-grid');

    // Clear existing images
    galleryGrid.innerHTML = '';

    // Create loading placeholders
    const loadingCards = [];
    for (let i = 0; i < imageCount; i++) {
        const imgCard = document.createElement('div');
        imgCard.classList.add('img-card', 'loading');
        imgCard.style.aspectRatio = aspectRatio;
        imgCard.dataset.index = i;
        galleryGrid.appendChild(imgCard);
        loadingCards.push(imgCard);
    }

    // Generate all images in parallel
    const imagePromises = [];
    for (let i = 0; i < imageCount; i++) {
        imagePromises.push(
            generateImage(prompt, modelSelect, aspectRatio, i)
                .then(imageUrl => ({ index: i, imageUrl, success: true }))
                .catch(error => ({ index: i, error, success: false }))
        );
    }

    // Wait for all images to complete
    const results = await Promise.all(imagePromises);

    // Update each card with the result
    results.forEach(result => {
        const imgCard = loadingCards[result.index];
        imgCard.classList.remove('loading');

        if (result.success) {
            imgCard.innerHTML = `
                <img src="${result.imageUrl}" class="result-img" alt="Generated Image ${result.index + 1}">
                <div class="img-overlay">
                    <button class="img-download-btn" type="button">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
            `;
        } else {
            // Show error state
            imgCard.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: #ff6b6b; margin-bottom: 10px;"></i>
                    <p style="color: var(--color-text); font-size: 0.9rem; opacity: 0.8;">Failed to generate image</p>
                    <p style="color: var(--color-text); font-size: 0.75rem; opacity: 0.6; margin-top: 5px;">Check Flask server logs</p>
                </div>
            `;
        }
    });
});

// Download functionality using event delegation
document.addEventListener('click', (e) => {
    if (e.target.closest('.img-download-btn')) {
        const imgCard = e.target.closest('.img-card');
        const img = imgCard.querySelector('.result-img');

        if (!img) return;

        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `ai-generated-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
