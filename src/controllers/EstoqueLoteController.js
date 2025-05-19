import EstoqueLote from '../models/EstoqueLote.js';

class EstoqueLoteController {
  static async listarEstoque(req, res) {
    try {
      const result = await EstoqueLote.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async atualizarEstoque(req, res) {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;

      if (quantidade === undefined) return res.status(400).json({ error: 'Quantidade obrigatória.' });

      const result = await EstoqueLote.update(id, { quantidade });
      return res.status(result.success ? 200 : 404).json(result.success ? { message: result.message } : { error: result.error });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default EstoqueLoteController;
