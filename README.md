# 📖 Folio

> Skill de **gusto de diseño** para agentes de código. Hace que las páginas se
> vean diseñadas con intención en vez de genéricas.

Folio no es una plantilla: es un **criterio**. Le da a un agente (como Claude
Code) el gusto para maquetar una página con una dirección clara, jerarquía real
y aire, y para revisar el resultado hasta que quede bien. Funciona con HTML
puro, React, Vue o Svelte, porque trata del diseño, no del framework.

Software propietario de **Vemoris Software**. Ver [LICENSE](LICENSE).

## Cómo funciona

Folio le da al agente un proceso en 5 pasos:

1. **Entender** qué es lo único importante de la página.
2. **Elegir una dirección de arte** (una sola) según lo que sea la página.
3. **Aplicar el sistema** (paleta, tipografía, espaciado, movimiento).
4. **Construir con contenido real** (nada de relleno ni cajas grises).
5. **Revisar** en tres anchos contra una lista, y corregir.

## Direcciones de arte

Una **dirección** es la personalidad visual de la página. Se elige una sola:

| Dirección | Para páginas que… |
|---|---|
| **Editorial sereno** | explican o convencen con texto |
| **Monolito** | tienen una sola idea potente |
| **Índice** | listan o estructuran cosas |
| **Terminal** | son técnicas o para programadores |
| **Galería** | muestran imágenes o trabajo |

## Estructura

```
folio/
├── SKILL.md              # el criterio y el proceso (lo que lee el agente)
├── sistema/tokens.md     # paleta, tipografía, espaciado, movimiento
├── direcciones/          # las 5 direcciones de arte
└── revisar/lista.md      # la lista de revisión final
```

## Usarla

Folio es una skill: apúntala a tu agente de código (por ejemplo Claude Code) en
la carpeta de tu proyecto web y pídele que rediseñe o construya una página con
Folio. El agente leerá `SKILL.md` y seguirá el proceso.

Trae un sistema por defecto (editorial, cálido y sobrio), pero puedes
reemplazar los tokens por los de tu propia marca sin perder el gusto — las
direcciones y la lista de revisión valen para cualquier identidad (ver el final
de `sistema/tokens.md`).

## La filosofía en tres reglas

1. Una sola idea manda por pantalla.
2. La tipografía hace el trabajo pesado.
3. El color se usa con avaricia.
