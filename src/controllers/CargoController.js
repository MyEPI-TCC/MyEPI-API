import Cargo from '../models/Cargo.js';

class CargoController {
  static async listarCargos(req, res) {
    try {
      const result = await Cargo.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar cargos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async criarCargo(req, res) {
    try {
      const { nome_cargo } = req.body;
      if (!nome_cargo) return res.status(400).json({ error: 'Nome do cargo é obrigatório.' });

      const result = await Cargo.create({ nome_cargo });
      return res.status(result.success ? 201 : 400).json(result.success ? { message: result.message, id: result.id } : { error: result.error });
    } catch (error) {
      console.error('Erro ao criar cargo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async excluirCargo(req, res) {
    try {
      const { id } = req.params;
      const result = await Cargo.delete(id);
      return res.status(result.success ? 200 : 404).json(result.success ? { message: result.message } : { error: result.error });
    } catch (error) {
      console.error('Erro ao excluir cargo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default CargoController;
