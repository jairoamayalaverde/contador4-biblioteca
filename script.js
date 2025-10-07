// ===============================
// BIBLIOTECA DE PROMPTS – CONTADOR 4.0 (Versión Opción B + íconos)
// ===============================

const addPromptBtn = document.getElementById("addPromptBtn");
const promptModal = document.getElementById("promptModal");
const closeModal = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const promptList = document.getElementById("promptList");
const modalTitle = document.getElementById("modalTitle");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.getElementById("searchInput");

const nameInput = document.getElementById("promptName");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const textInput = document.getElementById("promptText");
const freqSelect = document.getElementById("promptFrequency");

// --- Prompts base (inamovibles) ---
const defaultPrompts = [
  {
    id: "base-1",
    name: "Análisis Express Rentabilidad PYME",
    context: "Cliente pregunta por qué bajó la utilidad neta.",
    personalization: "Incluye 'sector retail Colombia' y lenguaje simple.",
    text: "Actúa como analista financiero experto. Evalúa los márgenes de utilidad neta de una PYME del sector retail colombiano.",
    frequency: "semanal",
    fixed: true
  },
  {
    id: "base-2",
    name: "Propuesta Premium de Servicios",
    context: "Prospecto solicita cotización o upgrade de cliente actual.",
    personalization: "Cambio CEO por Gerente, énfasis en ROI cuantificado.",
    text: "Redacta una propuesta contable con enfoque premium para retener clientes y destacar ROI con claridad.",
    frequency: "mensual",
    fixed: true
  },
  {
    id: "base-3",
    name: "Calendario Fiscal Automatizado",
    context: "Inicio de mes para planificar obligaciones.",
    personalization: "Solo clientes régimen común, formato tabla con alertas.",
    text: "Genera un calendario fiscal automatizado para empresas en régimen común con fechas y alertas críticas.",
    frequency: "mensual",
    fixed: true
  },
  {
    id: "base-4",
    name: "Reporte Ejecutivo Semanal",
    context: "Todos los lunes para clientes premium.",
    personalization: "Dashboard visual, máximo 1 página, 3 métricas clave.",
    text: "Elabora un reporte ejecutivo semanal con resumen financiero, proyección y 3 métricas clave.",
    frequency: "semanal",
    fixed: true
  },
  {
    id: "base-5",
    name: "Detección de Irregularidades en Nómina",
    context: "Antes de procesar nómina mensual.",
    personalization: "Detectar duplicados, horas extras inusuales y empleados inactivos.",
    text: "Analiza nómina y devuelve hallazgos: duplicados, horas extras anómalas, posibles empleados fantasma.",
    frequency: "mensual",
    fixed: true
  }
];

// --- Prompts personales del usuario ---
let userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];

// Combinar todos
function getAllPrompts() {
  return [...defaultPrompts, ...userPrompts];
}

// --- Renderizar lista ---
function renderPrompts(list = getAllPrompts()) {
  promptList.innerHTML = "";

  list.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("prompt-item");
    if (p.fixed) div.classList.add("fixed");

    // Icono tipo (SVG inline minimalista)
    const icon = p.fixed
      ? `<svg width="18" height="18" fill="#0A2342" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H17.5A2.5 2.5 0 0 0 20 19.5V4.5A2.5 2.5 0 0 0 17.5 2H6.5A2.5 2.5 0 0 0 4 4.5V19.5ZM6 4.5A.5.5 0 0 1 6.5 4H17.5A.5.5 0 0 1 18 4.5V19.5A.5.5 0 0 1 17.5 20H6.5A.5.5 0 0 1 6 19.5V4.5ZM8 6H16V8H8V6Z"/></svg>`
      : `<svg width="18" height="18" fill="#E86C2A" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.001 1.001 0 0 0 0-1.42l-2.34-2.34a1.001 1.001 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>`;

    div.innerHTML = `
      <div class="prompt-header">
        <h3>${icon} ${p.name}</h3>
      </div>
      <p><strong>Frecuencia:</strong> ${p.frequency.charAt(0).toUpperCase() + p.frequency.slice(1)}</p>
      <p><strong>Contexto:</strong> ${p.context}</p>
    `;

    div.addEventListener("click", () => openModal(p));
    promptList.appendChild(div);
  });
}

// --- Modal ---
function openModal(prompt = null) {
  if (prompt) {
    modalTitle.textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
    nameInput.value = prompt.name;
    contextInput.value = prompt.context;
    personalizationInput.value = prompt.personalization;
    textInput.value = prompt.text;
    freqSelect.value = prompt.frequency;
    promptForm.dataset.editId = prompt.id;
    promptForm.dataset.isFixed = prompt.fixed || false;

    // Desactivar edición si es base
    promptForm.querySelectorAll("input, textarea, select").forEach(el => {
      el.disabled = prompt.fixed ? true : false;
    });
  } else {
    modalTitle.textContent = "Nuevo Prompt";
    promptForm.reset();
    delete promptForm.dataset.editId;
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
  }
  promptModal.style.display = "flex";
}

function closeModalWindow() {
  promptModal.style.display = "none";
}

// --- Guardar / actualizar ---
promptForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (promptForm.dataset.isFixed === "true") {
    alert("Los prompts base no se pueden editar.");
    return;
  }

  const promptData = {
    id: promptForm.dataset.editId ? promptForm.dataset.editId : Date.now(),
    name: nameInput.value.trim(),
    context: contextInput.value.trim(),
    personalization: personalizationInput.value.trim(),
    text: textInput.value.trim(),
    frequency: freqSelect.value
  };

  if (promptForm.dataset.editId) {
    const index = userPrompts.findIndex(p => p.id == promptForm.dataset.editId);
    if (index > -1) userPrompts[index] = promptData;
  } else {
    userPrompts.push(promptData);
  }

  localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
  renderPrompts();
  closeModalWindow();
});

// --- Buscar ---
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = getAllPrompts().filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.context.toLowerCase().includes(query)
  );
  renderPrompts(filtered);
});

// --- Exportar CSV ---
exportBtn.addEventListener("click", () => {
  const headers = ["Nombre", "Contexto", "Personalización", "Texto", "Frecuencia", "Tipo"];
  const rows = getAllPrompts().map(p => [
    p.name, p.context, p.personalization, p.text, p.frequency, p.fixed ? "Base" : "Personal"
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "biblioteca_prompts_contador4.csv";
  link.click();
});

// --- Botones principales ---
addPromptBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);

// --- Render inicial ---
renderPrompts();
