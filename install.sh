#!/usr/bin/env bash
# install.sh — enlaza Folio como skill en tu agente de código.
#   ./install.sh                # Claude Code
#   ./install.sh --codex        # Codex
#   ./install.sh --all-agents   # ambos
# Al ser un enlace, un `git pull` deja Folio actualizado al instante.
set -e
ORIGEN="$(cd "$(dirname "$0")" && pwd)"
NOMBRE="folio"

enlazar() {
  local destino="$1"
  mkdir -p "$(dirname "$destino")"
  rm -rf "$destino"
  ln -s "$ORIGEN" "$destino" 2>/dev/null || cp -r "$ORIGEN" "$destino"
  echo "  ✓ $destino"
}

CLAUDE=1; CODEX=0
for a in "$@"; do
  case "$a" in
    --codex) CLAUDE=0; CODEX=1 ;;
    --all-agents) CLAUDE=1; CODEX=1 ;;
  esac
done

echo "Instalando Folio desde $ORIGEN"
[ "$CLAUDE" = 1 ] && enlazar "$HOME/.claude/skills/$NOMBRE"
[ "$CODEX" = 1 ] && enlazar "$HOME/.codex/skills/$NOMBRE"
echo "Listo. Abre tu agente en la carpeta de tu proyecto y pídele que use Folio."
