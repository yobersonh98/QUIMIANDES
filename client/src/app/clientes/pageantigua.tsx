
// // esto es un react server component
// // utiliza el poder de next.js para hacer fetch a la api o axion dentro componentes de react
// // no utilizar localhost, utilizar la ip de la maquina o la red ipv4 con ipconfig en powershell
// //o sea que cada ves que me cambie de red tengo que cambiar la ip ?
// // por porque hubo una actualizacion en node que no permite hacer fetch a localhost desde un servidor
// // nos vemos, chaoling 
// // dale bro, muchas gracias ❤️
// // de nada, cualquier cosa me avisas
// // gracias, igualmente. que crack s copilot
// const Client = async () => {
//   const response = await fetch("http:/172.27.224.1:8000/client");
//   const data = await response.json();
  
//   console.log(data);
//   return (
//     <div>
//       <h2>Lista de Clientes</h2>
//       <ul>
//         {data.map((client:any) => (
//           <li key={client.direccion}>
//             <h3>{client.nombre}</h3>
//             <p>{client.direccion}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Client;

