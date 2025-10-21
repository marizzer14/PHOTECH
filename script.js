

document.addEventListener('DOMContentLoaded', () => {
  const logoEl = document.getElementById('logo');
  if (logoEl) {
    logoEl.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { location.reload(); }, 450);
    });
  }

  const orderBtn = document.querySelector('.landing-page .content button');
  if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceSection = document.getElementById('service');
      if (serviceSection) {
        serviceSection.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', '#service');
      } else {
        window.location.href = window.location.pathname + '#service';
      }
    });
  }


  const submitBtn = document.getElementById('submitOrderBtn');
  const custName = document.getElementById('custName');
  const custGrade = document.getElementById('custGrade');
  const custPhone = document.getElementById('custPhone');
  const custEmail = document.getElementById('custEmail');

 
  let hasImage = false;
  const imagePreview = document.getElementById('imagePreview');

  function checkImagePresence() {
    if (!imagePreview) return false;
    return !!imagePreview.querySelector('img');
  }

  function validateCustomerForm() {
    hasImage = checkImagePresence();
    const ok = custName && custGrade && custPhone &&
      custName.value.trim() !== '' &&
      custGrade.value.trim() !== '' &&
      custPhone.value.trim() !== '' &&
      hasImage;
    if (submitBtn) submitBtn.disabled = !ok;
  }

  [custName, custGrade, custPhone].forEach(el => {
    if (!el) return;
    el.addEventListener('input', validateCustomerForm);
  });

  const observer = new MutationObserver(validateCustomerForm);
  if (imagePreview) observer.observe(imagePreview, { childList: true, subtree: true });

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
          await emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',{
            to_name: 'PhoTech Team',
            from_name: payload.name,
            message: `Order\nName: ${payload.name}\nGrade: ${payload.grade}\nPhone: ${payload.phone}\nEmail: ${payload.email}`,
            image_data: imageData
          }, 'YOUR_USER_ID');
          showPopup('Order submitted. Thank you!');
          // reset minimal fields (you can expand as needed)
          custName.value = custGrade.value = custPhone.value = custEmail.value = '';
          // if you have reupload/reset logic, call it here
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
  function toDataUrl(url) {
    return fetch(url).then(res => res.blob()).then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
  }

  // initial validation run
  validateCustomerForm();

  // upload input
  const uploadInput = document.getElementById('uploadInput');
  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    imagePreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Uploaded image';
    imagePreview.appendChild(img);

    imagePreviewContainer.classList.add('has-image');
    uploadWrap.classList.add('has-image');
    imagePreviewContainer.style.display = 'flex';
    if (customerInfoContainer) {
      customerInfoContainer.style.display = 'block'; 
      customerInfoContainer.style.zIndex = '50';
    }

    hasImage = true;
    validateForm();
  });
});
