import Fornecedor from '../models/Fornecedor.js';

class FornecedorController {
  static async listarFornecedores(req, res) {
    try {
      const result = await Fornecedor.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar fornecedores:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async criarFornecedor(req, res) {
    try {
      const { nome_fornecedor, cnpj } = req.body;
      if (!nome_fornecedor || !cnpj) return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });

      const result = await Fornecedor.create({ nome_fornecedor, cnpj });
      return res.status(result.success ? 201 : 400).json(result.success ? { message: result.message, id: result.id } : { error: result.error });
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default FornecedorController;
