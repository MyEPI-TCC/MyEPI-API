import express from 'express';
import * as MarcaController from '../controllers/MarcaController.js';

const router = express.Router();

// Rotas para marcas
router.get('/', MarcaController.getAllMarcas);
router.get('/:id', MarcaController.getMarcaById);
router.post('/', MarcaController.createMarca);
router.put('/:id', MarcaController.updateMarca);
router.delete('/:id', MarcaController.deleteMarca);

export default router;