// ===============================
// BIBLIOTECA DE PROMPTS – CONTADOR 4.0
// ===============================

// --- Elementos del DOM ---
const addPromptBtn = document.getElementById("addPromptBtn");
const promptModal = document.getElementById("promptModal");
const closeModalBtns = document.querySelectorAll(".close-modal");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const promptList = document.getElementById("promptList");
const modalOverlay = document.getElementById("modalOverlay");
const exportBtn = document.getElementById("exportBtn");
const deleteBtn = document.getElementById("deletePrompt");
const saveBtn = document.getElementById("savePrompt");

// Campos
const nameInput = document.getElementById("promptName");
const textInput = document.getElementById("promptText");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const freqSelect = document.getElementById("promptFrequency");

// --- Prompts base ---
const defaultPrompts = [
  { id: "base-1", name: "Análisis Express Rentabilidad PYME", context: "Cliente pregunta por qué bajó la utilidad neta.", personalization: "Incluye 'sector retail Colombia' y lenguaje simple.", text: "Actúa como analista financiero experto. Evalúa los márgenes de utilidad neta de una PYME del sector retail colombiano.", frequency: "semanal", fixed: true },
  { id: "base-2", name: "Propuesta Premium de Servicios", context: "Prospecto solicita cotización o upgrade de cliente actual.", personalization: "Cambio CEO por Gerente, énfasis en ROI cuantificado.", text: "Redacta una propuesta contable con enfoque premium para retener clientes y destacar ROI con claridad.", frequency: "mensual", fixed: true },
  { id: "base-3", name: "Calendario Fiscal Automatizado", context: "Inicio de mes para planificar obligaciones.", personalization: "Solo clientes régimen común, formato tabla con alertas.", text: "Genera un calendario fiscal automatizado para empresas en régimen común con fechas y alertas críticas.", frequency: "mensual", fixed: true },
  { id: "base-4", name: "Reporte Ejecutivo Semanal", context: "Todos los lunes para clientes premium.", personalization: "Dashboard visual, máximo 1 página, 3 métricas clave.", text: "Elabora un reporte ejecutivo semanal con resumen financiero, proyección y 3 métricas clave.", frequency: "semanal", fixed: true },
  { id: "base-5", name: "Detección de Irregularidades en Nómina", context: "Antes de procesar nómina mensual.", personalization: "Detectar duplicados, horas extras inusuales y empleados inactivos.", text: "Analiza nómina y devuelve hallazgos: duplicados, horas extras anómalas, posibles empleados fantasma.", frequency: "mensual", fixed: true }
];

let userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];

// --- Renderizar tarjetas ---
function renderPrompts() {
  promptList.innerHTML = "";
  const allPrompts = [...defaultPrompts, ...userPrompts];

  allPrompts.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("prompt-item");
    if (p.fixed) div.classList.add("fixed");
    div.innerHTML = `<h3>${p.name}</h3>`;
    div.addEventListener("click", () => openModal(p));
    promptList.appendChild(div);
  });
}

// --- Modal control ---
function openModal(prompt = null) {
  modalOverlay.style.display = "block";
  promptModal.style.display = "block";

  promptForm.reset();
  deleteBtn.style.display = "none";
  saveBtn.style.display = "inline-block";

  if (prompt) {
    document.getElementById("modalTitle").textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
    nameInput.value = prompt.name;
    textInput.value = prompt.text;
    contextInput.value = prompt.context;
    personalizationInput.value = prompt.personalization;
    freqSelect.value = prompt.frequency;
    promptForm.dataset.editId = prompt.id;
    const isFixed = prompt.fixed === true;

    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = isFixed);
    if (isFixed) saveBtn.style.display = "none";
    else deleteBtn.style.display = "inline-block";
  } else {
    document.getElementById("modalTitle").textContent = "Nuevo Prompt";
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
  }
}

function closeModal() {
  promptModal.style.display = "none";
  modalOverlay.style.display = "none";
}

// Eventos modal
closeModalBtns.forEach(btn => btn.addEventListener("click", closeModal));
cancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

// --- Guardar / eliminar ---
promptForm.addEventListener("submit", e => {
  e.preventDefault();
  const id = promptForm.dataset.editId;

  const data = {
    id: id ? id : Date.now(),
    name: nameInput.value.trim(),
    text: textInput.value.trim(),
    context: contextInput.value.trim(),
    personalization: personalizationInput.value.trim(),
    frequency: freqSelect.value
  };

  if (id) {
    const i = userPrompts.findIndex(p => p.id == id);
    userPrompts[i] = data;
  } else {
    userPrompts.push(data);
  }

  localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
  renderPrompts();
  closeModal();
});

deleteBtn.addEventListener("click", () => {
  const id = promptForm.dataset.editId;
  if (confirm("¿Eliminar este prompt?")) {
    userPrompts = userPrompts.filter(p => p.id != id);
    localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
    renderPrompts();
    closeModal();
  }
});

// --- Exportar XLSX desde GitHub ---
exportBtn.addEventListener("click", () => {
  window.open("https://github.com/jairoamayalaverde/contador4-biblioteca/raw/main/Biblioteca%20de%20Prompts%20Contador%204.0.xlsx", "_blank");
});

// --- Inicialización ---
addPromptBtn.addEventListener("click", () => openModal());
renderPrompts();
