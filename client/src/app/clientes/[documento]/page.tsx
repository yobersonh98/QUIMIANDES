"use client";
import { useRouter, useParams } from "next/navigation";
import { useGetClientByIdQuery, useDeleteClientMutation } from "@/state/api";
import { Button, Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

const ClientDetail = () => {
  const router = useRouter();
  const { documento } = useParams();
  const { data: client, isLoading, isError } = useGetClientByIdQuery(documento as string);
  const [deleteClient] = useDeleteClientMutation();
  const [tabIndex, setTabIndex] = useState(0);

  if (isLoading) return <div className="flex justify-center"><CircularProgress /></div>;
  if (isError || !client) return <div className="text-red-500">Cliente no encontrado</div>;

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      await deleteClient(documento as string);
      router.push("/clientes");
    }
  };

  return (
    <div className="w-full px-6 p-6">
      <Typography variant="h4" className="mb-4 font-bold">Detalles del Cliente</Typography>
      
      <Box className="mb-4 flex justify-between w-full">
        <Typography variant="h5">{client.nombre}</Typography>
        <div className="flex gap-4">
          <Button variant="contained" color="primary" startIcon={<Pencil size={16} />} onClick={() => router.push(`/clientes/editar/${documento}`)}>Editar</Button>
          <Button variant="contained" color="error" startIcon={<Trash size={16} />} onClick={handleDelete}>Eliminar</Button>
        </div>
      </Box>
      
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} className="mb-4">
        <Tab label="Información General" />
        <Tab label="Inventario" />
        <Tab label="Cotizaciones" />
        <Tab label="Pedidos" />
      </Tabs>
      
      {tabIndex === 0 && (
        <Box className="bg-white p-4 rounded shadow w-full">
          <Typography><strong>Documento:</strong> {client.documento}</Typography>
          <Typography><strong>Dirección:</strong> {client.direccion}</Typography>
          <Typography><strong>Zona/Barrio:</strong> {client.zonaBarrio || "N/A"}</Typography>
        </Box>
      )}
      
      {tabIndex === 1 && (
        <Box className="bg-white p-4 rounded shadow w-full">
          <Typography variant="h6" className="mb-2">Inventario</Typography>
          {client.inventarios.length > 0 ? (
            <ul>
              {client.inventarios.map((item) => (
                <li key={item.id}>{item.producto.nombre} - ${item.precioEspecial}</li>
              ))}
            </ul>
          ) : <Typography>No hay productos en inventario</Typography>}
        </Box>
      )}
      
      {tabIndex === 2 && (
        <Box className="bg-white p-4 rounded shadow w-full">
          <Typography variant="h6" className="mb-2">Cotizaciones</Typography>
          {client.cotizaciones.length > 0 ? (
            <ul>
              {client.cotizaciones.map((cot) => (
                <li key={cot.id}>Cotización #{cot.id} - Total: ${cot.total}</li>
              ))}
            </ul>
          ) : <Typography>No hay cotizaciones</Typography>}
        </Box>
      )}
      
      {tabIndex === 3 && (
        <Box className="bg-white p-4 rounded shadow w-full">
          <Typography variant="h6" className="mb-2">Pedidos</Typography>
          {client.pedidos.length > 0 ? (
            <ul>
              {client.pedidos.map((pedido) => (
                <li key={pedido.id}>Pedido #{pedido.id} - Estado: {pedido.estado}</li>
              ))}
            </ul>
          ) : <Typography>No hay pedidos registrados</Typography>}
        </Box>
      )}
    </div>
  );
};

export default ClientDetail;
