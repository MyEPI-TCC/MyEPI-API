import { Router } from "express";

const router = new Router();

// Página inicial
router.get('/', (req, res) => {
    res.json({
        message: 'API de Gerenciamento de EPIs - v1.0',
        status: 'online',
        endpoints: {
            funcionarios: '/api/funcionarios',
            categorias: '/api/categorias',
            cargos: '/api/cargos',
            marcas: '/api/marcas',
            modelos_epi: '/api/modelos-epi',
            fornecedores: '/api/fornecedores',
            remessas: '/api/remessas',
            movimentacoes: '/api/movimentacoes'
        }
    });
});

export default router;