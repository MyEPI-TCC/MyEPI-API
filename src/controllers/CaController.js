import Ca from '../models/Ca.js';

class CaController {
  static async listarCas(req, res) {
    try {
      const result = await Ca.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar CAs:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async criarCa(req, res) {
    try {
      const { numero_ca, validade, id_epi } = req.body;
      if (!numero_ca || !validade || !id_epi) return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });

      const result = await Ca.create({ numero_ca, validade, id_epi });
      return res.status(result.success ? 201 : 400).json(result.success ? { message: result.message, id: result.id } : { error: result.error });
    } catch (error) {
      console.error('Erro ao criar CA:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default CaController;
