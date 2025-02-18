"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventarioClienteController_1 = require("../controllers/inventarioClienteController");
const router = (0, express_1.Router)();
router.get("/", inventarioClienteController_1.getInventariosCliente);
router.post("/", inventarioClienteController_1.createInventarioCliente);
exports.default = router;
