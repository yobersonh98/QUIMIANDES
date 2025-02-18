"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducto = exports.getProductos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const productos = yield prisma.producto.findMany({
            where: {
                nombre: {
                    contains: search,
                },
            },
        });
        res.json(productos);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProductos = getProductos;
const createProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, tipo, unidadMedida, pesoVolumen, precioBase, proveedorDocumento } = req.body;
        const producto = yield prisma.producto.create({
            data: {
                nombre,
                tipo,
                unidadMedida,
                pesoVolumen,
                precioBase,
                proveedorDocumento,
            },
        });
        res.status(201).json(producto);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProducto = createProducto;
