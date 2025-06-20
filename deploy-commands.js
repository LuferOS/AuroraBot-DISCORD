const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json'); // Asegúrate de tener clientId y guildId en tu config.json

const commands = [
  {
    name: 'aprender',
    description: 'Establece este canal como la fuente de conocimiento de Aurora. Aquí leerá los mensajes.',
  },
  {
    name: 'start',
    description: 'Activa a Aurora para que hable en este canal.',
  },
  {
      name: 'reset_aurora',
      description: 'Hace que Aurora olvide los canales de aprendizaje y habla, poniéndola a dormir.'
  }
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Refrescando comandos slash (/) de la aplicación.');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log('Comandos slash (/) recargados exitosamente.');
  } catch (error) {
    console.error(error);
  }
})();