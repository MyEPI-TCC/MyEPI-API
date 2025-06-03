import express from 'express';
import EstoqueLoteController from '../controllers/EstoqueLoteController.js';

const router = express.Router();

router.get('/remessa/:id', EstoqueLoteController.listarPorRemessa);
router.get('/modelo-epi/:id', EstoqueLoteController.listarPorModeloEpi);

// Rotas básicas CRUD
router.get('/', EstoqueLoteController.listarEstoque);
router.get('/:id', EstoqueLoteController.buscarEstoqueLote);
router.post('/', EstoqueLoteController.criarEstoqueLote);
router.put('/:id', EstoqueLoteController.atualizarEstoque);
router.delete('/:id', EstoqueLoteController.excluirEstoqueLote);

// Rotas específicas
// router.get('/relatorios/proximos-vencimento', EstoqueLoteController.listarProximosVencimento);
// router.get('/relatorios/baixo-estoque', EstoqueLoteController.listarBaixoEstoque);

export default router;