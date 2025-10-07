// ======================================================
// 📚 BIBLIOTECA DE PROMPTS – CONTADOR 4.0
// Versión completa con Excel estilizado + prompts base
// ======================================================

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
    fixed: true,
    createdAt: Date.now()
  },
  {
    id: "base-2",
    name: "Propuesta Premium de Servicios",
    context: "Prospecto solicita cotización o upgrade de cliente actual.",
    personalization: "Cambio CEO por Gerente, énfasis en ROI cuantificado.",
    text: "Redacta una propuesta contable con enfoque premium para retener clientes y destacar ROI con claridad.",
    frequency: "mensual",
    fixed: true,
    createdAt: Date.now()
  },
  {
    id: "base-3",
    name: "Calendario Fiscal Automatizado",
    context: "Inicio de mes para planificar obligaciones.",
    personalization: "Solo clientes régimen común, formato tabla con alertas.",
    text: "Genera un calendario fiscal automatizado para empresas en régimen común con fechas y alertas críticas.",
    frequency: "mensual",
    fixed: true,
    createdAt: Date.now()
  },
  {
    id: "base-4",
    name: "Reporte Ejecutivo Semanal",
    context: "Todos los lunes para clientes premium.",
    personalization: "Dashboard visual, máximo 1 página, 3 métricas clave.",
    text: "Elabora un reporte ejecutivo semanal con resumen financiero, proyección y 3 métricas clave.",
    frequency: "semanal",
    fixed: true,
    createdAt: Date.now()
  },
  {
    id: "base-5",
    name: "Detección de Irregularidades en Nómina",
    context: "Antes de procesar nómina mensual.",
    personalization: "Detectar duplicados, horas extras inusuales y empleados inactivos.",
    text: "Analiza nómina y devuelve hallazgos: duplicados, horas extras anómalas, posibles empleados fantasma.",
    frequency: "mensual",
    fixed: true,
    createdAt: Date.now()
  }
];

// --- Prompts personales del usuario ---
let userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];

// --- Combinar todos los prompts ---
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

    // Ícono
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
    frequency: freqSelect.value,
    createdAt: Date.now()
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

// ====================================================
// 📤 EXPORTAR A EXCEL CON ESTILO
// ====================================================
function exportToExcel() {
  const allPrompts = getAllPrompts();
  if (!allPrompts || allPrompts.length === 0) {
    alert("No hay prompts para exportar.");
    return;
  }

  const wb = XLSX.utils.book_new();
  const today = new Date().toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric"
  });

  const title = [
    [`📚 Biblioteca de Prompts – Contador 4.0 (Exportado el ${today})`],
    []
  ];

  const headers = [
    "ID", "Nombre del Prompt", "Contexto / Cuándo usarlo", "Personalización",
    "Contenido del Prompt", "Frecuencia", "Tipo", "Fecha de Creación"
  ];

  const data = allPrompts.map(p => [
    p.id, p.name, p.context, p.personalization, p.text,
    p.frequency, p.fixed ? "Base" : "Personal",
    p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"
  ]);

  const worksheetData = [...title, headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Ajustar columnas
  const columnWidths = headers.map((h, i) => {
    const maxLength = Math.max(h.length, ...data.map(r => (r[i] ? r[i].toString().length : 0)));
    return { wch: Math.min(Math.max(maxLength, 18), 60) };
  });
  ws["!cols"] = columnWidths;

  // Estilos
  const titleStyle = {
    font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "E86C2A" } },
    alignment: { horizontal: "center", vertical: "center" }
  };
  const headerStyle = {
    fill: { fgColor: { rgb: "1F4E79" } },
    font: { color: { rgb: "FFFFFF" }, bold: true },
    alignment: { horizontal: "center", vertical: "center", wrapText: true }
  };
  const cellStyle = {
    alignment: { vertical: "top", wrapText: true }
  };

  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;
      if (R === 0) ws[cellRef].s = titleStyle;
      else if (R === 2) ws[cellRef].s = headerStyle;
      else ws[cellRef].s = cellStyle;
    }
  }

  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

  XLSX.utils.book_append_sheet(wb, ws, "Prompts Contador 4.0");
  const fileName = `Biblioteca_Prompts_Contador4.0_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

exportBtn.addEventListener("click", exportToExcel);

// --- Botones principales ---
addPromptBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);

// --- Render inicial ---
renderPrompts();
