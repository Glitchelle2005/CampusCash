<?php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? 'login';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($action === 'register') {
    $fullName = trim($input['fullName'] ?? '');
    $username = strtolower(trim($input['username'] ?? $fullName));
    $password = $input['password'] ?? '';

    if (strlen($fullName) < 2 || strlen($password) < 4) {
        http_response_code(400);
        echo json_encode(['error' => 'Please provide a valid name and a password of at least 4 characters']);
        exit();
    }

    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR LOWER(full_name) = ?");
    $stmt->execute([$username, strtolower($fullName)]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'An account with this name already exists']);
        exit();
    }

    $id = 'usr_' . uniqid();
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (id, full_name, username, password_hash) VALUES (?, ?, ?, ?)");
    $stmt->execute([$id, $fullName, $username, $hash]);

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $id,
            'fullName' => $fullName,
            'username' => $username
        ]
    ]);
    exit();
}

if ($action === 'login') {
    $usernameInput = strtolower(trim($input['username'] ?? ''));
    $password = $input['password'] ?? '';

    if (!$usernameInput || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password are required']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR LOWER(full_name) = ?");
    $stmt->execute([$usernameInput, $usernameInput]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid name or password']);
        exit();
    }

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'fullName' => $user['full_name'],
            'username' => $user['username']
        ]
    ]);
    exit();
}

http_response_code(400);
echo json_encode(['error' => 'Invalid action']);

