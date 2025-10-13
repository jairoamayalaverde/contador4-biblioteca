// ===============================
// BIBLIOTECA DE PROMPTS – CONTADOR 4.0
// ===============================

// --- Elementos del DOM ---
const addPromptBtn = document.getElementById("addPromptBtn");
const promptModal = document.getElementById("promptModal");
const closeModal = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const promptList = document.getElementById("promptList");
const modalTitle = document.getElementById("modalTitle");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.getElementById("searchInput");
const deleteBtn = document.getElementById("deletePrompt");
const saveBtn = document.getElementById("savePrompt");

const nameInput = document.getElementById("promptName");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const textInput = document.getElementById("promptText");
const freqSelect = document.getElementById("promptFrequency");

// --- Prompts base ---
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

// --- Combinar todos los prompts ---
function getAllPrompts() {
  return [...defaultPrompts, ...userPrompts];
}

// --- Renderizar tarjetas tipo Notion ---
function renderPrompts(list = getAllPrompts()) {
  promptList.innerHTML = "";
  list.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("prompt-item");
    if (p.fixed) div.classList.add("fixed");
    div.innerHTML = `<h3>${p.name}</h3>`;
    div.addEventListener("click", () => openModal(p));
    promptList.appendChild(div);
  });
}

// --- Abrir modal ---
function openModal(prompt = null) {
  deleteBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
  promptForm.reset();

  if (prompt) {
    modalTitle.textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
    nameInput.value = prompt.name;
    textInput.value = prompt.text;
    contextInput.value = prompt.context;
    personalizationInput.value = prompt.personalization;
    freqSelect.value = prompt.frequency;
    promptForm.dataset.editId = prompt.id;
    promptForm.dataset.isFixed = prompt.fixed || false;

    const isFixed = prompt.fixed === true;
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = isFixed);

    // Si es prompt base: ocultar Guardar y Eliminar
    if (isFixed) {
      saveBtn.style.display = "none";
      deleteBtn.style.display = "none";
    } else {
      deleteBtn.style.display = "inline-block";
    }
  } else {
    modalTitle.textContent = "Nuevo Prompt";
    delete promptForm.dataset.editId;
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
  }

  promptModal.style.display = "flex";
}

// --- Cerrar modal ---
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

// --- Eliminar prompt ---
deleteBtn.addEventListener("click", () => {
  const id = promptForm.dataset.editId;
  if (!id) return;
  if (confirm("¿Seguro que deseas eliminar este prompt?")) {
    userPrompts = userPrompts.filter(p => p.id != id);
    localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
    renderPrompts();
    closeModalWindow();
  }
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

// --- Exportar Excel desde GitHub (versión oficial) ---
exportBtn.addEventListener("click", () => {
  const fileUrl =
    "https://raw.githubusercontent.com/jairoamayalaverde/contador4-biblioteca/main/Biblioteca%20de%20Prompts%20Contador%204.0.xlsx";
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "Biblioteca_de_Prompts_Contador_4.0.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// --- Eventos principales ---
addPromptBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);

// --- Render inicial ---
renderPrompts();
