/* ======================================================
   CONFIGURAÇÃO
====================================================== */

const API_URL = "https://api.semdominio.online/jogadores";
const form = document.getElementById("playerForm");

/* ======================================================
   SUBMIT DO FORMULÁRIO
====================================================== */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = buildPayload();

  if (!validatePayload(payload)) return;

  try {
    await createPlayer(payload);
    alert("Jogador cadastrado com sucesso!");
    form.reset();
  } catch (error) {
    console.error("Erro ao cadastrar jogador:", error);
    alert("Erro ao cadastrar jogador. Verifique o console.");
  }
});

/* ======================================================
   CONSTRUÇÃO DO PAYLOAD
====================================================== */

function buildPayload() {
  return {
    nome: form.nome.value.trim(),
    foto: form.foto.value.trim() || null,

    gols: Number(form.gols.value) || 0,
    vitorias: Number(form.vitorias.value) || 0,
    empate: Number(form.empate.value) || 0,
    defesa: Number(form.defesa.value) || 0,

    // INFRAÇÕES → cada uma vale -2 pontos (regra no backend)
    infracoes: Number(form.infracoes.value) || 0
  };
}

/* ======================================================
   VALIDAÇÕES
====================================================== */

function validatePayload(data) {
  if (!data.nome) {
    alert("Nome do jogador é obrigatório.");
    return false;
  }

  const numericFields = [
    "gols",
    "vitorias",
    "empate",
    "defesa",
    "infracoes"
  ];

  for (const field of numericFields) {
    if (data[field] < 0) {
      alert(`O campo "${field}" não pode ser negativo.`);
      return false;
    }
  }

  return true;
}

/* ======================================================
   REQUISIÇÃO À API
====================================================== */

async function createPlayer(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  let data;
  const contentType = response.headers.get("content-type");

  // Garante leitura correta da resposta
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(text || "Resposta inválida da API");
  }

  // Trata erro HTTP
  if (!response.ok) {
    throw new Error(data?.error || "Erro ao salvar jogador no banco");
  }

  return data;
}


/* ======================================================
   LOG
====================================================== */

console.info(
  "%cFutPontos | Cadastro ativo",
  "color:#D62828;font-weight:bold;font-size:13px"
);
