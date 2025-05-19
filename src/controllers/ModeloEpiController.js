// src/controllers/ModeloEpiController.js
import ModeloEpi from '../models/ModeloEpi.js';

class ModeloEpiController {
  // Listar todos os EPIs
  static async listarEpis(req, res) {
    try {
      const result = await ModeloEpi.findAll();
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar EPIs:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Buscar EPI pelo ID
  static async buscarEpi(req, res) {
    try {
      const { id } = req.params;
      const result = await ModeloEpi.findById(id);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao buscar EPI:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Criar EPI
  static async criarEpi(req, res) {
    try {
      const epiData = req.body;
      
      // Verificação básica dos dados necessários
      if (!epiData.nome_epi || !epiData.quantidade || 
          epiData.descartavel === undefined || epiData.rastreavel === undefined || 
          !epiData.id_marca || !epiData.id_categoria) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Forneça todos os campos obrigatórios.' 
        });
      }
      
      const result = await ModeloEpi.create(epiData);
      
      if (result.success) {
        return res.status(201).json({ 
          message: result.message,
          id: result.id
        });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao criar EPI:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Atualizar EPI
  static async atualizarEpi(req, res) {
    try {
      const { id } = req.params;
      const epiData = req.body;
      
      // Verificação básica dos dados necessários
      if (!epiData.nome_epi || !epiData.quantidade || 
          epiData.descartavel === undefined || epiData.rastreavel === undefined || 
          !epiData.id_marca || !epiData.id_categoria) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Forneça todos os campos obrigatórios.' 
        });
      }
      
      const result = await ModeloEpi.update(id, epiData);
      
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao atualizar EPI:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Excluir EPI
  static async excluirEpi(req, res) {
    try {
      const { id } = req.params;
      const result = await ModeloEpi.delete(id);
      
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao excluir EPI:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar EPIs por categoria
  static async listarPorCategoria(req, res) {
    try {
      const { id_categoria } = req.params;
      const result = await ModeloEpi.findByCategoria(id_categoria);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar EPIs por categoria:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar EPIs por cargo
  static async listarPorCargo(req, res) {
    try {
      const { id_cargo } = req.params;
      const result = await ModeloEpi.findByCargo(id_cargo);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar EPIs por cargo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default ModeloEpiController;