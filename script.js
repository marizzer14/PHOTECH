
document.getElementById("logo").addEventListener("click", function() {
  window.location.href = window.location.origin + window.location.pathname + "#home";
  window.location.reload();
});



// Sticky navd
const navLinks = document.querySelectorAll('nav ul li a');
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});


// Highlight active nav link based on scroll position with smooth fill effect
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section, footer'); // detect all major parts
  const navLinks = document.querySelectorAll('.nav-items a'); // your nav links
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150; // adjust offset for header height
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
});

// EmailJS setup - Replace with your actual IDs from EmailJS dashboard
emailjs.init('YOUR_USER_ID');  // e.g., 'user_123456789'

const canvas = document.getElementById('templateCanvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('customizeForm');
const stickerInput = document.getElementById('sticker');
const addStickerButton = document.getElementById('addSticker');
const customTextInput = document.getElementById('customText');
const addTextButton = document.getElementById('addText');
const uploadImageInput = document.getElementById('uploadImage');

// Ensure canvas exists before proceeding
if (!canvas) {
    console.error('Canvas element with id "templateCanvas" not found.');
} else {
    // Function to add sticker (image) to canvas
    addStickerButton.addEventListener('click', () => {
        const stickerURL = stickerInput.value.trim();
        if (stickerURL) {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // For CORS if needed
            img.src = stickerURL;
            img.onload = () => {
                ctx.drawImage(img, 100, 100, 100, 100);  // Adjustable position/size
            };
            img.onerror = () => alert('Failed to load sticker image.');
        } else {
            alert('Please enter a valid sticker URL.');
        }
    });

    // Function to add text to canvas
    addTextButton.addEventListener('click', () => {
        const text = customTextInput.value.trim();
        if (text) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(text, 50, 50);  // Adjustable position
        } else {
            alert('Please enter text to add.');
        }
    });

    // Upload image to canvas
    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if canvas has content (basic check)
        const canvasDataURL = canvas.toDataURL('image/png');
        if (canvasDataURL === canvas.toDataURL()) {  // If empty, this might not be ideal; consider checking pixel data
            alert('Please customize the design before submitting.');
            return;
        }
        
        // Prepare data to send
        const templateParams = {
            to_email: 'YOUR_EMAIL_ADDRESS',  // e.g., 'yourbusiness@email.com'
            from_name: 'PhoTech Customer',
            message: document.getElementById('comments').value || 'No comments provided.',
            design_preview: canvasDataURL,
            sticker: stickerInput.value || 'None',
        };
        
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)  // e.g., 'service_abc123', 'template_xyz789'
            .then((response) => {
                alert('Design submitted successfully! We\'ll review it and get back to you.');
                ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
                form.reset();
            }, (error) => {
                alert('Oops! Something went wrong. Please try again. Error: ' + JSON.stringify(error));
            });
    });
}

// Expand/Collapse Instruction Box
document.addEventListener("DOMContentLoaded", function () {
  const instructionBox = document.querySelector(".instruction-box");
  const toggleBtn = instructionBox.querySelector(".toggle-btn");

  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    instructionBox.classList.toggle("active");
  });
});
