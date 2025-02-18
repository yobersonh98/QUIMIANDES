"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entregaController_1 = require("../controllers/entregaController");
const router = (0, express_1.Router)();
router.get("/", entregaController_1.getEntregas);
router.post("/", entregaController_1.createEntrega);
exports.default = router;
