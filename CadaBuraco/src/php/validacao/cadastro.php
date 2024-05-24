<?php
// Configurações do banco de dados
$host = 'localhost:3308';
$usuario = 'root';
$senha = '';
$banco = 'marcadores';

// Conexão com o banco de dados
$conexao = new mysqli($host, $usuario, $senha, $banco);

// Verifica se houve algum erro na conexão
if ($conexao->connect_error) {
    die("Erro na conexão: " . $conexao->connect_error);
}

// Recebe o email do formulário
$email = $_POST['email'];

// Verifica se o email já está cadastrado
$sql_check_email = "SELECT * FROM usuario WHERE email='$email'";
$result_check_email = $conexao->query($sql_check_email);

if ($result_check_email->num_rows > 0) {
    // O email já está cadastrado, exibe a mensagem de erro e encerra o script
    header("Location: ../../pages/cadastro.html?error=email_cadastrado");
    exit();
}

// Se o email não estiver cadastrado, continua com o processo de cadastro

// Recebe a senha do formulário
$senha = $_POST['passwordCadastro'];

// Verifica se os campos estão vazios
if (empty($email) || empty($senha)) {
    echo "Por favor, preencha todos os campos.";
    exit;
}

// Verifica se o email é válido
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Por favor, insira um email válido.";
    exit;
}

// Query SQL para inserir os dados na tabela de usuários
$sql = "INSERT INTO usuario (email, senha) VALUES ('$email', '$senha')";

// Executa a query
if ($conexao->query($sql) === TRUE) {
    echo "Cadastro realizado com sucesso!";
    header('Location: ../../pages/map.html');
    exit;
} else {
    echo "Erro ao cadastrar: " . $conexao->error;
}

// Fecha a conexão
$conexao->close();
?>
