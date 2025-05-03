"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Buenos días");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Configurar saludo según la hora del día
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 18) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");

    // Configurar fecha y hora
    const updateDateTime = () => {
      const now = new Date();
      const options = { 
        weekday: "long" as const, 
        year: "numeric" as const, 
        month: "long" as const, 
        day: "numeric" as const 
      };
      setCurrentDate(now.toLocaleDateString('es-CO', options));
      
      const timeOptions = { 
        hour: "2-digit" as const, 
        minute: "2-digit" as const 
      };
      setCurrentTime(now.toLocaleTimeString('es-CO', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    // Animación de entrada
    setTimeout(() => {
      setAnimateIn(true);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className={`flex flex-col items-center text-center transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo animado */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur-sm"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg">
              <FlaskConical className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              <Sparkles className="absolute right-0 top-0 h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Saludo y nombre de la empresa */}
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {greeting}
        </h1>
        <div className="mb-6 h-1 w-16 rounded bg-blue-600 dark:bg-blue-500"></div>
        <h2 className="mb-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          QUIMIANDES TA SAS
        </h2>

        {/* Mensaje de bienvenida */}
        <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-300">
          Bienvenido al sistema de gestión integral de productos químicos.
          Su plataforma para excelencia y precisión.
        </p>

        {/* Fecha y hora */}
        <div className="mt-4 flex flex-col items-center text-gray-600 dark:text-gray-300">
          <p className="text-lg font-medium">{currentDate}</p>
          <p className="text-xl font-semibold">{currentTime}</p>
        </div>

        {/* Partículas decorativas */}
        <div className="absolute -z-10 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-600 dark:bg-blue-400"
              style={{
                width: `${Math.random() * 12 + 4}px`,
                height: `${Math.random() * 12 + 4}px`,
                top: `${Math.random() * 400 - 200}px`,
                left: `${Math.random() * 400 - 200}px`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}