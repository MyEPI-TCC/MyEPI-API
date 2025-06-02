// src/models/Funcionario.js (Adaptado com base no seu original e schema)
import { pool } from "../config/database.js";

class Funcionario {
    // Buscar todos os funcionários
    static async findAll() {
        try {
            // Adicionado f.id_empresa ao SELECT
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario, f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa, c.nome_cargo 
                 FROM FUNCIONARIO f 
                 JOIN CARGO c ON f.id_cargo = c.id_cargo 
                 ORDER BY f.nome_funcionario ASC`
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
            return { success: false, error: error.message };
        }
    }

    // Buscar um funcionário pelo ID
    static async findById(id) {
        try {
             // Adicionado f.id_empresa ao SELECT
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario, f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa, c.nome_cargo 
                 FROM FUNCIONARIO f 
                 JOIN CARGO c ON f.id_cargo = c.id_cargo 
                 WHERE f.id_funcionario = ?`,
                [id]
            );

            if (rows.length === 0) {
                return { success: false, error: "Funcionário não encontrado" };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error("Erro ao buscar funcionário por ID:", error);
            return { success: false, error: error.message };
        }
    }

    // Buscar funcionário pelo Número da Matrícula (Adicionado para o scanner)
    static async findByNumeroMatricula(numeroMatricula) {
        try {
             // Adicionado f.id_empresa ao SELECT
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario, f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa, c.nome_cargo 
                 FROM FUNCIONARIO f 
                 JOIN CARGO c ON f.id_cargo = c.id_cargo 
                 WHERE f.numero_matricula = ?`,
                [numeroMatricula]
            );
            // Retorna um array (vazio se não encontrado, ou com um elemento se encontrado)
            return { success: true, data: rows };
        } catch (error) {
            console.error("Erro ao buscar funcionário por matrícula:", error);
            return { success: false, error: error.message };
        }
    }

    // Criar um novo funcionário
    static async create(funcionarioData) {
        // Removido 'setor', adicionado 'id_empresa' para alinhar com o schema
        const {
            nome_funcionario,
            numero_matricula,
            sobrenome_funcionario,
            cpf,
            dt_nascimento,
            dt_admissao,
            tipo_sanguineo,
            id_cargo,
            id_empresa // Adicionado
        } = funcionarioData;
        try {
            const [result] = await pool.query(
                `INSERT INTO FUNCIONARIO (
                  nome_funcionario, 
                  numero_matricula, 
                  sobrenome_funcionario, 
                  cpf, 
                  dt_nascimento, 
                  dt_admissao, 
                  tipo_sanguineo, 
                  id_cargo,
                  id_empresa 
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome_funcionario,
                    numero_matricula,
                    sobrenome_funcionario,
                    cpf,
                    dt_nascimento,
                    dt_admissao,
                    tipo_sanguineo,
                    id_cargo,
                    id_empresa // Adicionado
                ]
            );

            return {
                success: true,
                message: "Funcionário criado com sucesso",
                id: result.insertId,
            };
        } catch (error) {
            console.error("Erro ao criar funcionário:", error);
            return { success: false, error: error.message };
        }
    }

    // Atualizar um funcionário
    static async update(id, funcionarioData) {
         // Removido 'setor', adicionado 'id_empresa' para alinhar com o schema
        const {
            nome_funcionario,
            numero_matricula,
            sobrenome_funcionario,
            cpf,
            dt_nascimento,
            dt_admissao,
            tipo_sanguineo,
            id_cargo,
            id_empresa // Adicionado
        } = funcionarioData;
        try {
            const [result] = await pool.query(
                `UPDATE FUNCIONARIO SET 
                  nome_funcionario = ?, 
                  numero_matricula = ?, 
                  sobrenome_funcionario = ?, 
                  cpf = ?, 
                  dt_nascimento = ?, 
                  dt_admissao = ?, 
                  tipo_sanguineo = ?, 
                  id_cargo = ?, 
                  id_empresa = ? 
                 WHERE id_funcionario = ?`,
                [
                    nome_funcionario,
                    numero_matricula,
                    sobrenome_funcionario,
                    cpf,
                    dt_nascimento,
                    dt_admissao,
                    tipo_sanguineo,
                    id_cargo,
                    id_empresa, // Adicionado
                    id,
                ]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: "Funcionário não encontrado" };
            }

            return {
                success: true,
                message: "Funcionário atualizado com sucesso",
            };
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            return { success: false, error: error.message };
        }
    }

    // Excluir um funcionário
    static async delete(id) {
        try {
            const [result] = await pool.query(
                "DELETE FROM FUNCIONARIO WHERE id_funcionario = ?",
                [id]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: "Funcionário não encontrado" };
            }

            return {
                success: true,
                message: "Funcionário excluído com sucesso",
            };
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
             // Adicionado tratamento para chave estrangeira
             if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                 return { success: false, error: "Não é possível excluir o funcionário pois ele está associado a outros registros (ex: entregas)." };
             }
            return { success: false, error: error.message };
        }
    }

    // Buscar funcionários por cargo
    static async findByCargo(cargoId) {
        try {
            // Adicionado f.id_empresa ao SELECT
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario, f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa, c.nome_cargo 
                 FROM FUNCIONARIO f 
                 JOIN CARGO c ON f.id_cargo = c.id_cargo 
                 WHERE f.id_cargo = ? 
                 ORDER BY f.nome_funcionario ASC`,
                [cargoId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error("Erro ao buscar funcionários por cargo:", error);
            return { success: false, error: error.message };
        }
    }
}

export default Funcionario;

