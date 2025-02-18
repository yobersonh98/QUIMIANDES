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
exports.createEntrega = exports.getEntregas = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getEntregas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entregas = yield prisma.entrega.findMany();
        res.json(entregas);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving deliveries" });
    }
});
exports.getEntregas = getEntregas;
const createEntrega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pedidoId, vehiculoInterno, vehiculoExterno, entregadoPorA, lugarEntrega, tipoEntrega, remision, observaciones } = req.body;
        const entrega = yield prisma.entrega.create({
            data: {
                pedidoId,
                vehiculoInterno,
                vehiculoExterno,
                entregadoPorA,
                lugarEntrega,
                tipoEntrega,
                remision,
                observaciones,
            },
        });
        res.status(201).json(entrega);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating delivery" });
    }
});
exports.createEntrega = createEntrega;
