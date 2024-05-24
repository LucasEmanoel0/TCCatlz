<?php
// Configurações do banco de dados
$host = 'localhost:3308';         // Endereço do servidor MySQL
$usuario = 'root';                // Nome de usuário do banco de dados
$senha = '';                      // Senha do banco de dados
$banco = 'marcadores';            // Nome do banco de dados

// Conexão com o banco de dados
$conexao = new mysqli($host, $usuario, $senha, $banco);

// Verifica se a conexão foi bem-sucedida
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

// Verifica se os dados foram recebidos via POST
if (isset($_POST['latitude']) && isset($_POST['longitude'])) {
    // Recebe as coordenadas de latitude e longitude via POST
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];

    // Insere as coordenadas no banco de dados
    $sql = "INSERT INTO info (latitude, longitude) VALUES (?, ?)";
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("dd", $latitude, $longitude);

    if ($stmt->execute()) {
        echo "Marcador salvo com sucesso!";
    } else {
        echo "Erro ao salvar o marcador: " . $stmt->error;
    }

    // Fecha a declaração preparada
    $stmt->close();
} else {
    echo "Erro: Latitude e/ou Longitude não foram fornecidas.";
}

// Fecha a conexão com o banco de dados
$conexao->close();
?>
