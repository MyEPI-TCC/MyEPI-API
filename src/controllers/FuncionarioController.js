
// /home/ubuntu/cadastro_funcionario/backend/FuncionarioController_example.js
import Funcionario from "../models/Funcionario.js";
import fs from 'fs'; // Import Node.js File System module for deleting old photos
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // To get __dirname in ES modules

// Helper function to get the uploads directory path
const getUploadDir = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Assumes uploads directory is at the root level relative to src/controllers
    return path.resolve(__dirname, '..', '..', 'uploads');
};

// Helper function to safely delete a file
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            // Log the error but don't block the response for this
            console.error(`Erro ao deletar arquivo antigo: ${filePath}`, err);
        }
    });
};

class FuncionarioController {
    // Listar funcionários (com suporte a busca por número de matrícula)
    static async listarFuncionarios(req, res) {
        try {
            const { numero_matricula } = req.query; // Busca por numero_matricula
            let result;

            if (numero_matricula) {
                result = await Funcionario.findByNumeroMatricula(numero_matricula);
            } else {
                result = await Funcionario.findAll();
            }

            if (result.success) {
                return res.status(200).json(result.data);
            } else {
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
                const statusCode = result.error === "Funcionário não encontrado" ? 404 : 500;
                return res.status(statusCode).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao buscar funcionário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // Criar funcionário (Handles photo upload)
    static async criarFuncionario(req, res) {
        try {
            const funcionarioData = req.body; // Data from form fields processed by Multer

            // Add photo path if uploaded
            if (req.file) {
                funcionarioData.foto_perfil_path = req.file.filename; // Get filename from Multer
            } else {
                funcionarioData.foto_perfil_path = null; // Ensure field exists even if no photo
            }

            // Basic validation (ensure all required fields from the model are present)
            if (!funcionarioData.nome_funcionario || !funcionarioData.numero_matricula || !funcionarioData.cpf || !funcionarioData.dt_nascimento || !funcionarioData.dt_admissao || !funcionarioData.tipo_sanguineo || !funcionarioData.id_cargo || !funcionarioData.id_empresa) {
                // If a file was uploaded but validation fails, delete the orphaned file
                if (req.file) {
                    deleteFile(path.join(getUploadDir(), req.file.filename));
                }
                return res.status(400).json({ error: "Dados incompletos para criar funcionário." });
            }

            // Call the Model's create method (ensure Model handles foto_perfil_path)
            const result = await Funcionario.create(funcionarioData);

            if (result.success) {
                return res.status(201).json({ message: "Funcionário criado com sucesso", id: result.id });
            } else {
                 // If a file was uploaded but DB insert fails, delete the orphaned file
                if (req.file) {
                    deleteFile(path.join(getUploadDir(), req.file.filename));
                }
                return res.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao criar funcionário:", error);
             // If a file was uploaded but an unexpected error occurs, delete the orphaned file
            if (req.file) {
                deleteFile(path.join(getUploadDir(), req.file.filename));
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // Atualizar funcionário (Handles photo update/removal)
    static async atualizarFuncionario(req, res) {
        try {
            const { id } = req.params;
            const funcionarioData = req.body;
            let oldPhotoPath = null;

            // 1. Fetch current employee data to check for existing photo
            const currentFuncionarioResult = await Funcionario.findById(id);
            if (!currentFuncionarioResult.success) {
                // If employee not found, delete uploaded file if any
                if (req.file) {
                    deleteFile(path.join(getUploadDir(), req.file.filename));
                }
                return res.status(404).json({ error: "Funcionário não encontrado para atualizar." });
            }
            if (currentFuncionarioResult.data.foto_perfil_path) {
                oldPhotoPath = path.join(getUploadDir(), currentFuncionarioResult.data.foto_perfil_path);
            }

            // 2. Handle photo update or removal
            if (req.file) {
                // New photo uploaded: set path and delete old photo if it exists
                funcionarioData.foto_perfil_path = req.file.filename;
                if (oldPhotoPath) {
                    deleteFile(oldPhotoPath);
                }
            } else if (funcionarioData.remover_foto === 'true') {
                // 'remover_foto' flag sent from frontend: set path to null and delete old photo
                funcionarioData.foto_perfil_path = null;
                if (oldPhotoPath) {
                    deleteFile(oldPhotoPath);
                }
            } else {
                // No new photo and no removal flag: keep the existing path
                // We need to explicitly add it back to funcionarioData if it wasn't sent in the body
                funcionarioData.foto_perfil_path = currentFuncionarioResult.data.foto_perfil_path;
            }
            // Remove the helper flag if it exists, so it's not sent to the Model
            delete funcionarioData.remover_foto;

            // Basic validation
            if (!funcionarioData.nome_funcionario || !funcionarioData.numero_matricula || !funcionarioData.cpf || !funcionarioData.dt_nascimento || !funcionarioData.dt_admissao || !funcionarioData.tipo_sanguineo || !funcionarioData.id_cargo || !funcionarioData.id_empresa) {
                 // If a new file was uploaded but validation fails, delete it
                if (req.file) {
                    deleteFile(path.join(getUploadDir(), req.file.filename));
                }
                return res.status(400).json({ error: "Dados incompletos para atualizar funcionário." });
            }

            // 3. Call the Model's update method (ensure Model handles foto_perfil_path)
            const result = await Funcionario.update(id, funcionarioData);

            if (result.success) {
                return res.status(200).json({ message: result.message });
            } else {
                // If update failed but a new file was uploaded, delete the new file
                if (req.file) {
                     deleteFile(path.join(getUploadDir(), req.file.filename));
                }
                const statusCode = result.error.includes("não encontrado") ? 404 : 400;
                return res.status(statusCode).json({ error: result.error });
            }
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            // If an unexpected error occurred and a new file was uploaded, delete it
            if (req.file) {
                deleteFile(path.join(getUploadDir(), req.file.filename));
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    // Excluir funcionário (Handles photo deletion)
    static async excluirFuncionario(req, res) {
        try {
            const { id } = req.params;

            // 1. Fetch employee data to get photo path before deleting
            const currentFuncionarioResult = await Funcionario.findById(id);
            let photoToDelete = null;
            if (currentFuncionarioResult.success && currentFuncionarioResult.data.foto_perfil_path) {
                photoToDelete = path.join(getUploadDir(), currentFuncionarioResult.data.foto_perfil_path);
            }

            // 2. Attempt to delete employee from DB
            const result = await Funcionario.delete(id);

            if (result.success) {
                // 3. If DB deletion was successful, delete the photo file
                if (photoToDelete) {
                    deleteFile(photoToDelete);
                }
                return res.status(200).json({ message: result.message });
            } else {
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

