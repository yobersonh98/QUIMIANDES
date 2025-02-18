import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEntregas = async (req: Request, res: Response): Promise<void> => {
  try {
    const entregas = await prisma.entrega.findMany();
    res.json(entregas);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving deliveries" });
  }
};

export const createEntrega = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pedidoId, vehiculoInterno, vehiculoExterno, entregadoPorA, lugarEntrega, tipoEntrega, remision, observaciones } = req.body;
    const entrega = await prisma.entrega.create({
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
  } catch (error) {
    res.status(500).json({ message: "Error creating delivery" });
  }
};
