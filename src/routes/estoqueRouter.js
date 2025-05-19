import express from 'express';
import * as EstoqueLoteController from '../controllers/EstoqueLoteController.js';

const router = express.Router();

// Rotas para estoque em lotes
router.get('/', EstoqueLoteController.getAllEstoqueLotes);
router.get('/:id', EstoqueLoteController.getEstoqueLoteById);
router.post('/', EstoqueLoteController.createEstoqueLote);
router.put('/:id', EstoqueLoteController.updateEstoqueLote);
router.delete('/:id', EstoqueLoteController.deleteEstoqueLote);

// Rotas específicas
router.get('/remessa/:id', EstoqueLoteController.getEstoqueLotesByRemessa);
router.get('/modelo-epi/:id', EstoqueLoteController.getEstoqueLotesByModeloEpi);
router.get('/proximos-vencimento', EstoqueLoteController.getEstoqueLotesProximosVencimento);
router.get('/baixo-estoque', EstoqueLoteController.getEstoqueLotesBaixoEstoque);

export default router;