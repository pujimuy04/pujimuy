// Generar importacion
const fs = require('fs');

const dummyData = [
  { userid: "user1", description: "Completar tarea 1", completed: false },
  { userid: "user2", description: "Revisar correo electrónico", completed: true },
  { userid: "user1", description: "Terminar informe", completed: false },
  { userid: "user3", description: "Preparar presentación", completed: true },
  // Agrega más registros ficticios aquí
];

// Convertir datos a formato JSON
const jsonData = JSON.stringify(dummyData);

// Guardar datos en un archivo
fs.writeFileSync('dummy_data.json', jsonData);

console.log("Archivo JSON generado con éxito.");
