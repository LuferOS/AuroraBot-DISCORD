// test-discord.js
const https = require('https');

console.log('Intentando conectar directamente a discord.com:443...');

const options = {
  hostname: 'discord.com',
  port: 443,
  path: '/api/v10/gateway',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js-Connection-Test/1.0'
  }
};

const req = https.request(options, (res) => {
    console.log('¡ÉXITO! Se estableció una conexión con la API de Discord.');
    console.log('Código de estado:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Respuesta recibida (parcial):', data.substring(0, 100) + '...');
        console.log('\nEsto confirma que NO hay un bloqueo de red.');
    });
});

req.on('error', (e) => {
    console.error('¡ERROR! La conexión falló:');
    console.error(e.message);
    console.error('\nEsto confirma que HAY un bloqueo de red específico contra Discord.');
});

req.on('timeout', () => {
    console.error('¡TIMEOUT! La conexión a Discord excedió el tiempo de espera.');
    console.error('\nEsto confirma que HAY un bloqueo de red específico contra Discord.');
    req.destroy();
});

req.setTimeout(10000); // 10 segundos de timeout
req.end();