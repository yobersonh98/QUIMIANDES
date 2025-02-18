"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetClientsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, TextField, CircularProgress } from "@mui/material";
import { Eye, Plus } from "lucide-react";

const Clients = () => {
  const { data: clients, isLoading, isError } = useGetClientsQuery();
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Filtrar clientes por nombre o documento
  const filteredClients = clients?.filter(
    (client) =>
      client.nombre.toLowerCase().includes(search.toLowerCase()) ||
      client.documento.includes(search)
  );

  // Columnas de la tabla
  const columns: GridColDef[] = [
    { field: "documento", headerName: "Documento", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "zonaBarrio", headerName: "Zona/Barrio", width: 200 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => router.push(`/clientes/${params.row.documento}`)}
            startIcon={<Eye size={16} />}
          >
            Ver/Editar
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div className="flex justify-center"><CircularProgress /></div>;
  if (isError || !clients) return <div className="text-red-500">Error cargando clientes</div>;

  return (
    <div className="flex flex-col gap-4">
      <Header name="Clientes" />

      {/* Barra de búsqueda y botón de crear cliente */}
      <div className="flex justify-between items-center">
        <TextField
          label="Buscar cliente..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Plus size={16} />}
          onClick={() => router.push("/clientes/nuevo")}
        >
          Nuevo Cliente
        </Button>
      </div>

      {/* Tabla de clientes */}
      <DataGrid
        rows={filteredClients || []}
        columns={columns}
        getRowId={(row) => row.documento}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default Clients;
