const imageInput = document.getElementById('imageInput');
const dropZone = document.getElementById('dropZone');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const originalImg = document.getElementById('originalImg');
const heatmapImg = document.getElementById('heatmapImg');
const diagnosisText = document.getElementById('diagnosisText');
const statusBadge = document.getElementById('statusBadge');
const progressBar = document.getElementById('progressBar');

dropZone.addEventListener('click', () => imageInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#3b82f6';
    dropZone.style.background = 'rgba(59, 130, 246, 0.1)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#475569';
    dropZone.style.background = 'rgba(15, 23, 42, 0.4)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#475569';
    dropZone.style.background = 'rgba(15, 23, 42, 0.4)';
    if (e.dataTransfer.files.length > 0) {
        imageInput.files = e.dataTransfer.files;
        handleFileSelect();
    }
});

imageInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    if (imageInput.files.length > 0) {
        analyzeBtn.disabled = false;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImg.src = e.target.result;
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        analyzeBtn.disabled = true;
    }
}

analyzeBtn.addEventListener('click', async () => {
    const file = imageInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    resultsDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    analyzeBtn.disabled = true;
    progressBar.style.width = '0%';

    try {
        const response = await fetch('https://soon007-pneumo-backend.hf.space/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        diagnosisText.textContent = data.diagnosis;
        
        if (data.diagnosis.toLowerCase().includes("normal")) {
            statusBadge.textContent = "CLEAR";
            statusBadge.className = "status normal";
        } else {
            statusBadge.textContent = "ATTENTION REQUIRED";
            statusBadge.className = "status pneumonia";
        }
        
        heatmapImg.src = `data:image/png;base64,${data.heatmap_image}`;

        loadingDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');

        setTimeout(() => {
            progressBar.style.width = '98.4%';
        }, 100);

    } catch (error) {
        console.error(error);
        alert('An error occurred during analysis.');
        loadingDiv.classList.add('hidden');
    } finally {
        analyzeBtn.disabled = false;
    }
});