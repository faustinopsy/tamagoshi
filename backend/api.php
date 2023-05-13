<?php

require_once 'DataController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

$dataController = new DataController();

switch ($method) {
    case 'GET':
        if (isset($_GET['email'])) {
            $data = $dataController->getData($_GET['email']);
            echo json_encode($data);
        } else {
            echo json_encode(['error' => 'Email not provided']);
        }
        break;
    case 'POST':
        $json = file_get_contents('php://input');
        $postData = json_decode($json, true);

        if (isset($postData['email']) && isset($postData['appState'])) {
            $result = $dataController->saveData($postData['email'], $postData['appState']);
            echo json_encode(['success' => $result]);
        } else {
            echo json_encode(['error' => 'Invalid data provided']);
        }
        break;
    default:
        echo json_encode(['error' => 'Invalid request method']);
}
