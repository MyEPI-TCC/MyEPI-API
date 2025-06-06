// src/routes/modeloEpiRouter.js
import express from 'express';
import ModeloEpiController from '../controllers/ModeloEpiController.js';
import upload from '../config/multer.js'; // Importa a configuração do multer

const router = express.Router();

// Rotas para modelos de EPI
router.get('/', ModeloEpiController.listarEpis);
router.get('/:id', ModeloEpiController.buscarEpi);

// Aplica o middleware de upload (single field 'foto_epi') para as rotas POST e PUT
router.post('/', upload.single('foto_epi'), ModeloEpiController.criarEpi);
router.put('/:id', upload.single('foto_epi'), ModeloEpiController.atualizarEpi);

router.delete('/:id', ModeloEpiController.excluirEpi);

// Rotas específicas
router.get('/categoria/:id_categoria', ModeloEpiController.listarPorCategoria);
router.get('/cargo/:id_cargo', ModeloEpiController.listarPorCargo);

// Obs: Rotas comentadas no arquivo original foram mantidas comentadas
// router.get('/marca/:id', ModeloEpiController.listarPorMarca);
// router.get('/rastreavel/:status', ModeloEpiController.listarPorRastreavel);
// router.get('/quantidade-baixa', ModeloEpiController.listarBaixoEstoque);

export default router;
