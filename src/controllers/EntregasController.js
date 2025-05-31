// src/controllers/EntregasController.js
import EntregasEpi from '../models/EntregasEpi.js';

class EntregasController {
  // Listar todas as entregas
  static async listarEntregas(req, res) {
    try {
      const result = await EntregasEpi.findAll();
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar entregas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Buscar entrega pelo ID
  static async buscarEntrega(req, res) {
    try {
      const { id } = req.params;
      const result = await EntregasEpi.findById(id);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao buscar entrega:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Registrar entrega
  static async registrarEntrega(req, res) {
    try {
      const entregaData = req.body;
      
      // Verificação básica dos dados necessários
      if (!entregaData.tipo_movimentacao || !entregaData.data || 
          !entregaData.hora || !entregaData.quantidade || 
          !entregaData.id_funcionario || !entregaData.id_modelo_epi || 
          !entregaData.id_estoque_lote) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Forneça todos os campos obrigatórios.' 
        });
      }
      
      const result = await EntregasEpi.create(entregaData);
      
      if (result.success) {
        return res.status(201).json({ 
          message: result.message,
          id: result.id
        });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao registrar entrega:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar entregas por funcionário
  static async listarPorFuncionario(req, res) {
    try {
      const { id_funcionario } = req.params;
      const result = await EntregasEpi.findByFuncionario(id_funcionario);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar entregas por funcionário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar entregas por EPI
  static async listarPorEpi(req, res) {
    try {
      const { id_epi } = req.params;
      const result = await EntregasEpi.findByEpi(id_epi);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar entregas por EPI:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar entregas por tipo
  static async listarPorTipo(req, res) {
    try {
      const { tipo } = req.params;
      const tiposValidos = ['Entrega', 'Troca', 'Devolucao'];
      
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ 
          error: 'Tipo de entrega inválido. Utilize: Entrega, Troca ou Devolucao' 
        });
      }
      
      const result = await EntregasEpi.findByTipo(tipo);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar entregas por tipo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default EntregasController;
