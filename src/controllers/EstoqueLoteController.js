import EstoqueLote from '../models/EstoqueLote.js';
import Remessa from '../models/Remessa.js';
import ModeloEpi from '../models/ModeloEpi.js';

class EstoqueLoteController {
  // Método para listar todos os lotes em estoque
  static async listarEstoque(req, res) {
    try {
      const result = await EstoqueLote.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para atualizar a quantidade de um lote em estoque
  static async atualizarEstoque(req, res) {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;

      if (quantidade === undefined) return res.status(400).json({ error: 'Quantidade obrigatória.' });

      const result = await EstoqueLote.update(id, { quantidade_estoque: quantidade });
      return res.status(result.success ? 200 : 404).json(result.success ? { message: result.message } : { error: result.error });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para buscar um lote específico em estoque
  static async buscarEstoqueLote(req, res) {
    try {
      const { id } = req.params;
      const result = await EstoqueLote.findById(id);
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }
      
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para criar um novo lote em estoque
  static async criarEstoqueLote(req, res) {
    try {
      const { quantidade_estoque, id_remessa } = req.body;
      
      if (!quantidade_estoque || !id_remessa) {
        return res.status(400).json({ error: 'Dados insuficientes. Quantidade de estoque e ID da remessa são obrigatórios.' });
      }
      
      // Verificar se a remessa existe
      const remessaResult = await Remessa.findById(id_remessa);
      if (!remessaResult.success) {
        return res.status(404).json({ error: 'Remessa não encontrada' });
      }
      
      const novoEstoque = {
        quantidade_estoque,
        id_remessa
      };
      
      const result = await EstoqueLote.create(novoEstoque);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      return res.status(201).json({ message: 'Estoque criado com sucesso', data: result.data });
    } catch (error) {
      console.error('Erro ao criar estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para excluir um lote em estoque
  static async excluirEstoqueLote(req, res) {
    try {
      const { id } = req.params;
      const result = await EstoqueLote.delete(id);
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }
      
      return res.status(200).json({ message: 'Estoque excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para listar estoque por remessa
  static async listarPorRemessa(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se a remessa existe
      const remessaResult = await Remessa.findById(id);
      if (!remessaResult.success) {
        return res.status(404).json({ error: 'Remessa não encontrada' });
      }
      
      const result = await EstoqueLote.findByRemessa(id);
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }
      
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Erro ao listar estoque por remessa:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para listar estoque por modelo de EPI
  static async listarPorModeloEpi(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o modelo de EPI existe
      const modeloResult = await ModeloEpi.findById(id);
      if (!modeloResult.success) {
        return res.status(404).json({ error: 'Modelo de EPI não encontrado' });
      }
      
      const result = await EstoqueLote.findByModeloEpi(id);
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }
      
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Erro ao listar estoque por modelo de EPI:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para listar lotes próximos ao vencimento
  static async listarProximosVencimento(req, res) {
    try {
      // Por padrão, consideramos próximo ao vencimento EPIs com menos de 30 dias para vencer
      // mas podemos aceitar um parâmetro opcional de dias
      const { dias = 30 } = req.query;
      
      const result = await EstoqueLote.findProximosVencimento(parseInt(dias));
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }
      
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Erro ao listar próximos ao vencimento:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Método para listar lotes com baixo estoque
  static async listarBaixoEstoque(req, res) {
    try {
      // Por padrão, consideramos baixo estoque quando há menos de 10 unidades
      // mas podemos aceitar um parâmetro opcional de quantidade mínima
      const { minimo = 10 } = req.query;
      
      const result = await EstoqueLote.findBaixoEstoque(parseInt(minimo));
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }
      
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Erro ao listar baixo estoque:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default EstoqueLoteController;