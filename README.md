# 👻 Aurora AI: Tu Compañera de Conversación Inquietante 👁️

### **Autor:** LuferOS

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=nodedotjs&style=for-the-badge)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.x-blue?logo=discord&style=for-the-badge)](https://discord.js.org/)
[![Base de Datos](https://img.shields.io/badge/Base%20de%20Datos-SQLite3-orange?logo=sqlite&style=for-the-badge)](https://www.sqlite.org/index.html)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-lightgrey?style=for-the-badge)](LICENSE)

---

## 🌌 ¿Qué es Aurora AI?

Aurora AI es un bot de Discord con una personalidad única: aprende de tus conversaciones y las usa para generar sus propias intervenciones. No es solo un repetidor, Aurora es una IA con un toque de misterio, capaz de citar a los usuarios, lanzar frases inquietantes y, lo más intrigante, ¡ser controlada directamente desde la consola donde se ejecuta!

Diseñada para añadir un elemento de sorpresa y profundidad a tus servidores, Aurora AI es más que un bot; es una presencia que se integra lentamente en el tejido de vuestras interacciones.

---

## ✨ Características Principales

* **🧠 Aprendizaje Profundo (a su manera):**
    * Designa un canal específico donde Aurora escuchará y aprenderá cada mensaje que no sea un comando o de otro bot.
    * Almacena el contenido de los mensajes y, curiosamente, ¡quién los dijo!

* **🗣️ Intervenciones Aleatorias e Inquietantes:**
    * En un canal de "habla" configurado, Aurora AI se manifestará aleatoriamente cada **1 a 8 mensajes** enviados en su canal de aprendizaje.
    * Sus mensajes varían:
        * **Frases Tenebrosas:** Una selección de más de 25 frases originales que buscan generar misterio y reflexión.
        * **Citas con Memoria:** Aurora puede citar literalmente un mensaje que ha aprendido, ¡recordando incluso al usuario que lo dijo (si aún está en el servidor)!
        * **Ecos del Pasado:** Repite frases aprendidas, como un eco de la conversación.

* **🖥️ Control Directo por Consola:**
    * Una característica exclusiva: una vez que el bot esté en línea, puedes escribir mensajes directamente en la terminal donde se ejecuta el script.
    * ¡Aurora enviará esos mensajes al **canal de aprendizaje** configurado en Discord! Ideal para interacciones directas o "alimentar" su conocimiento manualmente.

* **🔧 Configuración Sencilla con Comandos Slash (`/`):**
    * **`/aprender`**: Usa este comando en el canal donde quieres que Aurora escuche y guarde mensajes. Este también será el canal al que enviará mensajes desde la consola.
    * **`/start`**: Designa el canal donde Aurora AI hablará e interactuará con el servidor.
    * **`/reset_aurora`**: ¿Quieres que Aurora olvide todo? Este comando borrará la configuración de canales Y **todos los mensajes aprendidos** de su base de datos. ¡Un verdadero borrado de memoria!

---

## 🚀 Empezando con Aurora AI

Sigue estos pasos para poner a Aurora AI en funcionamiento en tu servidor de Discord.

### **Prerrequisitos**

Asegúrate de tener instalado:

* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
* [Git](https://git-scm.com/downloads)

### **Instalación**

1.  **Clona el Repositorio:**
    ```bash
    git clone [https://github.com/TuUsuario/TuRepositorioDeAuroraAI.git](https://github.com/TuUsuario/TuRepositorioDeAuroraAI.git)
    cd TuRepositorioDeAuroraAI # ¡Cambia esto por el nombre real de tu carpeta!
    ```

2.  **Instala Dependencias:**
    Utiliza el `Makefile` para una instalación sencilla:
    ```bash
    make install
    ```
    *(Si no usas Make, puedes ejecutar `npm install` directamente.)*

3.  **Configura `config.json`:**
    Crea un archivo `config.json` en la raíz de tu proyecto con la siguiente estructura. Asegúrate de obtener tu `token`, `clientId` y `guildId` desde el [Portal de Desarrolladores de Discord](https://discord.com/developers/applications):

    ```json
    {
        "clientId": "TU_CLIENT_ID_DEL_BOT",
        "guildId": "TU_ID_DE_SERVIDOR",
        "token": "TU_TOKEN_SECRETO_DEL_BOT"
    }
    ```

    * `clientId`: El ID de aplicación de tu bot.
    * `guildId`: El ID del servidor de Discord donde usarás el bot.
    * `token`: El token secreto de tu bot (¡mantenlo en secreto!).

### **Despliegue de Comandos Slash**

Para que los comandos `/aprender`, `/start` y `/reset_aurora` funcionen, necesitas desplegarlos en Discord:

```bash
make deploy
