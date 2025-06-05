import { pool } from "../config/database.js";

class Funcionario {
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario,
                        f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa,
                        f.foto_perfil_path, c.nome_cargo
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

    static async findById(id) {
        try {
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario,
                        f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa,
                        f.foto_perfil_path, c.nome_cargo
                 FROM FUNCIONARIO f
                 JOIN CARGO c ON f.id_cargo = c.id_cargo
                 WHERE f.id_funcionario = ?`,
                [id]
            );
            if (rows.length === 0) return { success: false, error: "Funcionário não encontrado" };
            return { success: true, data: rows[0] };
        } catch (error) {
            console.error("Erro ao buscar funcionário por ID:", error);
            return { success: false, error: error.message };
        }
    }

    static async findByNumeroMatricula(numeroMatricula) {
        try {
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario,
                        f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa,
                        f.foto_perfil_path, c.nome_cargo
                 FROM FUNCIONARIO f
                 JOIN CARGO c ON f.id_cargo = c.id_cargo
                 WHERE f.numero_matricula = ?`,
                [numeroMatricula]
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error("Erro ao buscar por matrícula:", error);
            return { success: false, error: error.message };
        }
    }

    static async create(data) {
        const {
            nome_funcionario,
            numero_matricula,
            sobrenome_funcionario,
            cpf,
            dt_nascimento,
            dt_admissao,
            tipo_sanguineo,
            id_cargo,
            id_empresa,
            foto_perfil_path = null
        } = data;

        try {
            const [result] = await pool.query(
                `INSERT INTO FUNCIONARIO (
                    nome_funcionario, numero_matricula, sobrenome_funcionario, cpf,
                    dt_nascimento, dt_admissao, tipo_sanguineo, id_cargo, id_empresa,
                    foto_perfil_path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome_funcionario, numero_matricula, sobrenome_funcionario, cpf,
                    dt_nascimento, dt_admissao, tipo_sanguineo, id_cargo, id_empresa,
                    foto_perfil_path
                ]
            );
            return { success: true, message: "Funcionário criado com sucesso", id: result.insertId };
        } catch (error) {
            console.error("Erro ao criar funcionário:", error);
            return { success: false, error: error.message };
        }
    }

    static async update(id, data) {
        const {
            nome_funcionario,
            numero_matricula,
            sobrenome_funcionario,
            cpf,
            dt_nascimento,
            dt_admissao,
            tipo_sanguineo,
            id_cargo,
            id_empresa,
            foto_perfil_path = null
        } = data;

        try {
            const [result] = await pool.query(
                `UPDATE FUNCIONARIO SET 
                    nome_funcionario = ?, numero_matricula = ?, sobrenome_funcionario = ?, cpf = ?,
                    dt_nascimento = ?, dt_admissao = ?, tipo_sanguineo = ?, id_cargo = ?, id_empresa = ?,
                    foto_perfil_path = ?
                 WHERE id_funcionario = ?`,
                [
                    nome_funcionario, numero_matricula, sobrenome_funcionario, cpf,
                    dt_nascimento, dt_admissao, tipo_sanguineo, id_cargo, id_empresa,
                    foto_perfil_path, id
                ]
            );

            if (result.affectedRows === 0) return { success: false, error: "Funcionário não encontrado" };
            return { success: true, message: "Funcionário atualizado com sucesso" };
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            return { success: false, error: error.message };
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.query("DELETE FROM FUNCIONARIO WHERE id_funcionario = ?", [id]);
            if (result.affectedRows === 0) return { success: false, error: "Funcionário não encontrado" };
            return { success: true, message: "Funcionário excluído com sucesso" };
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return { success: false, error: "Funcionário está associado a outros registros" };
            }
            return { success: false, error: error.message };
        }
    }

    static async findByCargo(id_cargo) {
        try {
            const [rows] = await pool.query(
                `SELECT f.id_funcionario, f.nome_funcionario, f.numero_matricula, f.sobrenome_funcionario,
                        f.cpf, f.dt_nascimento, f.dt_admissao, f.tipo_sanguineo, f.id_cargo, f.id_empresa,
                        f.foto_perfil_path, c.nome_cargo
                 FROM FUNCIONARIO f
                 JOIN CARGO c ON f.id_cargo = c.id_cargo
                 WHERE f.id_cargo = ?
                 ORDER BY f.nome_funcionario ASC`,
                [id_cargo]
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error("Erro ao buscar por cargo:", error);
            return { success: false, error: error.message };
        }
    }
}

export default Funcionario;
