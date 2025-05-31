// src/routes/entregasRouter.js
import express from 'express';
import EntregasController from '../controllers/EntregasController.js';

const router = express.Router();

// Rotas para entregas
router.get('/', EntregasController.listarEntregas);
router.get('/:id', EntregasController.buscarEntrega);
router.post('/', EntregasController.registrarEntrega);

// Rotas específicas - estas devem vir antes da rota com :id
router.get('/funcionario/:id_funcionario', EntregasController.listarPorFuncionario);
router.get('/epi/:id_epi', EntregasController.listarPorEpi);
router.get('/tipo/:tipo', EntregasController.listarPorTipo);

export default router;
