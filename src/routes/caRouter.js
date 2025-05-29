
import express from 'express';
import CaController from '../controllers/CaController.js';

const router = express.Router();

// Rotas para Certificados de Aprovação (CA)
router.get('/', CaController.listarCas);
router.post('/', CaController.criarCa);
router.get('/ativos', CaController.buscarCasAtivos);
router.get('/vencimento', CaController.buscarCasProximosVencimento);
router.get('/numero/:numero', CaController.buscarCaPorNumero);
router.get('/modelo/:id', CaController.buscarCasPorModelo); // NOVA ROTA
router.get('/:id', CaController.buscarCaPorId);
router.put('/:id', CaController.atualizarCa);
router.delete('/:id', CaController.excluirCa);

// router.get('/:id', CaController.getCAById);
// router.put('/:id', CaController.updateCA);
// router.delete('/:id', CaController.deleteCA);

// // Rotas específicas
// router.get('/numero/:numero', CaController.getCAByNumero);
// router.get('/modelo-epi/:id', CaController.getCAsByModeloEpi);
// router.get('/ativos', CaController.getCAsAtivos);
// router.get('/proximos-vencimento', CaController.getCAsProximosVencimento);

export default router;