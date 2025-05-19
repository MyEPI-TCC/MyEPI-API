import express from 'express';
import * as FornecedorController from '../controllers/FornecedorController.js';

const router = express.Router();

// Rotas para fornecedores
router.get('/', FornecedorController.getAllFornecedores);
router.get('/:id', FornecedorController.getFornecedorById);
router.post('/', FornecedorController.createFornecedor);
router.put('/:id', FornecedorController.updateFornecedor);
router.delete('/:id', FornecedorController.deleteFornecedor);

// Rotas específicas
router.get('/search', FornecedorController.searchFornecedores);
router.get('/:id/remessas', FornecedorController.getRemessasByFornecedor);

export default router;