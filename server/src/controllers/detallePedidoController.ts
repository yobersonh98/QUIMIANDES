import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDetallesPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const detallesPedido = await prisma.detallePedido.findMany();
    res.json(detallesPedido);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order details" });
  }
};

export const createDetallePedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pedidoId, productoId, unidades, cantidad, total } = req.body;
    const detallePedido = await prisma.detallePedido.create({
      data: {
        pedidoId,
        productoId,
        unidades,
        cantidad,
        total,
      },
    });
    res.status(201).json(detallePedido);
  } catch (error) {
    res.status(500).json({ message: "Error creating order detail" });
  }
};
