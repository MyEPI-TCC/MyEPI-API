import Categoria from '../models/Categoria.js';

class CategoriaController {
  static async listarCategorias(req, res) {
    try {
      const result = await Categoria.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async criarCategoria(req, res) {
    try {
      const { nome_categoria } = req.body;
      if (!nome_categoria) return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });

      const result = await Categoria.create({ nome_categoria });
      return res.status(result.success ? 201 : 400).json(result.success ? { message: result.message, id: result.id } : { error: result.error });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default CategoriaController;
