export interface Merchant {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const merchantsByComuna: Record<string, Merchant[]> = {
  Cauquenes: [
    { name: 'Verónica Elena De Lourdes Yáñez Capurro', address: 'Km 14,5 Camino La Virgen Sauzal Sector Camarico Acevedo', phone: '942072025', email: 'vyanez1364@gmail.com' },
    { name: 'Veyto SpA', address: 'Km 17 Camino Chanco', phone: '972116051', email: 'eladioaveloso@gmail.com' },
  ],
  Curicó: [
    { name: 'Roberto Alejandro Beltrán Navarro', address: 'Los Cristales Sitio N° 65', phone: '982359061', email: 'robertoalejandrobeltran888@gmail.com' },
    { name: 'Pedro Vicente Araya Araya', address: 'Avenida Manso de Velasco 1546', phone: '956484506', email: 'pedroaraya1009@gmail.com' },
    { name: 'Juan Carlos Pino Mejias', address: 'Isla De Marchant Km 3,1 Ruta J60, Curicó', phone: '987313073', email: 'jcpinoradiata2@gmail.com' },
  ],
  Licantén: [
    { name: 'Rebeca Eliana Del Carmen Gómez Parraguez', address: 'Callejón Los Pinos SN, Los Planchones', phone: '964514222', email: 'reb.gomez@gmail.com' },
  ],
  Molina: [
    { name: 'Agrícola Forestal Monte Grande Ltda.', address: 'Membrillar 845', phone: '997425020', email: 'dadesa@tie.cl' },
    { name: 'Agroservicios Zenteno e Hijo Ltda.', address: 'Puente Alto, Hitahue S/N', phone: '999594016', email: 'czenteno316@hotmail.com' },
    { name: 'Oscar Mauricio Rioseco Cruz', address: 'Avenida Cementerio, Parcela San Guillermo, S/N', phone: '998371110', email: 'oscarrioseco@hotmail.com' },
    { name: 'Samuel Jesús Tapia Oyarzún', address: 'Villa Piedra Azul Psj Rio Aconcahua #1437, Molina', phone: '999475096', email: 'tapiaoyarzunsamuel@gmail.com' },
    { name: 'Leocadia Del Carmen Valenzuela Pérez', address: 'Callejón La Serena Parcela 2 S/N', phone: '982626615', email: 'nperezsasso@gmail.com' },
    { name: 'Madera y Leña Mondaca SpA', address: 'Callejón Santa Lucía S/N', phone: '978010309', email: 'rosa.mondaca.c@gmail.com' },
  ],
  Romeral: [
    { name: 'Oscar Dagoberto González Arce', address: 'Lote X Hijuela Las Marías Quilvo Alto', phone: '984098424', email: 'angelina_diaz_ponce@hotmail.com' },
    { name: 'María Angélica Hernández Valenzuela', address: 'Km 2 Camino Romeral', phone: '982720356', email: 'joseeliecerfv@gmail.com' },
  ],
  'Sagrada Familia': [
    { name: 'Juan Guillermo González Guerrero', address: 'Paradero 6 S/N La Isla', phone: '984115805', email: 'vivian34g@gmail.com' },
  ],
  Linares: [
    { name: 'Gustavo Antonio Espinoza Guzmán', address: 'Camino A San Antonio Km 1,5', phone: '995425460', email: '' },
    { name: 'José Antonio Prieto Zurita', address: 'Esperanza N° 1620', phone: '996704921', email: 'j.prietoesperanza1620@gmail.com' },
    { name: 'José Félix Quezada Yáñez', address: 'Gabriela Mistral 907 El Progreso, Linares', phone: '987089526', email: 'ventas.calefacciondelmaule@gmail.com' },
    { name: 'Lorenzo Antonio Canales Reyes', address: 'Valentín Letelier N° 1366 Linares', phone: '992047641', email: 'lorenzocanalesreyes@gmail.com' },
  ],
  Longaví: [
    { name: 'Sergio Del Carmen Campos Cerda', address: 'Parcela N° 10 La Sexta, Longaví, Región del Maule', phone: '979607737', email: '' },
    { name: 'Juan Raúl Castro Parra', address: 'Villa Longaví S/N', phone: '993645270', email: 'juaninocp77@gmail.com' },
  ],
  Parral: [
    { name: 'Combustibles Biomasa Nativa Ltda.', address: 'Parcela 6, Villa Baviera Parral', phone: '993205910', email: 'administracionforestal@villabaviera.cl' },
    { name: 'Agrícola y Forestal Hedelcas SpA', address: 'Hijuela Nº2 Remulcao', phone: '992971127', email: 'hedelcaschile@gmail.com' },
  ],
  'San Javier': [
    { name: 'Aserradero Lautaro SpA', address: 'Las Zanjas S/N', phone: '935138424', email: 'p.carrascocornejo@gmail.com' },
    { name: 'Lucía Del Carmen Molina Chamorro', address: 'Calle Omero Arellano 1664 Pobl Ana Rodriguez De Lobos', phone: '985755002', email: 'l.cancinolaobra@gmail.com' },
    { name: 'Enrique Del Carmen Aravena Ibarra', address: 'Nirivilo Sector Ruta 2000', phone: '968260238', email: 'e.aravenaruta2000@gmail.com' },
  ],
  'Yerbas Buenas': [
    { name: 'Héctor Germain Antonio Mardones Fuentes', address: 'Santa Ana De Queri S/N', phone: '997486718', email: 'lenasdelmaule@gmail.com' },
  ],
  Constitución: [
    { name: 'Leñeria del Maule SpA', address: 'Echeverría 585 Constitución', phone: '939538036', email: 'logisticainsularjf@gmail.com' },
  ],
  Maule: [
    { name: 'Alejandro René Poblete Velásquez', address: '8 1/2 Oriente A 177', phone: '982576484', email: 'apobletev@hotmail.com' },
    { name: 'Miguel Angel Hernández Garrido', address: 'Culenar S/N', phone: '967952600', email: 'miguelahg1966@gmail.com' },
    { name: 'Leñas Del Maule SpA', address: 'Camino a Colín S/N', phone: '976408615', email: 'eduardohernandezg58@gmail.com' },
  ],
  Pelarco: [
    { name: 'Ernesto Alejandro Sazo Morales', address: 'Localidad Santa Rita Sitio N° 20', phone: '999065805', email: 'sazomoralesernesto@gmail.com' },
  ],
  'San Rafael': [
    { name: 'Olivia De Las Mercedes Rojas Obregón', address: 'Av Poniente Santa Irma 30a', phone: '975480828', email: 'donmariojara@gmail.com' },
  ],
  Talca: [
    { name: 'Oscar Orlando Norambuena Cofré', address: 'Talca', phone: '954202556', email: 'Certificadatalca@gmail.com' },
    { name: 'Luis Alberto Moyano Navarro', address: 'Camilo Las Rastras, San Valentín N° 60', phone: '977849177', email: 'mmoyano731@gmail.com' },
    { name: 'Sociedad Comercial de Transportes y Servicios Antonia Ltda.', address: '25 Oriente N° 1776', phone: '999052831', email: 'gruatransltda@hotmail.com' },
    { name: 'Miguel Angel González Valenzuela', address: '5 Norte N° 1425', phone: '996229413', email: 'm.gonzalezplazalasheras@gmail.com' },
    { name: 'Ferretería Industrial El Colorado SpA', address: 'Ruta CH-115 Km 5 Sector La Obra', phone: '995681495', email: 'Mgaete@elcoloradospa.com' },
  ],
};
