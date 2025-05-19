// src/models/EpiCargo.js
import { pool } from "../config/database.js";

class EpiCargo {
    // Buscar todas as associações entre EPI e cargo
    static async findAll() {
        try {
            const [rows] = await pool.query(
                `SELECT ec.*, me.nome_epi, c.nome_cargo
                FROM EPI_CARGO ec
                JOIN MODELO_EPI me ON ec.id_modelo_epi = me.id_modelo_epi
                JOIN CARGO c ON ec.id_cargo = c.id_cargo`
            );
            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar associações EPI-Cargo:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar por ID do EPI e ID do cargo
    static async findById(epiId, cargoId) {
        try {
            const [rows] = await pool.query(
                `SELECT ec.*, me.nome_epi, c.nome_cargo
                FROM EPI_CARGO ec
                JOIN MODELO_EPI me ON ec.id_modelo_epi = me.id_modelo_epi
                JOIN CARGO c ON ec.id_cargo = c.id_cargo
                WHERE ec.id_modelo_epi = ? AND ec.id_cargo = ?`,
                [epiId, cargoId]
            );

            if (rows.length === 0) {
                return { success: false, error: 'Associação EPI-Cargo não encontrada' };
            }

            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Erro ao buscar associação EPI-Cargo por IDs:', error);
            return { success: false, error: error.message };
        }
    }

    // Criar uma nova associação entre EPI e cargo
    static async create(epiCargoData) {
        try {
            const { id_modelo_epi, id_cargo } = epiCargoData;

            const [result] = await pool.query(
                'INSERT INTO EPI_CARGO (id_modelo_epi, id_cargo) VALUES (?, ?)',
                [id_modelo_epi, id_cargo]
            );

            return {
                success: true,
                message: 'Associação EPI-Cargo criada com sucesso'
            };
        } catch (error) {
            console.error('Erro ao criar associação EPI-Cargo:', error);
            return { success: false, error: error.message };
        }
    }

    // Excluir uma associação entre EPI e cargo
    static async delete(epiId, cargoId) {
        try {
            const [result] = await pool.query(
                'DELETE FROM EPI_CARGO WHERE id_modelo_epi = ? AND id_cargo = ?',
                [epiId, cargoId]
            );

            if (result.affectedRows === 0) {
                return { success: false, error: 'Associação EPI-Cargo não encontrada' };
            }

            return {
                success: true,
                message: 'Associação EPI-Cargo excluída com sucesso'
            };
        } catch (error) {
            console.error('Erro ao excluir associação EPI-Cargo:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar EPIs por cargo
    static async findEpisByCargo(cargoId) {
        try {
            const [rows] = await pool.query(
                `SELECT me.*, c.nome_cargo, m.nome_marca, cat.nome_categoria
                FROM EPI_CARGO ec
                JOIN MODELO_EPI me ON ec.id_modelo_epi = me.id_modelo_epi
                JOIN CARGO c ON ec.id_cargo = c.id_cargo
                JOIN MARCA m ON me.id_marca = m.id_marca
                JOIN CATEGORIA cat ON me.id_categoria = cat.id_categoria
                WHERE ec.id_cargo = ?`,
                [cargoId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar EPIs por cargo:', error);
            return { success: false, error: error.message };
        }
    }

    // Buscar cargos por EPI
    static async findCargosByEpi(epiId) {
        try {
            const [rows] = await pool.query(
                `SELECT c.*, me.nome_epi
                FROM EPI_CARGO ec
                JOIN CARGO c ON ec.id_cargo = c.id_cargo
                JOIN MODELO_EPI me ON ec.id_modelo_epi = me.id_modelo_epi
                WHERE ec.id_modelo_epi = ?`,
                [epiId]
            );

            return { success: true, data: rows };
        } catch (error) {
            console.error('Erro ao buscar cargos por EPI:', error);
            return { success: false, error: error.message };
        }
    }
}

export default EpiCargo;