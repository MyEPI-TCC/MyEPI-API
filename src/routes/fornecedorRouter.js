import express from 'express';
import FornecedorController from '../controllers/FornecedorController.js';

const router = express.Router();

// Rotas para fornecedores
router.get('/', FornecedorController.listarFornecedores);
router.post('/', FornecedorController.criarFornecedor);
// router.get('/:id', FornecedorController.getFornecedorById);
// router.put('/:id', FornecedorController.updateFornecedor);
// router.delete('/:id', FornecedorController.deleteFornecedor);

// // Rotas específicas
// router.get('/search', FornecedorController.searchFornecedores);
// router.get('/:id/remessas', FornecedorController.getRemessasByFornecedor);

export default router;