// src/controllers/FuncionarioController.js
import Funcionario from '../models/Funcionario.js';

class FuncionarioController {
  // Listar todos os funcionários
  static async listarFuncionarios(req, res) {
    try {
      const result = await Funcionario.findAll();
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Buscar funcionário pelo ID
  static async buscarFuncionario(req, res) {
    try {
      const { id } = req.params;
      const result = await Funcionario.findById(id);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Criar funcionário
  static async criarFuncionario(req, res) {
    try {
      const funcionarioData = req.body;
      
      // Verificação básica dos dados necessários
      if (!funcionarioData.nome_funcionario || !funcionarioData.numero_matricula || 
          !funcionarioData.dt_nascimento || !funcionarioData.dt_admissao || 
          !funcionarioData.tipo_sanguineo || !funcionarioData.id_cargo) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Forneça todos os campos obrigatórios.' 
        });
      }
      
      const result = await Funcionario.create(funcionarioData);
      
      if (result.success) {
        return res.status(201).json({ 
          message: result.message,
          id: result.id
        });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Atualizar funcionário
  static async atualizarFuncionario(req, res) {
    try {
      const { id } = req.params;
      const funcionarioData = req.body;
      
      // Verificação básica dos dados necessários
      if (!funcionarioData.nome_funcionario || !funcionarioData.numero_matricula || 
          !funcionarioData.dt_nascimento || !funcionarioData.dt_admissao || 
          !funcionarioData.tipo_sanguineo || !funcionarioData.id_cargo) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Forneça todos os campos obrigatórios.' 
        });
      }
      
      const result = await Funcionario.update(id, funcionarioData);
      
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Excluir funcionário
  static async excluirFuncionario(req, res) {
    try {
      const { id } = req.params;
      const result = await Funcionario.delete(id);
      
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  
  // Listar funcionários por cargo
  static async listarPorCargo(req, res) {
    try {
      const { id_cargo } = req.params;
      const result = await Funcionario.findByCargo(id_cargo);
      
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Erro ao listar funcionários por cargo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default FuncionarioController;