// src/routes/funcionarioRouter.js

import express from 'express';
import FuncionarioController from '../controllers/FuncionarioController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/', FuncionarioController.listarFuncionarios);
router.get('/cargo/:id_cargo', FuncionarioController.listarPorCargo);
router.get('/:id', FuncionarioController.buscarFuncionario);

router.post('/', upload.single('foto'), FuncionarioController.criarFuncionario);
router.put('/:id', upload.single('foto'), FuncionarioController.atualizarFuncionario);
router.delete('/:id', FuncionarioController.excluirFuncionario);

export default router;
