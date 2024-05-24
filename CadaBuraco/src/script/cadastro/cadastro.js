function validarEmail() {
    const emailInput = document.getElementById('emailCadastro');
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        alert('Por favor, insira um endereço de email válido.');
        emailInput.focus();
        return; // Sai da função se o email não for válido
    }

    // Se o email for válido, redireciona para a página map.html
    window.location.href = './map.html';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// Verifica se há um parâmetro 'error' na URL
const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');

// Se houver um erro na URL, exibe a mensagem correspondente
if (error === 'email_cadastrado') {
    const emailError = document.getElementById('emailError');
    emailError.style.display = 'block';
}



function mostrarSenha() {
    const password = window.document.getElementById("passwordCadastro");
    const btnshowpass = window.document.getElementById("btn-senha");

    if (password.type === 'password') {
        password.setAttribute('type', 'text');
        btnshowpass.classList.replace('bi-eye-fill','bi-eye-slash-fill');
    } else{
        password.setAttribute('type', 'password');
        btnshowpass.classList.replace('bi-eye-slash-fill','bi-eye-fill');

    }
}
