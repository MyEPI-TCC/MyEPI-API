import express from 'express';
import * as CategoriaController from '../controllers/CategoriaController.js';

const router = express.Router();

// Rotas para categorias
router.get('/', CategoriaController.getAllCategorias);
router.get('/:id', CategoriaController.getCategoriaById);
router.post('/', CategoriaController.createCategoria);
router.put('/:id', CategoriaController.updateCategoria);
router.delete('/:id', CategoriaController.deleteCategoria);

export default router;