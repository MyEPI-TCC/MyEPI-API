// src/models/EntregasEpi.js
import { pool } from '../config/database.js';

class EntregasEpi {
  // Buscar todas as entregas
  static async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         ORDER BY e.data DESC, e.hora DESC`
      );
      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas de EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar uma entrega pelo ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return { success: false, error: 'Entrega não encontrada' };
      }

      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Erro ao buscar entrega por ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Registrar uma nova entrega
   static async create(entregaData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        tipo_movimentacao,
        data,
        hora,
        quantidade,
        descricao,
        id_funcionario,
        id_modelo_epi,
        id_estoque_lote,
      } = entregaData;

      // Converte quantidade para inteiro e valida
      const quantidadeInt = parseInt(quantidade, 10);
      if (isNaN(quantidadeInt) || quantidadeInt <= 0) {
        await connection.rollback();
        return { success: false, error: 'Quantidade inválida' };
      }

      console.log('Tipo movimentação:', tipo_movimentacao);
      console.log('Quantidade recebida:', quantidadeInt);

      // 1. Verificar estoque disponível no LOTE
      const [estoqueLoteResult] = await connection.query(
        'SELECT quantidade_estoque FROM ESTOQUE_LOTE WHERE id_estoque_lote = ?',
        [id_estoque_lote]
      );

      if (estoqueLoteResult.length === 0) {
        await connection.rollback();
        return { success: false, error: 'Lote de estoque não encontrado' };
      }

      const estoqueAtualLote = estoqueLoteResult[0].quantidade_estoque;

      console.log('Estoque atual do lote:', estoqueAtualLote);

      // Verificar se há estoque suficiente no LOTE (para entregas)
      if (tipo_movimentacao === 'Entrega' && estoqueAtualLote < quantidadeInt) {
        await connection.rollback();
        return { success: false, error: 'Quantidade insuficiente em estoque no lote' };
      }

      // 2. Inserir a movimentação
      const [result] = await connection.query(
        `INSERT INTO MOVIMENTACAO_ESTOQUE (
          tipo_movimentacao,
          data,
          hora,
          quantidade,
          descricao,
          id_funcionario,
          id_modelo_epi,
          id_estoque_lote
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tipo_movimentacao,
          data,
          hora,
          quantidadeInt,
          descricao,
          id_funcionario,
          id_modelo_epi,
          id_estoque_lote,
        ]
      );

      // 3. Atualizar a quantidade no ESTOQUE_LOTE
      let novaQuantidadeLote;
      if (tipo_movimentacao === 'Entrega') {
        novaQuantidadeLote = estoqueAtualLote - quantidadeInt;
      } else if (tipo_movimentacao === 'Devolucao' || tipo_movimentacao === 'Entrada') { // Adicione 'Entrada' aqui se for um tipo de movimentação de entrada de estoque
        novaQuantidadeLote = estoqueAtualLote + quantidadeInt;
      } else {
        novaQuantidadeLote = estoqueAtualLote; // Troca ou outros tipos não alteram estoque no lote
      }

      console.log('Nova quantidade calculada para o lote:', novaQuantidadeLote);

      await connection.query(
        'UPDATE ESTOQUE_LOTE SET quantidade_estoque = ? WHERE id_estoque_lote = ?',
        [novaQuantidadeLote, id_estoque_lote]
      );

      // 4. Atualizar a quantidade total no MODELO_EPI
      let operador = '';
      if (tipo_movimentacao === 'Entrega') {
        operador = '-';
      } else if (tipo_movimentacao === 'Devolucao' || tipo_movimentacao === 'Entrada') { // Se "Entrada" também afeta o total do modelo
        operador = '+';
      } else {
        // Para "Troca" ou outros tipos que não alteram o estoque total do modelo
        // Não fazemos nada na tabela MODELO_EPI, ou você pode adicionar uma lógica específica
        operador = null;
      }

      if (operador) { // Só atualiza se for uma Entrega, Devolucao ou Entrada
        await connection.query(
          `UPDATE MODELO_EPI SET quantidade = quantidade ${operador} ? WHERE id_modelo_epi = ?`,
          [quantidadeInt, id_modelo_epi]
        );
        console.log(`Quantidade do MODELO_EPI atualizada: ${operador}${quantidadeInt} para id ${id_modelo_epi}`);
      }

      // Se for rastreável, lógica para atualizar status do EPI (se necessário)
      const [epiResult] = await connection.query(
        'SELECT rastreavel FROM MODELO_EPI WHERE id_modelo_epi = ?',
        [id_modelo_epi]
      );

      if (epiResult[0]?.rastreavel === 1) {
        // Implementar lógica para EPIs rastreáveis, se houver,
        // por exemplo, atualizar o status de itens individuais em uma tabela de EPIs rastreáveis.
        // Se essa lógica ainda não existe, pode deixar este bloco vazio ou com um TODO.
      }

      await connection.commit(); // Confirma todas as operações

      return {
        success: true,
        message: 'Movimentação de estoque registrada com sucesso e quantidade do modelo atualizada.',
        id: result.insertId,
      };
    } catch (error) {
      await connection.rollback(); // Desfaz todas as operações em caso de erro
      console.error('Erro ao registrar movimentação de estoque:', error);
      return { success: false, error: error.message };
    } finally {
      connection.release(); // Libera a conexão
    }
  }

  // Buscar entregas por funcionário
  static async findByFuncionario(funcionarioId) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.id_funcionario = ?
         ORDER BY e.data DESC, e.hora DESC`,
        [funcionarioId]
      );

      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas por funcionário:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar entregas por EPI
  static async findByEpi(epiId) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.id_modelo_epi = ?
         ORDER BY e.data DESC, e.hora DESC`,
        [epiId]
      );

      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas por EPI:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar entregas por tipo
  static async findByTipo(tipo) {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, f.nome_funcionario, m.nome_epi
         FROM MOVIMENTACAO_ESTOQUE e
         JOIN FUNCIONARIO f ON e.id_funcionario = f.id_funcionario
         JOIN MODELO_EPI m ON e.id_modelo_epi = m.id_modelo_epi
         WHERE e.tipo_movimentacao = ?
         ORDER BY e.data DESC, e.hora DESC`,
        [tipo]
      );

      return { success: true, data: rows };
    } catch (error) {
      console.error('Erro ao buscar entregas por tipo:', error);
      return { success: false, error: error.message };
    }
  }
}

export default EntregasEpi;
