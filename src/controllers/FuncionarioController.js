// src/controllers/FuncionarioController.js (Adaptado)
import Funcionario from "../models/Funcionario.js";

class FuncionarioController {
    // Listar funcionários (com suporte a busca por número de matrícula)
    static async listarFuncionarios(req, res) {
        try {
            const { numero_matricula } = req.query; // Busca por numero_matricula
            let result;

            if (numero_matricula) {
                // Busca específica por número de matrícula
                result = await Funcionario.findByNumeroMatricula(numero_matricula);
            } else {
                // Busca todos os funcionários
                result = await Funcionario.findAll();
            }

            if (result.success) {
                // Se buscou por matrícula e não encontrou, retorna array vazio (HTTP 200)
                // Se encontrou, retorna array com um elemento
                // Se buscou todos, retorna array completo
                return res.status(200).json(result.data);
            } else {
                // Erro interno do model
                return res.status(500).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao listar funcionários:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
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
                // Se erro for "não encontrado", retorna 404, senão 500
                const statusCode = result.error === "Funcionário não encontrado" ? 404 : 500;
                return res.status(statusCode).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao buscar funcionário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // Criar funcionário
    static async criarFuncionario(req, res) {
        try {
            const funcionarioData = req.body;

            // Validação básica (adapte conforme suas regras de negócio)
            if (!funcionarioData.nome_funcionario || !funcionarioData.numero_matricula || !funcionarioData.cpf || !funcionarioData.dt_nascimento || !funcionarioData.dt_admissao || !funcionarioData.tipo_sanguineo || !funcionarioData.id_cargo || !funcionarioData.id_empresa) {
                return res.status(400).json({ error: "Dados incompletos para criar funcionário." });
            }

            const result = await Funcionario.create(funcionarioData);

            if (result.success) {
                return res.status(201).json({ message: "Funcionário criado com sucesso", id: result.id });
            } else {
                // Pode ser erro de duplicação de chave única (matrícula, cpf), etc.
                return res.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao criar funcionário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // Atualizar funcionário
    static async atualizarFuncionario(req, res) {
        try {
            const { id } = req.params;
            const funcionarioData = req.body;

             // Validação básica (adapte conforme suas regras de negócio)
             if (!funcionarioData.nome_funcionario || !funcionarioData.numero_matricula || !funcionarioData.cpf || !funcionarioData.dt_nascimento || !funcionarioData.dt_admissao || !funcionarioData.tipo_sanguineo || !funcionarioData.id_cargo || !funcionarioData.id_empresa) {
                return res.status(400).json({ error: "Dados incompletos para atualizar funcionário." });
            }

            const result = await Funcionario.update(id, funcionarioData);

            if (result.success) {
                return res.status(200).json({ message: result.message });
            } else {
                 // Se erro for "não encontrado", retorna 404, senão 400 (ex: erro de validação, duplicação)
                const statusCode = result.error.includes("não encontrado") ? 404 : 400;
                return res.status(statusCode).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
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
                 // Se erro for "não encontrado", retorna 404, senão 400 (ex: chave estrangeira)
                const statusCode = result.error.includes("não encontrado") ? 404 : (result.error.includes("associado a outros registros") ? 409 : 400);
                return res.status(statusCode).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // Listar por cargo
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
            console.error("Erro ao listar funcionários por cargo:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

export default FuncionarioController;

