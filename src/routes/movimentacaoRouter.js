// src/routes/movimentacaoRouter.js
import express from 'express';
import MovimentacaoController from '../controllers/MovimentacaoController.js';

const router = express.Router();

// Rotas para movimentações
router.get('/', MovimentacaoController.listarMovimentacoes);
router.get('/:id', MovimentacaoController.buscarMovimentacao);
router.post('/', MovimentacaoController.registrarMovimentacao);

// Rotas específicas - estas devem vir antes da rota com :id
router.get('/funcionario/:id_funcionario', MovimentacaoController.listarPorFuncionario);
router.get('/epi/:id_epi', MovimentacaoController.listarPorEpi);
router.get('/tipo/:tipo', MovimentacaoController.listarPorTipo);

export default router;