// src/routes/modeloEpiRouter.js
import express from 'express';
import ModeloEpiController from '../controllers/ModeloEpiController.js';

const router = express.Router();

// Rotas para modelos de EPI
router.get('/', ModeloEpiController.listarEpis);
router.get('/:id', ModeloEpiController.buscarEpi);
router.post('/', ModeloEpiController.criarEpi);
router.put('/:id', ModeloEpiController.atualizarEpi);
router.delete('/:id', ModeloEpiController.excluirEpi);

// Rotas específicas

router.get('/categoria/:id_categoria', ModeloEpiController.listarPorCategoria);
router.get('/cargo/:id_cargo', ModeloEpiController.listarPorCargo);

// Obs: Os métodos abaixo não existem no controlador mostrado
// Você precisa implementá-los ou remover essas rotas
// router.get('/marca/:id', ModeloEpiController.listarPorMarca);
// router.get('/rastreavel/:status', ModeloEpiController.listarPorRastreavel);
// router.get('/quantidade-baixa', ModeloEpiController.listarBaixoEstoque);

export default router;