<?php
require 'db.php';

// Permitir CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

$authToken = 't0kenP@ss';
$headers = getallheaders();
$token = $headers['Authorization'] ?? '';

if (strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7); 
}

if ($token !== $authToken) {
    http_response_code(401);
    echo json_encode(['error' => 'Token inválido']);
    exit;
}

// Método POST: Inserir corretora
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $nome_fantasia = $data['nome_fantasia'] ?? '';
    $razao_social = $data['razao_social'] ?? '';
    $cnpj = $data['cnpj'] ?? '';
    $endereco = $data['endereco'] ?? '';

    if (!$nome_fantasia || !$razao_social || !$cnpj || !$endereco) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos os campos são obrigatórios']);
        exit;
    }

    $sql = "INSERT INTO corretoras (nome_fantasia, razao_social, cnpj, endereco) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$nome_fantasia, $razao_social, $cnpj, $endereco])) {
        http_response_code(201);
        echo json_encode(['success' => 'Corretora cadastrada com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao cadastrar corretora']);
    }
    exit;
}

// Método GET: Listar corretoras
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM corretoras");
    $corretoras = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($corretoras);
    exit;
}

// Método DELETE: Excluir corretora
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);

    $id = $data['id'] ?? '';

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID é obrigatório']);
        exit;
    }

    $sql = "DELETE FROM corretoras WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$id])) {
        echo json_encode(['success' => 'Corretora excluída com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao excluir corretora']);
    }
    exit;
}

// Método PUT: Atualizar corretora
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents('php://input'), $data);

    $id = $data['id'] ?? '';
    $nome_fantasia = $data['nome_fantasia'] ?? '';
    $razao_social = $data['razao_social'] ?? '';
    $cnpj = $data['cnpj'] ?? '';
    $endereco = $data['endereco'] ?? '';

    if (!$id || !$nome_fantasia || !$razao_social || !$cnpj || !$endereco) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos os campos são obrigatórios']);
        exit;
    }

    $sql = "UPDATE corretoras SET nome_fantasia = ?, razao_social = ?, cnpj = ?, endereco = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    if ($stmt->execute([$nome_fantasia, $razao_social, $cnpj, $endereco, $id])) {
        echo json_encode(['success' => 'Corretora atualizada com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar corretora']);
    }
    exit;
}

// Caso o método não seja nem GET, POST, PUT, DELETE
http_response_code(405);
echo json_encode(['error' => 'Método não permitido']);
?>
