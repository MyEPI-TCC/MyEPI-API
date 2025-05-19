import express from 'express';
import MarcaController from '../controllers/MarcaController.js';

const router = express.Router();

// Rotas para marcas
router.get('/', MarcaController.listarMarcas);
router.post('/', MarcaController.criarMarca);
// router.get('/:id', MarcaController.getMarcaById);
// router.put('/:id', MarcaController.updateMarca);
// router.delete('/:id', MarcaController.deleteMarca);

export default router;