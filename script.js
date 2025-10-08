// ===============================
// BIBLIOTECA DE PROMPTS – CONTADOR 4.0
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

let userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];

function getAllPrompts() {
  return [...defaultPrompts, ...userPrompts];
}

function renderPrompts(list = getAllPrompts()) {
  promptList.innerHTML = "";
  list.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("prompt-item");
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p><strong>Frecuencia:</strong> ${p.frequency}</p>
      <p><strong>Contexto:</strong> ${p.context}</p>
    `;
    div.addEventListener("click", () => openModal(p));
    promptList.appendChild(div);
  });
}

function openModal(prompt = null) {
  if (prompt) {
    modalTitle.textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
    nameInput.value = prompt.name;
    textInput.value = prompt.text;
    contextInput.value = prompt.context;
    personalizationInput.value = prompt.personalization;
    freqSelect.value = prompt.frequency;
    promptForm.dataset.editId = prompt.id;
    promptForm.dataset.isFixed = prompt.fixed || false;
  } else {
    modalTitle.textContent = "Nuevo Prompt";
    promptForm.reset();
    delete promptForm.dataset.editId;
  }
  promptModal.style.display = "flex";
}

function closeModalWindow() {
  promptModal.style.display = "none";
}

promptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (promptForm.dataset.isFixed === "true") {
    alert("Los prompts base no se pueden editar.");
    return;
  }

  const data = {
    id: promptForm.dataset.editId || Date.now(),
    name: nameInput.value.trim(),
    text: textInput.value.trim(),
    context: contextInput.value.trim(),
    personalization: personalizationInput.value.trim(),
    frequency: freqSelect.value
  };

  if (promptForm.dataset.editId) {
    const i = userPrompts.findIndex(p => p.id == promptForm.dataset.editId);
    if (i > -1) userPrompts[i] = data;
  } else {
    userPrompts.push(data);
  }

  localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
  renderPrompts();
  closeModalWindow();
});

searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = getAllPrompts().filter(p =>
    p.name.toLowerCase().includes(q) || p.context.toLowerCase().includes(q)
  );
  renderPrompts(filtered);
});

addPromptBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);
renderPrompts();

// ========================================
// EXPORTAR A EXCEL CON FORMATO PROFESIONAL
// ========================================
exportBtn.addEventListener("click", exportToExcel);

function exportToExcel() {
  const prompts = getAllPrompts();

  // Crea el libro
  const wb = XLSX.utils.book_new();

  // Define los encabezados y datos
  const data = [
    ["Biblioteca de Prompts – Contador 4.0"],
    [],
    ["Nombre del Prompt", "Frecuencia", "Contexto", "Personalización", "Contenido del Prompt"]
  ];

  prompts.forEach(p => {
    data.push([p.name, p.frequency, p.context, p.personalization, p.text]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Estilos manuales de columnas
  ws['!cols'] = [
    { wch: 35 }, // Nombre
    { wch: 12 }, // Frecuencia
    { wch: 40 }, // Contexto
    { wch: 35 }, // Personalización
    { wch: 60 }  // Contenido
  ];

  // Aplica negrita y colores de encabezado
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = ws[XLSX.utils.encode_cell({ r: 2, c: C })];
    if (cell && cell.v) {
      cell.s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "E86C2A" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "FFFFFF" } },
          bottom: { style: "thin", color: { rgb: "FFFFFF" } }
        }
      };
    }
  }

  // Título estilizado
  ws["A1"].s = {
    font: { bold: true, sz: 16, color: { rgb: "0A2342" } },
    alignment: { horizontal: "left" }
  };

  XLSX.utils.book_append_sheet(wb, ws, "Prompts");
  XLSX.writeFile(wb, "Biblioteca_Prompts_Contador40.xlsx");
}
