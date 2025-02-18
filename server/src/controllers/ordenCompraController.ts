import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrdenesCompra = async (req: Request, res: Response): Promise<void> => {
  try {
    const ordenesCompra = await prisma.ordenCompra.findMany();
    res.json(ordenesCompra);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchase orders" });
  }
};

export const createOrdenCompra = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pedidoId, numeroOrden, fechaRequerimiento, tiempoEntrega, pesoDespachado, remision } = req.body;
    const ordenCompra = await prisma.ordenCompra.create({
      data: {
        pedidoId,
        numeroOrden,
        fechaRequerimiento,
        tiempoEntrega,
        pesoDespachado,
        remision,
      },
    });
    res.status(201).json(ordenCompra);
  } catch (error) {
    res.status(500).json({ message: "Error creating purchase order" });
  }
};
