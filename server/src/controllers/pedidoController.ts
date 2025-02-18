import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidos = await prisma.pedido.findMany();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

export const createPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteDocumento, estado, observaciones, fechaRequerimiento, fechaEntrega, tiempoEntrega, pesoDespachado } = req.body;
    const pedido = await prisma.pedido.create({
      data: {
        clienteDocumento,
        estado,
        observaciones,
        fechaRequerimiento,
        fechaEntrega,
        tiempoEntrega,
        pesoDespachado,
      },
    });
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
};
