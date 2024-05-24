<?php
// Verifica se os dados do formulário estão definidos e não estão vazios
if (isset($_POST['email']) && isset($_POST['password']) && !empty($_POST['email']) && !empty($_POST['password'])) {
    // Dados do formulário
    $email = $_POST['email'];
    $senha = $_POST['password'];

    // Configurações do banco de dados
    $host = 'localhost:3308'; // Endereço do servidor MySQL
    $usuario = 'root'; // Nome de usuário do banco de dados
    $senha_bd = ''; // Senha do banco de dados
    $banco = 'marcadores'; // Nome do banco de dados

    // Conexão com o banco de dados
    $conexao = new mysqli($host, $usuario, $senha_bd, $banco);

    // Verifica se houve algum erro na conexão
    if ($conexao->connect_error) {
        die("Erro de conexão: " . $conexao->connect_error);
    }

    // Prepara a consulta SQL para verificar se o email e a senha existem no banco de dados
    $sql = "SELECT * FROM usuario WHERE email=? AND senha=?";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("ss", $email, $senha);
    $stmt->execute();

    // Obtém o resultado da consulta
    $result = $stmt->get_result();

    // Verifica se há resultados na consulta
    if ($result->num_rows > 0) {
        // Email e senha encontrados no banco de dados, redireciona para a página desejada
        header("Location: ../../pages/map.html");
        exit(); // Encerra o script PHP após o redirecionamento
    } else {
        // Email e senha não encontrados no banco de dados, define a mensagem de erro;
        header("Location: ../../pages/login.html?error=email_not_found");
        exit();
    }

    // Fecha a consulta preparada e a conexão com o banco de dados
    $stmt->close();
    $conexao->close();
}
?>
