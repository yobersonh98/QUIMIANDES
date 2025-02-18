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
exports.createCotizacion = exports.getCotizaciones = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCotizaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cotizaciones = yield prisma.cotizacion.findMany();
        res.json(cotizaciones);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving quotations" });
    }
});
exports.getCotizaciones = getCotizaciones;
const createCotizacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clienteDocumento, total } = req.body;
        const cotizacion = yield prisma.cotizacion.create({
            data: {
                clienteDocumento,
                total,
            },
        });
        res.status(201).json(cotizacion);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating quotation" });
    }
});
exports.createCotizacion = createCotizacion;
