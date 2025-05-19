import React from 'react'

export default function Loader() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-sm mx-auto">
      <div className="flex space-x-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
      <p className="text-gray-700 font-medium text-center">
        Cargando contenido...
      </p>
      <p className="text-gray-500 text-sm text-center mt-2">
        Estamos preparando todo para ti, ¡gracias por tu paciencia!
      </p>
    </div>
  )
}
