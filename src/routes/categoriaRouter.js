import express from 'express';
import CategoriaController from '../controllers/CategoriaController.js';

const router = express.Router();

// Rotas para categorias
router.get('/', CategoriaController.listarCategorias);
router.post('/', CategoriaController.criarCategoria);
// router.get('/:id', CategoriaController.getCategoriaById);
// router.put('/:id', CategoriaController.updateCategoria);
// router.delete('/:id', CategoriaController.deleteCategoria);

export default router;