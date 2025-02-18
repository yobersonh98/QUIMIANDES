import { Router } from "express";
import { getClientes, createCliente, getClienteByDocumento } from '../controllers/clienteController';

const router = Router();

router.get("/", getClientes); // Obtener todos los clientes
router.get("/:documento", getClienteByDocumento); // Obtener un solo cliente por su documento
router.post("/", createCliente); // Crear un cliente


export default router;
