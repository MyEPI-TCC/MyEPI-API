// src/controllers/ModeloEpiController.js
import ModeloEpi from "../models/ModeloEpi.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper para obter o caminho do diretório de uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadFolder = path.resolve(__dirname, "..", "..", "uploads");

class ModeloEpiController {
  // Listar todos os EPIs
  static async listarEpis(req, res) {
    try {
      const result = await ModeloEpi.findAll();

      if (result.success) {
        // Adiciona o caminho completo da URL para a foto, se existir
        const dataWithFullPath = result.data.map((epi) => ({
          ...epi,
          foto_epi_url: epi.foto_epi_path
            ? `${req.protocol}://${req.get("host")}/uploads/${epi.foto_epi_path}`
            : null,
        }));
        return res.status(200).json(dataWithFullPath);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error("Erro ao listar EPIs:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Buscar EPI pelo ID
  static async buscarEpi(req, res) {
    try {
      const { id } = req.params;
      const result = await ModeloEpi.findById(id);

      if (result.success) {
        // Adiciona o caminho completo da URL para a foto, se existir
        const dataWithFullPath = {
          ...result.data,
          foto_epi_url: result.data.foto_epi_path
            ? `${req.protocol}://${req.get("host")}/uploads/${result.data.foto_epi_path}`
            : null,
        };
        return res.status(200).json(dataWithFullPath);
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error("Erro ao buscar EPI:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Criar EPI
  static async criarEpi(req, res) {
    try {
      console.log('req.body:', req.body); // Debug
      console.log('req.file:', req.file); // Debug
      
      // Quando usando multer com multipart/form-data, os dados vêm em req.body
      const epiData = req.body;
      const fotoFile = req.file; // Arquivo da foto enviado via multer

      // Converter strings para valores corretos
      const dadosProcessados = {
        nome_epi: epiData.nome_epi,
        quantidade: parseInt(epiData.quantidade),
        descartavel: epiData.descartavel === 'true' || epiData.descartavel === true ? 1 : 0,
        rastreavel: epiData.rastreavel === 'true' || epiData.rastreavel === true ? 1 : 0,
        descricao_epi: epiData.descricao_epi || null,
        id_marca: parseInt(epiData.id_marca),
        id_categoria: parseInt(epiData.id_categoria)
      };

      // Verificação básica dos dados necessários
      if (
        !dadosProcessados.nome_epi ||
        isNaN(dadosProcessados.quantidade) ||
        dadosProcessados.descartavel === undefined ||
        dadosProcessados.rastreavel === undefined ||
        isNaN(dadosProcessados.id_marca) ||
        isNaN(dadosProcessados.id_categoria)
      ) {
        // Se a validação falhar e um arquivo foi enviado, excluí-lo
        if (fotoFile) {
          fs.unlinkSync(fotoFile.path);
        }
        return res.status(400).json({
          error: "Dados incompletos. Forneça todos os campos obrigatórios.",
          dadosRecebidos: epiData
        });
      }

      // Obtém o nome do arquivo da foto, se existir
      const fotoPath = fotoFile ? fotoFile.filename : null;

      const result = await ModeloEpi.create(dadosProcessados, fotoPath);

      if (result.success) {
        return res.status(201).json({
          message: result.message,
          id: result.id,
        });
      } else {
        // Se a criação no banco falhar e um arquivo foi enviado, excluí-lo
        if (fotoFile) {
          fs.unlinkSync(fotoFile.path);
        }
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error("Erro ao criar EPI:", error);
      // Se ocorrer um erro geral e um arquivo foi enviado, excluí-lo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Atualizar EPI
  static async atualizarEpi(req, res) {
    let oldFotoPath = null;
    try {
      const { id } = req.params;
      const epiData = req.body;
      const fotoFile = req.file; // Novo arquivo da foto, se enviado

      // Converter strings para valores corretos
      const dadosProcessados = {
        nome_epi: epiData.nome_epi,
        quantidade: parseInt(epiData.quantidade),
        descartavel: epiData.descartavel === 'true' || epiData.descartavel === true ? 1 : 0,
        rastreavel: epiData.rastreavel === 'true' || epiData.rastreavel === true ? 1 : 0,
        descricao_epi: epiData.descricao_epi || null,
        id_marca: parseInt(epiData.id_marca),
        id_categoria: parseInt(epiData.id_categoria)
      };

      // Verificação básica dos dados necessários
      if (
        !dadosProcessados.nome_epi ||
        isNaN(dadosProcessados.quantidade) ||
        dadosProcessados.descartavel === undefined ||
        dadosProcessados.rastreavel === undefined ||
        isNaN(dadosProcessados.id_marca) ||
        isNaN(dadosProcessados.id_categoria)
      ) {
        // Se a validação falhar e um novo arquivo foi enviado, excluí-lo
        if (fotoFile) {
          fs.unlinkSync(fotoFile.path);
        }
        return res.status(400).json({
          error: "Dados incompletos. Forneça todos os campos obrigatórios.",
        });
      }

      // Buscar dados antigos para obter o caminho da foto antiga, se existir
      const epiAntigoResult = await ModeloEpi.findById(id);
      if (epiAntigoResult.success && epiAntigoResult.data.foto_epi_path) {
        oldFotoPath = epiAntigoResult.data.foto_epi_path;
      }

      // Define o caminho da foto para atualização:
      // - Se uma nova foto foi enviada, usa o novo filename.
      // - Se nenhuma nova foto foi enviada, mantém o valor antigo (passa undefined para o model não alterar).
      const fotoPathParaAtualizar = fotoFile ? fotoFile.filename : undefined;

      const result = await ModeloEpi.update(id, dadosProcessados, fotoPathParaAtualizar);

      if (result.success) {
        // Se a atualização foi bem-sucedida e uma nova foto foi enviada,
        // e existia uma foto antiga, excluir a foto antiga.
        if (fotoFile && oldFotoPath) {
          const fullOldPath = path.join(uploadFolder, oldFotoPath);
          if (fs.existsSync(fullOldPath)) {
            fs.unlinkSync(fullOldPath);
            console.log(`Foto antiga excluída: ${oldFotoPath}`);
          }
        }
        return res.status(200).json({ message: result.message });
      } else {
        // Se a atualização no banco falhar e um novo arquivo foi enviado, excluí-lo
        if (fotoFile) {
          fs.unlinkSync(fotoFile.path);
        }
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error("Erro ao atualizar EPI:", error);
      // Se ocorrer um erro geral e um novo arquivo foi enviado, excluí-lo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Excluir EPI
  static async excluirEpi(req, res) {
    try {
      const { id } = req.params;

      // Buscar dados para obter o caminho da foto antes de excluir
      const epiAntigoResult = await ModeloEpi.findById(id);
      let fotoPathParaExcluir = null;
      if (epiAntigoResult.success && epiAntigoResult.data.foto_epi_path) {
        fotoPathParaExcluir = epiAntigoResult.data.foto_epi_path;
      }

      const result = await ModeloEpi.delete(id);

      if (result.success) {
        // Se a exclusão no banco foi bem-sucedida e existia uma foto, excluir o arquivo
        if (fotoPathParaExcluir) {
          const fullPath = path.join(uploadFolder, fotoPathParaExcluir);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Foto excluída: ${fotoPathParaExcluir}`);
          }
        }
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(404).json({ error: result.error });
      }
    } catch (error) {
      console.error("Erro ao excluir EPI:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar EPIs por categoria
  static async listarPorCategoria(req, res) {
    try {
      const { id_categoria } = req.params;
      const result = await ModeloEpi.findByCategoria(id_categoria);

      if (result.success) {
        // Adiciona o caminho completo da URL para a foto, se existir
        const dataWithFullPath = result.data.map((epi) => ({
          ...epi,
          foto_epi_url: epi.foto_epi_path
            ? `${req.protocol}://${req.get("host")}/uploads/${epi.foto_epi_path}`
            : null,
        }));
        return res.status(200).json(dataWithFullPath);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error("Erro ao listar EPIs por categoria:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar EPIs por cargo
  static async listarPorCargo(req, res) {
    try {
      const { id_cargo } = req.params;
      const result = await ModeloEpi.findByCargo(id_cargo);

      if (result.success) {
        // Adiciona o caminho completo da URL para a foto, se existir
        const dataWithFullPath = result.data.map((epi) => ({
          ...epi,
          foto_epi_url: epi.foto_epi_path
            ? `${req.protocol}://${req.get("host")}/uploads/${epi.foto_epi_path}`
            : null,
        }));
        return res.status(200).json(dataWithFullPath);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error("Erro ao listar EPIs por cargo:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default ModeloEpiController;