<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost:3308';
$usuario = 'root';
$senha = '';
$banco = 'marcadores';

$conexao = new mysqli($host, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    echo("sucesso"),
    die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
}

$query = "SELECT latitude, longitude FROM info";
$resultado = $conexao->query($query);

$coordenadas = array();

if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        $coordenadas[] = array(
            'latitude' => $row['latitude'],
            'longitude' => $row['longitude']
        );
    }
} else {
    echo json_encode(array('erro' => 'Nenhum registro encontrado no banco de dados.'));
}

// Saída de depuração
echo json_encode($coordenadas); // Esta linha deve retornar os dados JSON

$conexao->close();
?>
