function mostrarSenha() {
    const password = window.document.getElementById("password");
    const btnshowpass = window.document.getElementById("btn-senha");

    if (password.type === 'password') {
        password.setAttribute('type', 'text');
        btnshowpass.classList.replace('bi-eye-fill','bi-eye-slash-fill');
    } else{
        password.setAttribute('type', 'password');
        btnshowpass.classList.replace('bi-eye-slash-fill','bi-eye-fill');

    }
}

// Verifica se há um parâmetro 'error' na URL
const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');

// Se houver um erro na URL, exibe a mensagem correspondente
if (error === 'email_not_found') {
    const emailError = document.getElementById('emailError');
    emailError.style.display = 'block';
}