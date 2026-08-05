# AGENTS.md

Reglas permanentes para asistentes de IA que trabajen en este proyecto.

## Reglas de oro

1. **No ejecutar git** (init, add, commit, push, merge, branch, checkout, pull, etc.) salvo pedido explícito del usuario.
2. **No hacer deploys** (Vercel, Netlify, etc.) salvo pedido explícito del usuario.
3. **Solo modificar archivos del juego**: `index.html`, `css/`, `js/` y estos documentos de proyecto (`AGENTS.md`, `README.md`, `.gitignore`). No crear archivos sueltos fuera de esa estructura.
4. **Avanzar por tandas pequeñas.** Cada tanda es un cambio chico y verificable. No reescribir código existente; iterar sobre la base actual. Si una tanda se vuelve grande, dividirla.
5. **Verificar antes de dar una tanda por terminada**: correr la simulación Node (autojugador con las 4 clases) y el chequeo de sintaxis de todos los `.js`.
6. **Responder en español.**
7. **No agregar comentarios al código** salvo pedido explícito.

## El proyecto

- Juego web estilo Cadash (action-RPG de scroll lateral, Taito 1989), canvas 320x224, sin dependencias ni build. Funciona abriendo `index.html` directamente.
- **Sin ES modules**: scripts clásicos cargados en orden en `index.html`. Las clases/constantes son globales (ej. `CONFIG`, `Input`, `Player`, `Level1`).

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | Página y orden de carga de scripts (NO reordenar sin revisar dependencias). |
| `css/style.css` | Estilos y escalado retro del canvas. |
| `js/config.js` | Constantes de juego (tamaño, física) y helper `clamp`. |
| `js/input.js` | Mapa de acciones a teclas (`left`, `right`, `down`, `jump`, `attack`). |
| `js/entities/classes.js` | Datos de los 4 personajes. |
| `js/entities/sprites.js` | Sprites pixel-art (poses, paletas, acentos de clase, enemigo). |
| `js/entities/player.js` | Física, colisiones y ataque del jugador. |
| `js/entities/enemy.js` | Enemigos: vida, patrulla y colisiones. |
| `js/levels/level1.js` | Tilemap del nivel 1 y posiciones de enemigos. |
| `js/camera.js` | Cámara con scroll. |
| `js/render.js` | Dibujado (nivel, jugador, HUD, menú). |
| `js/main.js` | Loop del juego y máquina de estados (`menu`, `play`, `complete`). |

## Controles (por si se modifica input.js)

- Mover: `←` `→` o `A` `D`
- Saltar: `↑` `W` `Espacio` `K`
- Agacharse: `↓` `S` (reservado)
- Golpear: `Ctrl` `J` (combate activo desde tanda 2)

## Hoja de ruta de tandas

1. ✅ Motor base: menú, 4 personajes, nivel con scroll, física, cámara, HUD.
2. ✅ Enemigos con vida + ataque cuerpo a cuerpo.
3. XP, niveles y stats RPG.
4. Magia/MP, enemigos a distancia, objetos/pociones.
5. Tiendas y NPCs.
6. Jefes finales.

## Cómo verificar

- Sintaxis: `node --check <archivo>.js` en cada `.js`.
- Física/nivel: simulación Node con un autojugador (mover+saltar sobre pozos/muros) corriendo cada una de las 4 clases de punta a punta del nivel.
- Combate: el autojugador debe derrotar a todos los enemigos y completar el nivel con las 4 clases.
