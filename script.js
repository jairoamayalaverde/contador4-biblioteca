// ===============================
// Biblioteca de Prompts – Contador 4.0
// ===============================

// --- Elementos principales ---
const addPromptBtn = document.getElementById("addPromptBtn");
const promptList = document.getElementById("promptList");
const promptModal = document.getElementById("promptModal");
const closeModal = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const modalTitle = document.getElementById("modalTitle");
const deleteBtn = document.getElementById("deletePrompt");
const saveBtn = document.getElementById("savePrompt");
const searchInput = document.getElementById("searchInput");

// --- Inputs ---
const nameInput = document.getElementById("promptName");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const textInput = document.getElementById("promptText");
const freqSelect = document.getElementById("promptFrequency");

// --- Prompts base ---
const defaultPrompts = [
  { id: "1", name: "Análisis Express Rentabilidad PYME", context: "Cliente pregunta por qué bajó la utilidad neta.", personalization: "Incluye 'sector retail Colombia'.", text: "Actúa como analista financiero experto. Evalúa los márgenes de utilidad neta de una PYME.", frequency: "semanal", fixed: true },
  { id: "2", name: "Propuesta Premium de Servicios", context: "Prospecto solicita cotización o upgrade.", personalization: "Cambio CEO por Gerente, énfasis en ROI.", text: "Redacta una propuesta contable con enfoque premium y ROI cuantificado.", frequency: "mensual", fixed: true },
  { id: "3", name: "Calendario Fiscal Automatizado", context: "Inicio de mes para planificar obligaciones.", personalization: "Solo régimen común, formato tabla.", text: "Genera un calendario fiscal automatizado con fechas y alertas.", frequency: "mensual", fixed: true },
  { id: "4", name: "Reporte Ejecutivo Semanal", context: "Todos los lunes para clientes premium.", personalization: "Dashboard visual, máximo 1 página.", text: "Elabora un reporte ejecutivo semanal con 3 métricas clave.", frequency: "semanal", fixed: true },
  { id: "5", name: "Detección de Irregularidades en Nómina", context: "Antes de procesar nómina mensual.", personalization: "Detectar duplicados, horas extras inusuales.", text: "Analiza nómina y devuelve hallazgos.", frequency: "mensual", fixed: true }
];

let userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];

// --- Renderizar tarjetas ---
function renderPrompts(list = [...defaultPrompts, ...userPrompts]) {
  promptList.innerHTML = "";
  list.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("prompt-item");
    div.innerHTML = `<h3>${p.name}</h3>`;
    div.addEventListener("click", () => openModal(p));
    promptList.appendChild(div);
  });
}

// --- Abrir modal ---
function openModal(prompt = null) {
  promptForm.reset();
  deleteBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
  modalTitle.textContent = prompt ? (prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt") : "Nuevo Prompt";

  if (prompt) {
    nameInput.value = prompt.name;
    textInput.value = prompt.text;
    contextInput.value = prompt.context;
    personalizationInput.value = prompt.personalization;
    freqSelect.value = prompt.frequency;

    const isFixed = prompt.fixed;
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = isFixed);
    if (isFixed) saveBtn.style.display = "none";
  } else {
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
  }

  promptModal.style.display = "flex";
}

// --- Cerrar modal ---
function closeModalWindow() {
  promptModal.style.display = "none";
}

// --- Eventos ---
addPromptBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);
renderPrompts();

// --- Google Sheets Modal ---
const exportBtnSheet = document.getElementById("exportBtnSheet");
const sheetModal = document.getElementById("sheetModal");
const closeSheetX = document.querySelector(".close-sheet");
const closeSheetBtn = document.getElementById("closeSheetBtn");

exportBtnSheet.addEventListener("click", () => sheetModal.style.display = "flex");
closeSheetX.addEventListener("click", () => sheetModal.style.display = "none");
closeSheetBtn.addEventListener("click", () => sheetModal.style.display = "none");
sheetModal.addEventListener("click", e => { if (e.target === sheetModal) sheetModal.style.display = "none"; });
