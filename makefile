# ================================================================
# |                  Makefile para Aurora AI                    |
# |                      Autor: LuferOS                         |
# ================================================================
# Este Makefile te ayuda a gestionar tu bot de Discord Aurora AI
# automatizando tareas comunes. No es donde vive el código de tu bot,
# sino una herramienta para ejecutar comandos de forma sencilla.

# ----------------------------------------------------------------
# Variables del Proyecto
# ----------------------------------------------------------------
BOT_MAIN_FILE = index.js
DEPLOY_COMMANDS_FILE = deploy-commands.js
DB_FILE = database.db
NODE_MODULES_DIR = node_modules

# ----------------------------------------------------------------
# Reglas Falsas (Phony Targets)
# Evita conflictos con archivos que puedan tener el mismo nombre que una regla.
# ----------------------------------------------------------------
.PHONY: all install start deploy reset-db clean help


# ----------------------------------------------------------------
# Regla por Defecto (Ejecuta 'help' si no se especifica una regla)
# ----------------------------------------------------------------
all: help


# ----------------------------------------------------------------
# Reglas de Gestión del Proyecto
# ----------------------------------------------------------------

# @brief Instala todas las dependencias de Node.js (npm install).
# @usage make install
install:
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║      Instalando dependencias de Node.js      ║"
	@echo "╚══════════════════════════════════════════════╝"
	npm install
	@echo "✓ Dependencias instaladas. ¡Aurora está casi lista!"
	@echo ""

# @brief Inicia el bot Aurora AI.
#        Asegura que las dependencias estén instaladas primero.
# @usage make start
start: $(NODE_MODULES_DIR) # Depende de que node_modules exista
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║            Iniciando Aurora AI...            ║"
	@echo "╚══════════════════════════════════════════════╝"
	node $(BOT_MAIN_FILE)

# @brief Despliega/actualiza los comandos slash en Discord.
#        Necesitas ejecutar esto cada vez que cambies tus comandos.
# @usage make deploy
deploy: $(NODE_MODULES_DIR) # Depende de que node_modules exista
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║        Desplegando comandos Slash...         ║"
	@echo "╚══════════════════════════════════════════════╝"
	node $(DEPLOY_COMMANDS_FILE)
	@echo "✓ Comandos Slash desplegados. Puede tomar unos minutos para que aparezcan en Discord."
	@echo "✨ Recuerda: Primero haz 'make deploy', luego 'make start'."
	@echo ""

# @brief Reinicia la base de datos de Aurora.
#        ¡CUIDADO! Esto eliminará TODOS los mensajes aprendidos y la configuración de canales.
# @usage make reset-db
reset-db:
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║    Reiniciando la base de datos de Aurora    ║"
	@echo "╚══════════════════════════════════════════════╝"
	@echo ""
	@echo "💀 ¡ADVERTENCIA CRÍTICA! 💀"
	@echo "Esto borrará TODOS los mensajes que Aurora ha aprendido y los IDs de canal configurados."
	@echo "¿Estás ABSOLUTAMENTE seguro de querer borrar la memoria de Aurora? (escribe 'si' para confirmar)"
	@read -p "> " CONFIRM_RESET_DB; \
	if [ "$$CONFIRM_RESET_DB" = "si" ]; then \
		if [ -f "$(DB_FILE)" ]; then \
			rm $(DB_FILE); \
			echo "✓ Base de datos '$(DB_FILE)' eliminada. Aurora ha olvidado todo."; \
			echo "Se recreará automáticamente la próxima vez que inicies el bot."; \
		else \
			echo "ℹ️ La base de datos '$(DB_FILE)' no existe. No hay nada que borrar."; \
		fi; \
		echo "✨ La memoria de Aurora ha sido reseteada. Un nuevo comienzo aguarda." \
	else \
		echo "❌ Operación cancelada. ¡La memoria de Aurora está a salvo por ahora!" \
	fi
	@echo ""

# @brief Realiza una limpieza profunda del proyecto.
#        Elimina la carpeta node_modules y la base de datos.
# @usage make clean
clean:
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║          Limpiando proyecto Aurora           ║"
	@echo "╚══════════════════════════════════════════════╝"
	@echo ""
	@echo "🧹 Esto eliminará la carpeta '$(NODE_MODULES_DIR)' y la base de datos '$(DB_FILE)'."
	@echo "¿Estás seguro de querer limpiar todo? (escribe 'si' para confirmar)"
	@read -p "> " CONFIRM_CLEAN_ALL; \
	if [ "$$CONFIRM_CLEAN_ALL" = "si" ]; then \
		if [ -d "$(NODE_MODULES_DIR)" ]; then \
			rm -rf $(NODE_MODULES_DIR); \
			echo "✓ Carpeta '$(NODE_MODULES_DIR)' eliminada."; \
		else \
			echo "ℹ️ La carpeta '$(NODE_MODULES_DIR)' no existe. Nada que eliminar aquí."; \
		fi; \
		if [ -f "$(DB_FILE)" ]; then \
			rm $(DB_FILE); \
			echo "✓ Base de datos '$(DB_FILE)' eliminada."; \
		else \
			echo "ℹ️ La base de datos '$(DB_FILE)' no existe. Nada que eliminar aquí."; \
		fi; \
		echo "✨ Limpieza profunda completada. ¡El proyecto está como nuevo!" \
	else \
		echo "❌ Limpieza cancelada. ¡Todo se mantiene en su lugar!" \
	fi
	@echo ""

# ----------------------------------------------------------------
# Regla de Ayuda (Muestra todos los comandos disponibles)
# ----------------------------------------------------------------

# @brief Muestra este mensaje de ayuda con todos los comandos disponibles.
# @usage make help
help:
	@echo "╔══════════════════════════════════════════════╗"
	@echo "║           Ayuda para Aurora AI (Makefile)           ║"
	@echo "╚══════════════════════════════════════════════╝"
	@echo ""
	@echo "🌟 ¡Bienvenido, Operador de Aurora! 🌟"
	@echo "Este Makefile te facilita la gestión de tu bot. Usa 'make <comando>'."
	@echo ""
	@echo "➡️ Comandos Esenciales:"
	@echo "  make install        - Instala todas las dependencias necesarias."
	@echo "                        (Ejecútalo la primera vez y después de 'make clean')."
	@echo "  make start          - Inicia a Aurora AI. La mantendrá en línea."
	@echo "  make deploy         - Despliega/actualiza los comandos slash en Discord."
	@echo "                        (¡Importante! Haz esto si añades o cambias comandos)."
	@echo ""
	@echo "➡️ Comandos de Mantenimiento (¡Úsalos con precaución!):"
	@echo "  make reset-db       - Elimina SOLO la base de datos de Aurora."
	@echo "                        (Borrará todos sus mensajes aprendidos y config. de canales)."
	@echo "  make clean          - Realiza una limpieza total: elimina 'node_modules'"
	@echo "                        y la base de datos. Requiere 'make install' después."
	@echo ""
	@echo "➡️ Otros Comandos:"
	@echo "  make help           - Muestra este mensaje de ayuda."
	@echo ""
	@echo "Creado con devoción por LuferOS."
	@echo "¡Que los susurros de Aurora te acompañen!"
	@echo ""

# ----------------------------------------------------------------
# Verificación de Dependencias (Interna)
# ----------------------------------------------------------------
# Si la carpeta node_modules no existe, intenta instalar las dependencias.
$(NODE_MODULES_DIR):
	@echo "🚨 La carpeta '$(NODE_MODULES_DIR)' no se encuentra. Ejecutando 'make install' automáticamente..."
	@make install
