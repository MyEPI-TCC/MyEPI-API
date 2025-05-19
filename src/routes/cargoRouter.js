import express from 'express';
import CargoController from '../controllers/CargoController.js';

const router = express.Router();

// Rotas para cargos
router.get('/', CargoController.listarCargos);
router.post('/', CargoController.criarCargo);
// router.get('/:id', CargoController.getCargoById);
// router.put('/:id', CargoController.updateCargo);
// router.delete('/:id', CargoController.deleteCargo);

// Rotas específicas
// router.get('/:id/epis', CargoController.getEpisByCargo);
// router.get('/:id/funcionarios', CargoController.getFuncionariosByCargo);
// router.post('/:id/adicionar-epi/:modeloEpiId', CargoController.adicionarEpiAoCargo);
// router.delete('/:id/remover-epi/:modeloEpiId', CargoController.removerEpiDoCargo);

export default router;