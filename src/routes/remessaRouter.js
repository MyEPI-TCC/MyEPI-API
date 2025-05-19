import express from 'express';
import * as RemessaController from '../controllers/RemessaController.js';

const router = express.Router();

// Rotas para remessas
router.get('/', RemessaController.getAllRemessas);
router.get('/:id', RemessaController.getRemessaById);
router.post('/', RemessaController.createRemessa);
router.put('/:id', RemessaController.updateRemessa);
router.delete('/:id', RemessaController.deleteRemessa);

// Rotas específicas
router.get('/fornecedor/:id', RemessaController.getRemessasByFornecedor);
router.get('/modelo-epi/:id', RemessaController.getRemessasByModeloEpi);

export default router;