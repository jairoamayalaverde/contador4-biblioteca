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

// --- Obtener todos los prompts ---
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

    if (!prompt.fixed) {
      deleteBtn.style.display = "inline-block";
    } else {
      // Si es base, ocultar botón Guardar
      saveBtn.style.display = "none";
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

// --- Exportar Excel coherente con formato oficial ---
exportBtn.addEventListener("click", () => {
  const prompts = getAllPrompts();

  const creditRow = [
    "Biblioteca de Prompts es un desarrollo de Jairo Amaya – Full Stack Marketer, " +
    "creado como complemento del E.book Contador 4.0 – Sistema de Transformación con IA para Contadores. " +
    "Todos los derechos reservados © 2025."
  ];

  const headers = [
    "Nombre del Prompt",
    "Contenido del Prompt",
    "Contexto / Cuándo usarlo",
    "Personalización",
    "Frecuencia",
    "Tipo"
  ];

  const rows = prompts.map(p => [
    p.name || "",
    p.text || "",
    p.context || "",
    p.personalization || "",
    p.frequency || "",
    p.fixed ? "Base" : "Personal"
  ]);

  if (window.XLSX) {
    try {
      const wb = XLSX.utils.book_new();
      const data = [creditRow, [], headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(data);

      ws["!cols"] = [
        { wch: 32 },
        { wch: 60 },
        { wch: 50 },
        { wch: 40 },
        { wch: 15 },
        { wch: 12 }
      ];

      try {
        const creditStyle = {
          font: { bold: true, color: { rgb: "E86C2A" } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true }
        };
        const headerStyle = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1F4E79" } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true }
        };
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellRef]) continue;
            if (R === 0) ws[cellRef].s = creditStyle;
            if (R === 2) ws[cellRef].s = headerStyle;
          }
        }
      } catch (e) {
        console.warn("Estilos XLSX no aplicados (no crítico):", e);
      }

      XLSX.utils.book_append_sheet(wb, ws, "Biblioteca Prompts");
      XLSX.writeFile(wb, "Biblioteca_de_Prompts_Contador_4.0.xlsx");
      return;
    } catch (err) {
      console.error("Error al exportar con XLSX:", err);
    }
  }

  const csvContent = [
    creditRow.join(","),
    "",
    headers.join(","),
    ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Biblioteca_de_Prompts_Contador_4.0.csv";
  link.click();
});

// --- Eventos principales ---
addPromptBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);
renderPrompts();
// --- Modal de Google Sheets editable ---
const sheetModal = document.getElementById("sheetModal");
const closeSheetX = document.querySelector(".close-sheet");
const closeSheetBtn = document.getElementById("closeSheetBtn");
const exportBtnSheet = document.getElementById("exportBtnSheet");

// Abrir modal con hoja editable
exportBtnSheet.addEventListener("click", () => {
  sheetModal.style.display = "flex";
});

// Cerrar modal (X o botón)
closeSheetX.addEventListener("click", () => {
  sheetModal.style.display = "none";
});
closeSheetBtn.addEventListener("click", () => {
  sheetModal.style.display = "none";
});

// Cerrar modal al hacer clic fuera
sheetModal.addEventListener("click", (e) => {
  if (e.target === sheetModal) sheetModal.style.display = "none";
});
// =======================================================
// 📘 Inicialización segura después de cargar el DOM
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // --- Referencias principales ---
  const promptList = document.getElementById("promptList");
  const exportBtn = document.getElementById("exportBtn");
  const exportBtnSheet = document.getElementById("exportBtnSheet");

  // =======================================================
  // 🔹 Renderizar los prompts base tipo Notion
  // =======================================================
  const promptsBase = [
    { nombre: "Análisis Express Rentabilidad PYME" },
    { nombre: "Propuesta Premium de Servicios" },
    { nombre: "Calendario Fiscal Automatizado" },
    { nombre: "Reporte Ejecutivo Semanal" },
    { nombre: "Detección de Irregularidades en Nómina" },
  ];

  // Renderizar tarjetas base
  function renderPrompts() {
    promptList.innerHTML = "";
    promptsBase.forEach((prompt) => {
      const card = document.createElement("div");
      card.classList.add("prompt-card");
      card.textContent = prompt.nombre;
      card.addEventListener("click", () => openPromptModal(prompt));
      promptList.appendChild(card);
    });
  }

  renderPrompts(); // Llamada inicial

  // =======================================================
  // 📤 Exportar Excel (botón original)
  // =======================================================
  exportBtn.addEventListener("click", () => {
    alert("Exportar Excel ejecutado correctamente (versión estable).");
    // Aquí sigue funcionando tu exportación local previa
  });

  // =======================================================
  // 🌐 Modal de Google Sheets editable
  // =======================================================
  const sheetModal = document.getElementById("sheetModal");
  const closeSheetX = document.querySelector(".close-sheet");
  const closeSheetBtn = document.getElementById("closeSheetBtn");

  if (exportBtnSheet) {
    exportBtnSheet.addEventListener("click", () => {
      sheetModal.style.display = "flex";
    });
  }

  if (closeSheetX) {
    closeSheetX.addEventListener("click", () => {
      sheetModal.style.display = "none";
    });
  }

  if (closeSheetBtn) {
    closeSheetBtn.addEventListener("click", () => {
      sheetModal.style.display = "none";
    });
  }

  sheetModal.addEventListener("click", (e) => {
    if (e.target === sheetModal) sheetModal.style.display = "none";
  });

  // =======================================================
  // 🪶 Función placeholder para abrir modal de prompt base
  // =======================================================
  function openPromptModal(prompt) {
    alert(`Abrir vista de: ${prompt.nombre}`);
    // Aquí se puede integrar el modal de lectura (ya existente)
  }
});
