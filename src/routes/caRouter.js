
import express from 'express';
import * as CAController from '../controllers/CAController.js';

const router = express.Router();

// Rotas para Certificados de Aprovação (CA)
router.get('/', CAController.getAllCAs);
router.get('/:id', CAController.getCAById);
router.post('/', CAController.createCA);
router.put('/:id', CAController.updateCA);
router.delete('/:id', CAController.deleteCA);

// Rotas específicas
router.get('/numero/:numero', CAController.getCAByNumero);
router.get('/modelo-epi/:id', CAController.getCAsByModeloEpi);
router.get('/ativos', CAController.getCAsAtivos);
router.get('/proximos-vencimento', CAController.getCAsProximosVencimento);

export default router;