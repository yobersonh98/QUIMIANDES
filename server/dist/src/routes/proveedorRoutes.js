"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedorController_1 = require("../controllers/proveedorController");
const router = (0, express_1.Router)();
router.get("/", proveedorController_1.getProveedores);
router.post("/", proveedorController_1.createProveedor);
exports.default = router;
