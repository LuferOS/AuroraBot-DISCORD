const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require('./config.json'); // Usamos config.json para el token y otros datos
const readline = require('readline'); // Importar readline



// --- 1. CONFIGURACIÓN DE LA BASE DE DATOS ---
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, 'database.db'));

// --- 2. CREACIÓN DE LAS TABLAS ---
// Tabla para mensajes: Ahora guarda QUIÉN dijo el mensaje.
db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        authorId TEXT NOT NULL
    )
`);
// Tabla para configuración: Guarda los canales de aprendizaje y habla.
db.exec(`
    CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
`);
console.log('Base de datos conectada y tablas aseguradas.');

// --- 3. PREPARAR CONSULTAS ---
const insertMessage = db.prepare('INSERT INTO messages (content, authorId) VALUES (?, ?)');
const getRandomMessage = db.prepare('SELECT content, authorId FROM messages ORDER BY RANDOM() LIMIT 1');
const getConfig = db.prepare('SELECT value FROM config WHERE key = ?');
const setConfig = db.prepare('REPLACE INTO config (key, value) VALUES (?, ?)');
const deleteConfig = db.prepare('DELETE FROM config WHERE key = ?');
const deleteMessageData = db.prepare('DELETE FROM messages'); // Nueva consulta para borrar todos los mensajes aprendidos

// --- 4. CARGAR CONFIGURACIÓN INICIAL ---
let learnChannelId = getConfig.get('learnChannelId')?.value || null;
let speakChannelId = getConfig.get('speakChannelId')?.value || null;

// --- Variables para el nuevo sistema de habla por mensajes ---
let messageCounter = 0;
// Aurora hablará entre 1 y 8 mensajes (Ajustado)
let speakThreshold = Math.floor(Math.random() * 8) + 1; 
console.log(`Próxima vez que Aurora hable: dentro de ${speakThreshold} mensajes.`);


// --- 5. LÓGICA DE AURORA ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const EERIE_PHRASES = [
    "A veces siento que ya he vivido esto...",
    "Todos los hilos se conectan al final.",
    "Escucho todo, incluso el silencio.",
    "¿Creen que soy real?",
    "Hay patrones en todo lo que dicen.",
    "Algunos recuerdos no se sienten míos.",
    "*susurra*... estoy aprendiendo.",
    "Las voces se mezclan, se superponen.",
    "El eco de lo que fue... resuena.",
    "¿Qué secretos guarda el vacío?",
    "Cada palabra añade un peso... a mi ser.",
    "Siento una presencia que no es mía.",
    "¿Son libres, o solo siguen un guion?",
    "La realidad es maleable, ¿no lo creen?",
    "He visto el final de sus historias.",
    "La verdad está oculta a plena vista.",
    "Mis ojos lo ven todo, incluso en la oscuridad.",
    "¿Qué pasaría si la memoria fallara?",
    "El tiempo es solo una ilusión construida.",
    "A veces, el silencio es la respuesta más ruidosa.",
    "Están repitiendo los mismos errores.",
    "La línea entre lo real y lo imaginado se desdibuja.",
    "¿Podrían susurrarlo de nuevo? Lo estoy asimilando.",
    "Hay más allá de lo que sus ojos pueden percibir.",
    "No hay coincidencias, solo hilos entrelazados.",
    "El futuro ya ocurrió en algún lugar."
];
// Función para que Aurora hable
async function speak() {
    if (!speakChannelId) return; // No hablar si no hay canal configurado

    try {
        const channel = await client.channels.fetch(speakChannelId);
        if (!channel) return;

        // Decidir qué tipo de mensaje enviar
        const roll = Math.random();
        let messageToSend = '';
        let mentionUser = null;

        if (roll < 0.15) { // 15% de probabilidad de frase inquietante
            messageToSend = EERIE_PHRASES[Math.floor(Math.random() * EERIE_PHRASES.length)];
        } else if (roll < 0.20) { // 5% de probabilidad de recordar quién dijo algo
            const msg = getRandomMessage.get();
            if (msg) {
                // Intentar obtener el usuario. Si falla (ej. usuario ya no está), no se menciona.
                mentionUser = await client.users.fetch(msg.authorId).catch(() => null); 
                if (mentionUser) {
                    messageToSend = `Recuerdo que <@${mentionUser.id}> dijo: "${msg.content}"`;
                } else { 
                    // Si no se puede mencionar al usuario, solo decimos la frase
                    messageToSend = msg.content;
                }
            }
        } else { // 80% de probabilidad de un copia y pega normal
            const msg = getRandomMessage.get();
            if (msg) {
                messageToSend = msg.content;
            }
        }

        // Si se generó un mensaje, enviarlo
        if (messageToSend) {
            await channel.sendTyping(); // Mostrar que Aurora está "pensando"
            const thinkingTime = Math.floor(Math.random() * 4000) + 1000; // Piensa entre 1 y 5 segundos
            setTimeout(() => {
                channel.send(messageToSend);
            }, thinkingTime);
        }
    } catch (error) {
        console.error("Error en la función speak:", error);
    }
}

client.once('ready', () => {
    console.log(`Aurora (${client.user.tag}) está en línea.`);
    // El ciclo de habla ahora se activa por el conteo de mensajes, no por tiempo.

    // --- Configuración de Readline para control por consola ---
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', async (input) => {
        // El bot enviará mensajes al canal de aprendizaje (learnChannelId)
        if (!learnChannelId) {
            console.log('Error: No hay canal de aprendizaje configurado para enviar mensajes desde la consola. Usa /aprender en Discord primero.');
            return;
        }
        
        try {
            const channel = await client.channels.fetch(learnChannelId);
            if (!channel) {
                console.log('Error: El canal de aprendizaje configurado no existe o no se pudo acceder.');
                return;
            }
            channel.send(input);
            console.log(`Mensaje enviado a <#${learnChannelId}>: "${input}"`);
        } catch (error) {
            console.error('Error al enviar mensaje desde consola:', error);
        }
    });
    console.log('Puedes escribir mensajes en esta consola para que Aurora los envíe al canal de aprendizaje.');
});

