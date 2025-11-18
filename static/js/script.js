// Image upload preview functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing rice disease detection system...');
    
    initializeImageUpload();
    initializeDragAndDrop();
    initializeFormHandlers();
    initializeAutoDismissAlerts();
});

// Image upload functionality
function initializeImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (!imageInput || !uploadArea || !analyzeBtn) {
        console.error('Required elements for image upload not found');
        return;
    }

    // Handle file selection
    imageInput.addEventListener('change', function(e) {
        console.log('File input changed');
        handleFileSelection(e.target.files[0]);
    });

    function handleFileSelection(file) {
        if (file) {
            console.log('Selected file:', file.name, file.type);
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    console.log('File loaded successfully');
                    previewImg.src = e.target.result;
                    imagePreview.classList.remove('d-none');
                    uploadArea.style.display = 'none';
                    analyzeBtn.disabled = false;
                    
                    console.log('Image preview shown, analyze button enabled');
                };
                
                reader.onerror = function() {
                    console.error('Error reading file');
                    showError('Error reading the image file. Please try again.');
                    clearImage();
                };
                
                reader.readAsDataURL(file);
            } else {
                showError('Please select a valid image file (JPG, JPEG, PNG)');
                clearImage();
            }
        }
    }
}

// Drag and drop functionality
function initializeDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');

    if (!uploadArea || !imageInput) {
        return;
    }

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('highlight');
        console.log('Drag area highlighted');
    }

    function unhighlight() {
        uploadArea.classList.remove('highlight');
        console.log('Drag area unhighlighted');
    }

    // Handle dropped files
    uploadArea.addEventListener('drop', function(e) {
        console.log('File dropped');
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });
}

// Form submission handling
function initializeFormHandlers() {
    const uploadForm = document.getElementById('uploadForm');
    
    if (!uploadForm) {
        return;
    }

    uploadForm.addEventListener('submit', function(e) {
        console.log('Form submission started');
        const fileInput = document.getElementById('imageInput');
        
        if (!fileInput || !fileInput.files.length) {
            e.preventDefault();
            showError('Please select an image file before analyzing.');
            return;
        }

        // Show loading state
        showLoadingState(true);
        console.log('Loading state activated');
    });
}

// Clear selected image
function clearImage() {
    console.log('Clearing selected image');
    
    const imageInput = document.getElementById('imageInput');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (imageInput) imageInput.value = '';
    if (imagePreview) imagePreview.classList.add('d-none');
    if (uploadArea) {
        uploadArea.style.display = 'block';
        uploadArea.classList.remove('highlight');
    }
    if (analyzeBtn) analyzeBtn.disabled = true;
    
    showLoadingState(false);
    console.log('Image cleared, form reset');
}

// Show/hide loading state
function showLoadingState(show) {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const submitSpinner = document.getElementById('submitSpinner');
    const buttonText = document.getElementById('buttonText');

    if (!analyzeBtn) return;

    if (show) {
        analyzeBtn.disabled = true;
        if (submitSpinner) submitSpinner.classList.remove('d-none');
        if (buttonText) buttonText.textContent = 'Analyzing...';
    } else {
        analyzeBtn.disabled = false;
        if (submitSpinner) submitSpinner.classList.add('d-none');
        if (buttonText) buttonText.textContent = 'Analyze Image';
    }
}

// Show error message
function showError(message) {
    alert(message); // Simple alert for now
    console.error('Error:', message);
}

// Auto-dismiss alerts
function initializeAutoDismissAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        const closeButton = alert.querySelector('.btn-close');
        if (!closeButton) {
            // Auto-close after 5 seconds if no close button
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.style.opacity = '0';
                    alert.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        if (alert.parentNode) {
                            alert.parentNode.removeChild(alert);
                        }
                    }, 500);
                }
            }, 5000);
        }
    });
}

// Utility function to trigger file input
function triggerFileInput() {
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.click();
    }
}

// Add global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Export functions for global access
window.clearImage = clearImage;
window.triggerFileInput = triggerFileInput;