"use client";
import { useRouter } from "next/navigation";
import { useCreateClientMutation } from "@/state/api";
import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { Save, X } from "lucide-react";

const CreateClient = () => {
  const router = useRouter();
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [form, setForm] = useState({
    documento: "",
    nombre: "",
    direccion: "",
    zonaBarrio: "",
    telefono: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Datos que se enviarán:", form);
  
    if (!form.documento || !form.nombre || !form.direccion) {
      alert("Todos los campos son obligatorios");
      return;
    }
  
    try {
      const response = await createClient(form).unwrap();
      console.log("Cliente creado con éxito:", response);
      router.push("/clientes");
    } catch (error: any) {
      console.error("Error al crear cliente:", error);
      
      // Mostrar error en pantalla
      if (error.status === 400) {
        alert("Error 400: Datos inválidos, revisa la información enviada.");
      } else if (error.status === 500) {
        alert("Error 500: Problema en el servidor, intenta más tarde.");
      } else {
        alert(`Error desconocido: ${error.data?.message || "Ver consola para más detalles"}`);
      }
    }
  };
  

  return (
    <div className="w-full px-6 p-6">
      <Typography variant="h4" className="mb-4 font-bold">Crear Nuevo Cliente</Typography>
      <Card className="shadow-lg w-full max-w-2xl mx-auto">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField label="Documento" name="documento" value={form.documento} onChange={handleChange} required />
            <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
            <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} required />
            <TextField label="Zona/Barrio" name="zonaBarrio" value={form.zonaBarrio} onChange={handleChange} />
            <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
            <Box className="flex gap-4 mt-4">
              <Button type="submit" variant="contained" color="primary" startIcon={<Save size={16} />} disabled={isLoading}>
                Guardar
              </Button>
              <Button variant="outlined" onClick={() => router.push("/clientes")} startIcon={<X size={16} />}>
                Cancelar
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateClient;