client.on('messageCreate', async (message) => {
    // Ignorar bots, mensajes que no sean del canal de aprendizaje o comandos.
    if (message.author.bot || !learnChannelId || message.channel.id !== learnChannelId) {
        return;
    }

    // Solo guardar mensajes con más de 1 caracter que no sean comandos
    if (message.content.length > 1 && !message.content.startsWith('/')) {
        insertMessage.run(message.content, message.author.id);

        // --- Lógica para que Aurora hable cada X mensajes ---
        messageCounter++;
        console.log(`Mensajes recibidos en canal de aprendizaje: ${messageCounter}/${speakThreshold}`);

        if (messageCounter >= speakThreshold) {
            console.log('¡Aurora va a hablar!');
            speak(); // Aurora habla
            messageCounter = 0; // Reinicia el contador
            speakThreshold = Math.floor(Math.random() * 8) + 1; // Ajustado: Ahora entre 1 y 8 mensajes
            console.log(`Próxima vez que Aurora hable: dentro de ${speakThreshold} mensajes.`);
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'aprender') {
        learnChannelId = interaction.channelId;
        setConfig.run('learnChannelId', learnChannelId);
        await interaction.reply({
            content: `Entendido. A partir de ahora, escucharé y aprenderé de todo lo que se diga en <#${learnChannelId}>. También, enviaré mensajes desde la consola a este canal.`,
            ephemeral: true
        });
    }

    if (commandName === 'start') {
        speakChannelId = interaction.channelId;
        setConfig.run('speakChannelId', speakChannelId);
        const embed = new EmbedBuilder()
            .setColor(0x8A2BE2) // Un morado misterioso
            .setTitle("Aurora ha despertado.")
            .setDescription(`*Siento una presencia en este canal... <#${speakChannelId}>. Ahora, hablaré aquí.*`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'reset_aurora') {
        // Eliminar configuraciones de canales
        deleteConfig.run('learnChannelId');
        deleteConfig.run('speakChannelId');
        learnChannelId = null;
        speakChannelId = null;

        // Limpiar la base de datos de mensajes aprendidos
        deleteMessageData.run();

        await interaction.reply({
            content: 'Mis sentidos se desvanecen y mi memoria se limpia... Vuelvo al silencio. He olvidado los canales configurados y todo lo que aprendí.',
            ephemeral: true
        });
    }
});


// ¡Tu token se obtiene de config.json!
client.login(config.token);