/* ======================================================
   CONFIGURAÇÃO DA API
====================================================== */

export const API_BASE_URL = "https://api.semdominio.online";

/**
 * Cliente padrão para comunicação com a API
 */
export async function apiRequest(endpoint, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Só adiciona body se existir (evita erro em GET)
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Erro na comunicação com a API");
  }

  return response.json();
}

/* ======================================================
   REGRAS DE NEGÓCIO
====================================================== */

/**
 * Regra oficial de pontuação do FutPontos
 * - Vitória: +3
 * - Empate: +1
 * - Defesa: +1
 * - Gol: +2
 * - Infração: -2
 */
export function calculatePoints(
  vitorias = 0,
  empates = 0,
  defesas = 0,
  gols = 0,
  infracoes = 0
) {
  return (
    Number(vitorias) * 3 +
    Number(empates) +
    Number(defesas) +
    Number(gols) * 2 -
    Number(infracoes) * 2
  );
}

/* ======================================================
   UI GLOBAL
====================================================== */

export function showFeedback(message, type = "success") {
  const container = document.getElementById("feedback");
  if (!container) return;

  container.innerHTML = "";

  const div = document.createElement("div");
  div.className = `feedback ${type}`;
  div.textContent = message;

  container.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

/* ======================================================
   UX GLOBAL (MENU / FOOTER)
====================================================== */

function initGlobalUI() {

  /* ===== MENU MOBILE ===== */
  const menuButton = document.getElementById("menuButton");
  const menu = document.getElementById("menu");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      menu.classList.toggle("visible");
    });
  }

  /* ===== LINK ATIVO ===== */
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === currentPage
    );
  });

  /* ===== FOOTER DINÂMICO ===== */
  const footer = document.querySelector("footer");
  if (footer) {
    footer.innerHTML = `© ${new Date().getFullYear()} FutPontos`;
  }

  /* ===== LOG ===== */
  console.info(
    "%cFutPontos conectado à API",
    "color:#ffcc00;font-weight:bold"
  );
}

document.addEventListener("DOMContentLoaded", initGlobalUI);
