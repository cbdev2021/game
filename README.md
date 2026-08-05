# Cadash Web

Juego web estilo **Cadash** (action-RPG de scroll lateral, Taito 1989) hecho con HTML + CSS + JavaScript puro y Canvas 2D. Sin dependencias ni build: se abre `index.html` y funciona.

## Cómo jugar

1. Abrir `index.html` en el navegador (o servirlo con `npx serve .`).
2. Elegir personaje con `←` `→` y comenzar con Saltar/Golpear.

## Controles

| Acción | Teclas |
|---|---|
| Moverse | `←` `→` o `A` `D` |
| Saltar | `↑` `W` `Espacio` `K` |
| Agacharse | `↓` `S` |
| Golpear | `Ctrl` `J` |

## Personajes

- **Guerrero**: más HP, golpe fuerte, salto medio.
- **Mago**: mucha MP, menos HP, golpe débil.
- **Ninja**: el más rápido, salto alto, golpe medio.
- **Sacerdotisa**: HP y MP balanceados, golpe medio.

## Hoja de ruta

1. ✅ Motor base: menú, 4 personajes, nivel 1 con scroll, física, cámara, HUD.
2. ✅ Enemigos con vida + ataque cuerpo a cuerpo.
3. ⏳ XP, niveles y stats RPG.
4. Magia/MP, enemigos a distancia, objetos/pociones.
5. Tiendas y NPCs.
6. Jefes finales.

## Estructura

```
css/style.css     Estilos y escalado retro
js/config.js      Constantes de juego y física
js/input.js       Controles (acciones a teclas)
js/entities/      Personajes (classes.js) y jugador (player.js)
js/levels/        Tilemap del nivel 1
js/camera.js      Cámara con scroll
js/render.js      Dibujado (nivel, jugador, HUD, menú)
js/main.js        Loop del juego y estados
```
