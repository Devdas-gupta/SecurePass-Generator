function generatePassword() {
    const length = document.getElementById('length').value;
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const digits = document.getElementById('digits').checked;
    const symbols = document.getElementById('symbols').checked;

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const symbolChars = '!@#$%^&*()_-+=<>?';

    let chars = '';
    if (uppercase) chars += uppercaseChars;
    if (lowercase) chars += lowercaseChars;
    if (digits) chars += digitChars;
    if (symbols) chars += symbolChars;

    if (!chars) {
        alert('Please select at least one character type.');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
    }

    document.getElementById('password').value = password;

    // Estimate password strength with zxcvbn
    const result = zxcvbn(password);

    const seconds = result.crack_times_seconds.offline_slow_hashing_1e4_per_second;
    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    const remainingSeconds = seconds % (60 * 60 * 24 * 365);
    const remainingTime = new Date(remainingSeconds * 1000).toISOString().substr(11, 8);

    const crackingTimeElement = document.getElementById('cracking-time');

    // Display password strength feedback
    crackingTimeElement.textContent = `Estimated Cracking Time: ${years} years and ${remainingTime} Hours`;

    // Update the background color based on password strength
    const strengthMeter = document.getElementById('strength-meter');
    strengthMeter.style.width = `${(result.score + 1) * 20}%`;
    strengthMeter.style.backgroundColor = getColor(result.score);
}

function getColor(score) {
    // Customize colors based on your preference and the score
    if (score === 0) return '#e74c3c';
    if (score === 1) return '#e67e22';
    if (score === 2) return '#f39c12';
    if (score === 3) return '#2ecc71';
    if (score === 4) return '#27ae60';
}

function copyToClipboard() {
    const passwordElement = document.getElementById('password');
    const password = passwordElement.value;

    if (!password) {
        alert('Generate a password first.');
        return;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(password).then(function () {
            alert('Password copied to clipboard!');
        }).catch(function (err) {
            console.error('Unable to copy to clipboard.', err);
        });
    } else {
        // Fallback for browsers that don't support Clipboard API
        const tempInput = document.createElement('input');
        tempInput.value = password;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Password copied to clipboard!');
    }
}

function checkPasswordStrength() {
    const userPassword = document.getElementById('user-password').value;

    if (!userPassword) {
        alert('Please enter a password.');
        return;
    }

    // Estimate password strength with zxcvbn for user-entered password
    const result = zxcvbn(userPassword);

    const seconds = result.crack_times_seconds.offline_slow_hashing_1e4_per_second;
    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    const remainingSeconds = seconds % (60 * 60 * 24 * 365);
    const remainingTime = new Date(remainingSeconds * 1000).toISOString().substr(11, 8);

    const userCrackingTimeElement = document.getElementById('user-cracking-time');

    // Display password strength feedback for user-entered password
    userCrackingTimeElement.textContent = `Estimated Cracking Time: ${years} years and ${remainingTime} Hours`;

    // Update the background color based on password strength for user-entered password
    const userStrengthMeter = document.getElementById('user-strength-meter');
    userStrengthMeter.style.width = `${(result.score + 1) * 20}%`;
    userStrengthMeter.style.backgroundColor = getColor(result.score);
}
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('user-password');
    const passwordOpen = document.getElementById('password-open');
    const passwordClose = document.getElementById('password-close');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordOpen.style.display = 'inline';
        passwordClose.style.display = 'none';
    } else {
        passwordInput.type = 'password';
        passwordOpen.style.display = 'none';
        passwordClose.style.display = 'inline';
    }
}
