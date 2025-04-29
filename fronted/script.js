document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const registrationForm = document.getElementById('registrationForm');
    const kycForm = document.getElementById('kycForm');
    const profileForm = document.getElementById('profileForm');

    // Progress steps
    const steps = document.querySelectorAll('.step');
    let currentStep = 1;

    // OTP buttons
    const emailOtpBtn = document.getElementById('emailOtpBtn');
    const mobileOtpBtn = document.getElementById('mobileOtpBtn');
    const aadhaarOtpBtn = document.getElementById('aadhaarOtpBtn');

    // OTP input groups
    const emailOtpGroup = document.getElementById('emailOtpGroup');
    const mobileOtpGroup = document.getElementById('mobileOtpGroup');
    const aadhaarOtpGroup = document.getElementById('aadhaarOtpGroup');

    // Navigation buttons
    const step1Next = document.getElementById('step1Next');
    const step2Prev = document.getElementById('step2Prev');
    const step2Next = document.getElementById('step2Next');
    const step3Prev = document.getElementById('step3Prev');

    // Profile picture upload
    const profilePic = document.getElementById('profilePic');
    const uploadPreview = document.querySelector('.upload-preview');

    // Function to update progress steps
    function updateProgressSteps(step) {
        steps.forEach((s, index) => {
            if (index + 1 <= step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    // Function to show form step
    function showFormStep(step) {
        const forms = [registrationForm, kycForm, profileForm];
        forms.forEach((form, index) => {
            if (index + 1 === step) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });
        currentStep = step;
        updateProgressSteps(step);
    }

    // OTP button click handlers
    emailOtpBtn.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        if (validateEmail(email)) {
            // Simulate sending OTP
            emailOtpGroup.style.display = 'block';
            showNotification('OTP sent to your email');
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });

    mobileOtpBtn.addEventListener('click', function() {
        const mobile = document.getElementById('mobile').value;
        if (validateMobile(mobile)) {
            // Simulate sending OTP
            mobileOtpGroup.style.display = 'block';
            showNotification('OTP sent to your mobile number');
        } else {
            showNotification('Please enter a valid mobile number', 'error');
        }
    });

    aadhaarOtpBtn.addEventListener('click', function() {
        const aadhaar = document.getElementById('aadhaar').value;
        if (validateAadhaar(aadhaar)) {
            // Simulate sending OTP
            aadhaarOtpGroup.style.display = 'block';
            showNotification('OTP sent to your Aadhaar linked mobile number');
        } else {
            showNotification('Please enter a valid Aadhaar number', 'error');
        }
    });

    // Navigation button click handlers
    step1Next.addEventListener('click', function() {
        if (validateStep1()) {
            showFormStep(2);
        }
    });

    step2Prev.addEventListener('click', function() {
        showFormStep(1);
    });

    step2Next.addEventListener('click', function() {
        if (validateStep2()) {
            showFormStep(3);
        }
    });

    step3Prev.addEventListener('click', function() {
        showFormStep(2);
    });

    // Profile picture upload handler
    profilePic.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview" style="max-width: 100px; border-radius: 50%;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission handler
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep3()) {
            // Simulate form submission
            showNotification('Application submitted successfully!', 'success');
            // Reset form
            setTimeout(() => {
                showFormStep(1);
                resetForms();
            }, 2000);
        }
    });

    // Validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateMobile(mobile) {
        const re = /^[0-9]{10}$/;
        return re.test(mobile);
    }

    function validateAadhaar(aadhaar) {
        const re = /^[0-9]{12}$/;
        return re.test(aadhaar);
    }

    function validateStep1() {
        const email = document.getElementById('email').value;
        const emailOtp = document.getElementById('emailOtp').value;
        const mobile = document.getElementById('mobile').value;
        const mobileOtp = document.getElementById('mobileOtp').value;

        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (!emailOtp) {
            showNotification('Please enter email OTP', 'error');
            return false;
        }

        if (!validateMobile(mobile)) {
            showNotification('Please enter a valid mobile number', 'error');
            return false;
        }

        if (!mobileOtp) {
            showNotification('Please enter mobile OTP', 'error');
            return false;
        }

        return true;
    }

    function validateStep2() {
        const aadhaar = document.getElementById('aadhaar').value;
        const aadhaarOtp = document.getElementById('aadhaarOtp').value;
        const pan = document.getElementById('pan').value;
        const bankAccount = document.getElementById('bankAccount').value;
        const ifsc = document.getElementById('ifsc').value;

        if (!validateAadhaar(aadhaar)) {
            showNotification('Please enter a valid Aadhaar number', 'error');
            return false;
        }

        if (!aadhaarOtp) {
            showNotification('Please enter Aadhaar OTP', 'error');
            return false;
        }

        if (!pan) {
            showNotification('Please enter PAN number', 'error');
            return false;
        }

        if (!bankAccount) {
            showNotification('Please enter bank account number', 'error');
            return false;
        }

        if (!ifsc) {
            showNotification('Please enter IFSC code', 'error');
            return false;
        }

        return true;
    }

    function validateStep3() {
        const profilePic = document.getElementById('profilePic').files[0];
        const address = document.getElementById('address').value;

        if (!profilePic) {
            showNotification('Please upload a profile picture', 'error');
            return false;
        }

        if (!address) {
            showNotification('Please enter your permanent address', 'error');
            return false;
        }

        return true;
    }

    // Reset all forms
    function resetForms() {
        registrationForm.reset();
        kycForm.reset();
        profileForm.reset();
        emailOtpGroup.style.display = 'none';
        mobileOtpGroup.style.display = 'none';
        aadhaarOtpGroup.style.display = 'none';
        uploadPreview.innerHTML = '<i class="fas fa-user"></i><p>Upload Photo</p>';
    }

    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            animation: slideIn 0.3s ease-out;
        }
        .notification.info {
            background-color: #3498db;
        }
        .notification.error {
            background-color: #e74c3c;
        }
        .notification.success {
            background-color: #2ecc71;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}); 