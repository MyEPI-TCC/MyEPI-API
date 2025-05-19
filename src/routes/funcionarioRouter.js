// src/routes/funcionarioRouter.js
import express from 'express';
import FuncionarioController from '../controllers/FuncionarioController.js';

const router = express.Router();

// Rotas para funcionários
router.get('/', FuncionarioController.listarFuncionarios);
router.get('/:id', FuncionarioController.buscarFuncionario);
router.post('/', FuncionarioController.criarFuncionario);
router.put('/:id', FuncionarioController.atualizarFuncionario);
router.delete('/:id', FuncionarioController.excluirFuncionario);

// Rotas específicas
// Colocamos antes da rota /:id para evitar conflitos
router.get('/cargo/:id_cargo', FuncionarioController.listarPorCargo);

export default router;