<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $userId = $_GET['user_id'] ?? null;
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'user_id is required']);
            exit();
        }

        $stmt = $pdo->prepare("SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? ('goal_' . uniqid());
        $userId = $input['user_id'] ?? '';
        $name = trim($input['name'] ?? '');
        $category = trim($input['category'] ?? 'General');
        $target = floatval($input['target'] ?? 0);
        $saved = floatval($input['saved'] ?? 0);
        $deadline = $input['deadline'] ?? null;

        if (!$userId || !$name || $target <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid goal input']);
            exit();
        }

        $stmt = $pdo->prepare("
            INSERT INTO goals (id, user_id, name, category, target_amount, current_amount, deadline)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$id, $userId, $name, $category, $target, $saved, $deadline]);

        echo json_encode(['success' => true, 'data' => [
            'id' => $id,
            'name' => $name,
            'category' => $category,
            'target' => $target,
            'saved' => $saved,
            'deadline' => $deadline
        ]]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? '';
        $saved = floatval($input['saved'] ?? 0);

        $stmt = $pdo->prepare("UPDATE goals SET current_amount = ? WHERE id = ?");
        $stmt->execute([$saved, $id]);

        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

