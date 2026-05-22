const names = [
  'María González', 'Carlos Muñoz', 'Camila Soto', 'Pedro Vargas',
  'Francisca Rojas', 'Jorge Martínez', 'Gabriela Silva', 'Luis Morales',
  'Valentina Castro', 'Diego Contreras', 'Daniela Fuentes', 'Andrés Rivera',
  'Antonia Vega', 'Matías Reyes', 'Isidora Sandoval', 'Benjamín Flores',
  'Constanza Pizarro', 'Tomás Guerrero', 'Amanda Moreno', 'Vicente Rosas',
  'Emilia Fuenzalida', 'Álvaro Campos', 'Martina Sepúlveda',
];

const phones = [
  '+56 9 1234 5678', '+56 9 2345 6789', '+56 9 3456 7890',
  '+56 9 4567 8901', '+56 9 5678 9012', '+56 9 6789 0123',
  '+56 9 7890 1234', '+56 9 8901 2345', '+56 9 9012 3456',
  '+56 9 5318 7642', '+56 9 7246 8193', '+56 9 4682 1357',
  '+56 9 6134 7289', '+56 9 8475 2193', '+56 9 3926 4518',
  '+56 9 7162 3845', '+56 9 5297 8431', '+56 9 6541 2783',
];

const addresses = [
  'Av. San Miguel 123, Talca', 'Calle 1 Oriente 456, Talca',
  'Av. Bernardo O Higgins 789, Talca', 'Pasaje Los Alerces 234, Talca',
  'Calle 2 Sur 567, Talca', 'Av. Circunvalación 890, Talca',
  'Los Laureles 345, Curicó', 'Av. Alessandri 678, Curicó',
  'Calle Merced 901, Curicó', 'Manuel Rodríguez 112, Curicó',
  'Av. León Bustamante 334, Linares', 'Independencia 556, Linares',
  'Calle Los Mañíos 223, Constitución', 'Av. Salvador Allende 445, Maule',
  'Pasaje El Boldo 667, Molina', 'Los Olivos 889, San Javier',
  'Calle Comercio 101, Cauquenes', 'Av. El Parque 212, Parral',
  'Villa Los Ríos 323, Longaví', 'Calle Central 434, Romeral',
  'Av. La Paz 545, Yerbas Buenas', 'Pasaje Las Rosas 656, San Rafael',
  'Av. Bulnes 767, Pelarco', 'Los Nogales 878, Licantén',
];

const notes = [
  'Dejar al lado de la puerta',
  'Tocar timbre por favor',
  'Llegar después de las 15:00',
  'Dejar con el conserje',
  'No tocar timbre, llamar al llegar',
  'Pueden dejar en entrada principal',
  'Si no contesto dejar con vecino',
  'Preferencia antes de las 13:00',
  'No tengo timbre, llamar al llegar',
  'Dejar en la reja',
  'Tocar tres veces',
  'Estaré en casa todo el día',
  'Si el portón está cerrado llamar',
];

export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomOrderData() {
  return {
    name: randomItem(names),
    phone: randomItem(phones),
    address: randomItem(addresses),
    notes: Math.random() > 0.4 ? randomItem(notes) : '',
  };
}
