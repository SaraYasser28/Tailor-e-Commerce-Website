const regexName = document.getElementById('name');
const regexEmail = document.getElementById('email');
const regexPassword = document.getElementById('password');
const btn = document.getElementById('btn');
const confirmPassword = document.getElementById('confirmPassword');

const requiredDiv = document.getElementById('required')
const allData = JSON.parse(localStorage.getItem("user")) || [];
const regex = {
    regexName: /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/,
    regexEmail: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    regexPassword: /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/
};
btn.addEventListener('click', (e) => {
    e.preventDefault();

    let isNameValid = validateForm(regexName);
    let isEmailValid = validateForm(regexEmail);
    let isPasswordValid = validateForm(regexPassword);
    let alertDiv = confirmPassword.parentElement.querySelector('.alert');
let isConfirmValid = (regexPassword.value === confirmPassword.value && confirmPassword.value !== "");

if (isConfirmValid) {
    confirmPassword.classList.remove('is-invalid');
    confirmPassword.classList.add('is-valid');
    alertDiv?.classList.add('d-none');
} else {
    confirmPassword.classList.add('is-invalid');
    confirmPassword.classList.remove('is-valid');
    alertDiv?.classList.remove('d-none');
}

    if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
        requiredDiv.innerHTML = "";
        if (allData.some(user => user.userEmail === regexEmail.value)) {
            window.alert('Email already exists'); 
            return;
        }
        const info = {
            userName: regexName.value,
            userEmail: regexEmail.value,
            userPassword: regexPassword.value,
        }
        allData.push(info)
        localStorage.setItem("user", JSON.stringify(allData));
        location.href = '../Home/index.html';
    } else {
        requiredDiv.innerHTML = `<p>All Fields Are Required</p>`;
    }
});

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
  } else {
    input.type = "password";
    btn.innerHTML = `<i class="fa-solid fa-eye"></i>`;
  }
}

function validateForm(e) {
    let regexPattern = regex[`regex${e.id.charAt(0).toUpperCase() + e.id.slice(1)}`];
    let alertDiv = e.parentElement.querySelector('.alert'); // 👈 يمسك الـ alert الصح

    if (regexPattern && regexPattern.test(e.value)) {
        e.classList.remove('is-invalid');
        e.classList.add('is-valid');
        alertDiv?.classList.add('d-none');
        return true;
    } else {
        e.classList.add('is-invalid');
        e.classList.remove('is-valid');
        alertDiv?.classList.remove('d-none');
        return false;
    }
}
