import express from 'express';

import homeRoutes from './src/routes/homeRouter.js';
import funcionarioRouter from './src/routes/funcionarioRouter.js';
import categoriaRouter from './src/routes/categoriaRouter.js';
import cargoRouter from './src/routes/cargoRouter.js';
import marcaRouter from './src/routes/marcaRouter.js';
import modeloEpiRouter from './src/routes/modeloEpiRouter.js';
import fornecedorRouter from './src/routes/fornecedorRouter.js';
import remessaRouter from './src/routes/remessaRouter.js';
import movimentacaoRouter from './src/routes/movimentacaoRouter.js';
import estoqueRouter from './src/routes/estoqueRouter.js';
import caRouter from './src/routes/caRouter.js';
import { testConnection } from './src/config/database.js';

class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/', homeRoutes);
        this.app.use('/api/funcionarios', funcionarioRouter);
        this.app.use('/api/categorias', categoriaRouter);
        this.app.use('/api/cargos', cargoRouter);
        this.app.use('/api/marcas', marcaRouter);
        this.app.use('/api/modelos-epi', modeloEpiRouter);
        this.app.use('/api/fornecedores', fornecedorRouter);
        this.app.use('/api/remessas', remessaRouter);
        this.app.use('/api/movimentacoes', movimentacaoRouter);
        this.app.use('/api/estoques', estoqueRouter);
        this.app.use('/api/ca', caRouter);

        this.app.get('/api/health', async (req, res) => {
            const dbConnected = await testConnection();
            res.json({ 
                status: 'OK', 
                message: 'API funcionando corretamente',
                database: dbConnected ? 'Conectado' : 'Desconectado',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString()
            });
        });
    }
}

export default new App().app;

