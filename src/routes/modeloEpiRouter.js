import express from 'express';
import * as ModeloEpiController from '../controllers/ModeloEpiController.js';

const router = express.Router();

// Rotas para modelos de EPI
router.get('/', ModeloEpiController.getAllModelosEpi);
router.get('/:id', ModeloEpiController.getModeloEpiById);
router.post('/', ModeloEpiController.createModeloEpi);
router.put('/:id', ModeloEpiController.updateModeloEpi);
router.delete('/:id', ModeloEpiController.deleteModeloEpi);

// Rotas específicas
router.get('/categoria/:id', ModeloEpiController.getModelosEpiByCategoria);
router.get('/marca/:id', ModeloEpiController.getModelosEpiByMarca);
router.get('/rastreavel/:status', ModeloEpiController.getModelosEpiByRastreavel);
router.get('/quantidade-baixa', ModeloEpiController.getModelosEpiBaixoEstoque);
router.get('/cargo/:id', ModeloEpiController.getModelosEpiByCargo);

export default router;