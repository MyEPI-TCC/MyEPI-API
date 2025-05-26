import Remessa from '../models/Remessa.js';

// Listar todas as remessas
export const getAllRemessas = async (req, res) => {
  try {
    const remessas = await Remessa.findAll();
    res.status(200).json(remessas);
  } catch (error) {
    console.error('Erro ao buscar remessas:', error);
    res.status(500).json({ message: 'Erro ao buscar remessas', error: error.message });
  }
};

// Buscar remessa por ID
export const getRemessaById = async (req, res) => {
  try {
    const id = req.params.id;
    const remessa = await Remessa.findById(id);

    if (!remessa) {
      return res.status(404).json({ message: 'Remessa não encontrada' });
    }

    res.status(200).json(remessa);
  } catch (error) {
    console.error(`Erro ao buscar remessa ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar remessa', error: error.message });
  }
};

// Buscar remessas por fornecedor
export const getRemessasByFornecedor = async (req, res) => {
  try {
    const idFornecedor = req.params.id;
    const remessas = await Remessa.findByFornecedor(idFornecedor);

    res.status(200).json(remessas);
  } catch (error) {
    console.error(`Erro ao buscar remessas do fornecedor ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar remessas do fornecedor', error: error.message });
  }
};

// Buscar remessas por modelo de EPI
export const getRemessasByModeloEpi = async (req, res) => {
  try {
    const idModeloEpi = req.params.id;
    const remessas = await Remessa.findByModeloEpi(idModeloEpi);

    res.status(200).json(remessas);
  } catch (error) {
    console.error(`Erro ao buscar remessas do modelo EPI ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar remessas do modelo EPI', error: error.message });
  }
};

// Criar nova remessa
export const createRemessa = async (req, res) => {
  try {
    // Validação ajustada
    const {
      codigo_lote, quantidade, data_entrega,
      validade_lote, nota_fiscal, id_fornecedor, id_modelo_epi, id_ca
      // observacoes é opcional
    } = req.body;

    // Adicione codigo_lote à validação
    if (!codigo_lote || !quantidade || !data_entrega || !validade_lote || !nota_fiscal
      || !id_fornecedor || !id_modelo_epi || !id_ca) {
      return res.status(400).json({ success: false, message: 'Todos os campos obrigatórios devem ser fornecidos' });
    }

    // Chama a função create
    const result = await Remessa.create(req.body);

    // Verifica o resultado da função create
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data // Retorna os IDs criados
      });
    } else {
      // Se Remessa.create retornar um erro controlado
      res.status(500).json({ success: false, message: result.error || 'Erro interno ao criar remessa' });
    }

  } catch (error) {
    console.error('Erro no controller ao criar remessa:', error);
    res.status(500).json({ success: false, message: 'Erro inesperado no servidor ao criar remessa', error: error.message });
  }
};


// Atualizar remessa existente
export const updateRemessa = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar se remessa existe
    const remessaExistente = await Remessa.findById(id);
    if (!remessaExistente) {
      return res.status(404).json({ message: 'Remessa não encontrada' });
    }

    // Validação básica
    const {
      codigo_lote, quantidade, data_entrega,
      validade_lote, nota_fiscal, id_fornecedor, id_modelo_epi, id_ca
    } = req.body;

    if (!quantidade || !data_entrega || !validade_lote || !nota_fiscal
      || !id_fornecedor || !id_modelo_epi || !id_ca) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser fornecidos' });
    }

    const result = await Remessa.update(id, req.body);

    res.status(200).json({
      message: 'Remessa atualizada com sucesso',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error(`Erro ao atualizar remessa ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar remessa', error: error.message });
  }
};

// Excluir remessa
export const deleteRemessa = async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar se remessa existe
    const remessaExistente = await Remessa.findById(id);
    if (!remessaExistente) {
      return res.status(404).json({ message: 'Remessa não encontrada' });
    }

    const result = await Remessa.delete(id);

    res.status(200).json({
      message: 'Remessa excluída com sucesso',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error(`Erro ao excluir remessa ID ${req.params.id}:`, error);

    // Verificar se é o erro específico de movimentações vinculadas
    if (error.message.includes('movimentações de estoque vinculadas')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Erro ao excluir remessa', error: error.message });
  }
};