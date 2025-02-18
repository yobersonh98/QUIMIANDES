"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteController_1 = require("../controllers/clienteController");
const router = (0, express_1.Router)();
router.get("/", clienteController_1.getClientes); // Obtener todos los clientes
router.get("/:documento", clienteController_1.getClienteByDocumento); // Obtener un solo cliente por su documento
router.post("/", clienteController_1.createCliente); // Crear un cliente
exports.default = router;
