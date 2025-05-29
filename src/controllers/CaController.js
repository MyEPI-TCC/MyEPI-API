import Ca from '../models/Ca.js';

class CaController {
  
  // Listar todos os CAs
  static async listarCas(req, res) {
    try {
      const result = await Ca.findAll();
      return res.status(result.success ? 200 : 500).json(result.success ? result.data : { error: result.error });
    } catch (error) {
      console.error('Erro ao listar CAs:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Criar um novo CA
  static async criarCa(req, res) {
    try {
      const { id_ca, numero_ca, validade_ca, data_emissao, ativo = 1, id_modelo_epi } = req.body;
      
      if (!numero_ca || !validade_ca || !id_modelo_epi) {
        return res.status(400).json({ 
          error: 'Dados obrigatórios ausentes: numero_ca, validade_ca e id_modelo_epi são obrigatórios.' 
        });
      }

      const result = await Ca.create({ 
        id_ca, 
        numero_ca, 
        validade_ca, 
        data_emissao, 
        ativo, 
        id_modelo_epi 
      });
      
      return res.status(result.success ? 201 : 400).json(
        result.success 
          ? { success: true, message: result.message, id: result.id } 
          : { success: false, error: result.error }
      );
    } catch (error) {
      console.error('Erro ao criar CA:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  // Buscar CA por ID
  static async buscarCaPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'ID é obrigatório' });
      }

      const result = await Ca.findById(id);
      return res.status(result.success ? 200 : 404).json(
        result.success 
          ? { success: true, data: result.data } 
          : { success: false, error: result.error }
      );
    } catch (error) {
      console.error('Erro ao buscar CA por ID:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  // Atualizar CA
  static async atualizarCa(req, res) {
    try {
      const { id } = req.params;
      const { numero_ca, validade_ca, data_emissao, ativo, id_modelo_epi } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'ID é obrigatório' });
      }

      if (!numero_ca || !validade_ca || !id_modelo_epi) {
        return res.status(400).json({ 
          success: false, 
          error: 'Dados obrigatórios ausentes: numero_ca, validade_ca e id_modelo_epi são obrigatórios.' 
        });
      }

      const result = await Ca.update(id, { 
        numero_ca, 
        validade_ca, 
        data_emissao, 
        ativo, 
        id_modelo_epi 
      });
      
      return res.status(result.success ? 200 : 404).json(
        result.success 
          ? { success: true, message: result.message } 
          : { success: false, error: result.error }
      );
    } catch (error) {
      console.error('Erro ao atualizar CA:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  // Excluir CA
  static async excluirCa(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'ID é obrigatório' });
      }

      const result = await Ca.delete(id);
      return res.status(result.success ? 200 : 404).json(
        result.success 
          ? { success: true, message: result.message } 
          : { success: false, error: result.error }
      );
    } catch (error) {
      console.error('Erro ao excluir CA:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  // Buscar CAs por modelo de EPI (NOVA FUNCIONALIDADE)
  static async buscarCasPorModelo(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'ID do modelo é obrigatório' });
      }

      const result = await Ca.findByModeloEpi(id);
      return res.status(result.success ? 200 : 500).json(
        result.success 
          ? { success: true, data: result.data } 
          : { success: false, error: result.error }
      );
    } catch (error) {
      console.error('Erro ao buscar CAs por modelo:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  // Buscar CAs ativos
  static async buscarCasAtivos(req, res) {
    try {
      const result = await Ca.findActiveCA();
      return res.status(result.success ? 200 : 500).json(
        result.success 
          ? { success: true, data: result.data } 
          : { success: false, error: result.error }
      );
    } catch (error) {
      console.error('Erro ao buscar CAs ativos:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  // Buscar CAs próximos do vencimento
  static async buscarCasProximosVencimento(req, res) {
    try {
      const { dias = 30 } = req.query; // Default 30 dias
      
      const result = await Ca.findExpiringCA(parseInt(dias));
      return res.status(result.success ? 200 : 500).json(
        result.success 
          ? { success: true, data: result.data } 
          : { success: false, error: result.error }
      );
    } catch (error) {
      console.error('Erro ao buscar CAs próximos do vencimento:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }

  // Buscar CA por número (para código de barras)
  static async buscarCaPorNumero(req, res) {
    try {
      const { numero } = req.params;
      
      if (!numero) {
        return res.status(400).json({ success: false, error: 'Número do CA é obrigatório' });
      }

      // Normaliza o número removendo pontos e espaços
      const numeroNormalizado = numero.replace(/[^\d]/g, '');
      
      const result = await Ca.findAll();
      
      if (result.success) {
        const caEncontrado = result.data.find(ca => {
          const caNumero = ca.numero_ca.replace(/[^\d]/g, '');
          return caNumero === numeroNormalizado;
        });
        
        if (caEncontrado) {
          return res.status(200).json({ success: true, data: caEncontrado });
        } else {
          return res.status(404).json({ success: false, error: 'CA não encontrado' });
        }
      } else {
        return res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      console.error('Erro ao buscar CA por número:', error);
      return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  }
}

export default CaController;