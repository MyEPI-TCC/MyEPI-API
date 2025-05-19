import Marca from '../models/Marca.js';

class MarcaController {
  static async listarMarcas(req, res) {
    try {
      const result = await Marca.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar marcas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async criarMarca(req, res) {
    try {
      const { nome_marca } = req.body;
      if (!nome_marca) return res.status(400).json({ error: 'Nome da marca é obrigatório.' });

      const result = await Marca.create({ nome_marca });
      return res.status(result.success ? 201 : 400).json(result.success ? { message: result.message, id: result.id } : { error: result.error });
    } catch (error) {
      console.error('Erro ao criar marca:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default MarcaController;
