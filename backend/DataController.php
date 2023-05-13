<?php
require_once 'Database.php';

class DataController {
    private $database;

    public function __construct() {
        $this->database = new Database();
    }

    public function getData($email) {
        return $this->database->read('user_data', ['email' => $email]);
    }
    public function emailExists($email) {
        $result = $this->database->read('user_data', ['email' => $email]);
        return !empty($result);
    }
    
    public function saveData($email, $appState) {
        if (!is_array($appState)) {
            $appState = json_decode($appState, true);
        }
    
        $pessoa = $appState['pessoa'];
    
        $dataToSave = [
            'email' => $email,
            'saldo' => $pessoa['saldo'],
            'dormindo' => $pessoa['dormindo'] ? 1 : 0,
            'evolucao' => $pessoa['evolucao'],
            'fome' => $pessoa['fome'],
            'sono' => $pessoa['sono'],
            'idade' => $pessoa['idade'],
            'diasTristes' => $pessoa['diasTristes'],
            'humor' => $pessoa['humor'],
            'tempoDesdeUltimaAtualizacaoIdade' => $pessoa['tempoDesdeUltimaAtualizacaoIdade'],
            'tempoRestauracao' => $appState['tempoRestauracao'],
            'capacidadeMineracao' => $appState['capacidadeMineracao']
        ];
    
        if ($this->emailExists($email)) {
            return $this->database->update('user_data', $dataToSave, ['email' => $email]);
        } else {
            return $this->database->create('user_data', $dataToSave);
        }
    }
    
    
}
