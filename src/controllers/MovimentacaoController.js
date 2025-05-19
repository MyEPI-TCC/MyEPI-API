// src/controllers/MovimentacaoController.js
import MovimentacaoEstoque from '../models/MovimentacaoEstoque.js';

class MovimentacaoController {
  // Listar todas as movimentações
  static async listarMovimentacoes(req, res) {
    try {
      const result = await MovimentacaoEstoque.findAll();
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar movimentações:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Buscar movimentação pelo ID
  static async buscarMovimentacao(req, res) {
    try {
      const { id } = req.params;
      const result = await MovimentacaoEstoque.findById(id);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao buscar movimentação:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Registrar movimentação
  static async registrarMovimentacao(req, res) {
    try {
      const movimentacaoData = req.body;
      
      // Verificação básica dos dados necessários
      if (!movimentacaoData.tipo_movimentacao || !movimentacaoData.data || 
          !movimentacaoData.hora || !movimentacaoData.quantidade || 
          !movimentacaoData.id_funcionario || !movimentacaoData.id_modelo_epi || 
          !movimentacaoData.id_estoque_lote) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Forneça todos os campos obrigatórios.' 
        });
      }
      
      const result = await MovimentacaoEstoque.create(movimentacaoData);
      
      if (result.success) {
        return res.status(201).json({ 
          message: result.message,
          id: result.id
        });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar movimentações por funcionário
  static async listarPorFuncionario(req, res) {
    try {
      const { id_funcionario } = req.params;
      const result = await MovimentacaoEstoque.findByFuncionario(id_funcionario);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar movimentações por funcionário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar movimentações por EPI
  static async listarPorEpi(req, res) {
    try {
      const { id_epi } = req.params;
      const result = await MovimentacaoEstoque.findByEpi(id_epi);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar movimentações por EPI:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar movimentações por tipo
  static async listarPorTipo(req, res) {
    try {
      const { tipo } = req.params;
      const tiposValidos = ['Entrega', 'Troca', 'Devolucao'];
      
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ 
          error: 'Tipo de movimentação inválido. Utilize: Entrega, Troca ou Devolucao' 
        });
      }
      
      const result = await MovimentacaoEstoque.findByTipo(tipo);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar movimentações por tipo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default MovimentacaoController;