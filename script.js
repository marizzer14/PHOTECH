document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const logoEl = document.getElementById('logo');
    const orderBtn = document.querySelector('.landing-page .content button');
    const submitBtn = document.getElementById('submitOrderBtn');
    const custName = document.getElementById('custName');
    const custGrade = document.getElementById('custGrade');
    const custPhone = document.getElementById('custPhone');
    const custEmail = document.getElementById('custEmail');
    const uploadInput = document.getElementById('uploadImage');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const uploadWrap = document.getElementById('uploadWrap');
    const customerInfoContainer = document.getElementById('customerInfoContainer');

    let hasImage = false;

    // Function to check if an image is loaded
    function checkImagePresence() {
        if (!imagePreview) return false;
        return !!imagePreview.querySelector('img');
    }

    // Function to validate the customer form
    function validateCustomerForm() {
        hasImage = checkImagePresence();
        const ok = custName && custGrade && custPhone &&
            custName.value.trim() !== '' &&
            custGrade.value.trim() !== '' &&
            custPhone.value.trim() !== '' &&
            hasImage;
        if (submitBtn) submitBtn.disabled = !ok;
    }

    // Function to show a popup
    function showPopup(msg) {
        const popup = document.createElement('div');
        popup.className = 'form-popup';
        popup.textContent = msg;
        Object.assign(popup.style, {
            position: 'fixed',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ff6961',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: '6px',
            zIndex: 9999,
            boxShadow: '0 6px 18px rgba(0,0,0,0.4)'
        });
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    }

    // Event for the submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            validateCustomerForm();
            if (submitBtn.disabled) {
                showPopup('Please fill required fields and upload an image.');
                return;
            }

            const payload = {
                name: custName.value.trim(),
                grade: custGrade.value.trim(),
                phone: custPhone.value.trim(),
                email: custEmail.value.trim() || '(not provided)'
            };

            if (window.emailjs) {
                try {
                    const previewImg = imagePreview.querySelector('img');
                    const imageData = previewImg ? await toDataUrl(previewImg.src) : '';

                    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                        to_name: 'PhoTech Team',
                        from_name: payload.name,
                        message: `Order\nName: ${payload.name}\nGrade: ${payload.grade}\nPhone: ${payload.phone}\nEmail: ${payload.email}`,
                        imageData: imageData
                    }, 'YOUR_USER_ID');

                    showPopup('Order submitted. Thank you!');

                    // reset minimal fields
                    custName.value = custGrade.value = custPhone.value = custEmail.value = '';

                    // Reset image preview
                    imagePreview.innerHTML = '';
                    imagePreviewContainer.classList.remove('has-image');
                    uploadWrap.classList.remove('has-image');
                    imagePreviewContainer.style.display = 'none';
                    hasImage = false;

                    validateCustomerForm(); // Re-validate after reset

                } catch (err) {
                    console.error(err);
                    showPopup('Failed to send. Try again later.');
                }
                return;
            }

            const subject = encodeURIComponent('PhoTech Order — ' + payload.name);
            const body = encodeURIComponent(
                `Name: ${payload.name}\nGrade & Section: ${payload.grade}\nPhone: ${payload.phone}\nEmail: ${payload.email}\n\n(Attach uploaded image if needed.)`
            );

            window.location.href = `mailto:photech.photoprint@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    // Function to convert the image URL to base64
    function toDataUrl(url) {
        return fetch(url).then(res => res.blob()).then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }));
    }

    // Event for the image input
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Uploaded image';

            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);

            imagePreviewContainer.classList.add('has-image');
            uploadWrap.classList.add('has-image');
            imagePreviewContainer.style.display = 'flex';

            hasImage = true;
            validateCustomerForm();
        });
    }

    // Events for the input fields
    [custName, custGrade, custPhone].forEach(el => {
        if (el) el.addEventListener('input', validateCustomerForm);
    });

    // Observer for DOM changes
    const observer = new MutationObserver(validateCustomerForm);
    if (imagePreview) observer.observe(imagePreview, {
        childList: true,
        subtree: true
    });

    // Validate the form on page load
    validateCustomerForm();
});

