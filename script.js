// script.js (module)
const addPromptBtn = document.getElementById("addPromptBtn");
const promptModal = document.getElementById("promptModal");
const closeModalBtn = document.querySelector(".modal-close");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const promptList = document.getElementById("promptList");
const modalTitle = document.getElementById("modalTitle");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.getElementById("searchInput");
const deleteBtn = document.getElementById("deletePrompt");
const saveBtn = document.getElementById("savePrompt");
const exportBtnSheet = document.getElementById("exportBtnSheet");
const sheetModal = document.getElementById("sheetModal");
const closeSheetX = document.querySelector(".close-sheet");
const closeSheetBtn = document.getElementById("closeSheetBtn");

// form fields
const nameInput = document.getElementById("promptName");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const textInput = document.getElementById("promptText");
const freqSelect = document.getElementById("promptFrequency");

// --- Prompts base (fixed) ---
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

// user prompts from localStorage
let userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];

// helper: get combined
function getAllPrompts() {
  return [...defaultPrompts, ...userPrompts];
}

// RENDER: grid of cards (base + user)
function renderPrompts(list = getAllPrompts()) {
  promptList.innerHTML = "";
  // ensure base prompts appear first in the desired grid order
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.dataset.id = p.id;
    card.innerHTML = `<div>${p.name}</div>`;
    // click opens viewer (fixed or editable)
    card.addEventListener("click", () => openModal(p));
    promptList.appendChild(card);
  });
}

// OPEN modal for a prompt (or new)
function openModal(prompt = null) {
  // reset
  promptForm.reset();
  deleteBtn.classList.add("hidden");
  saveBtn.classList.remove("hidden");
  promptForm.dataset.isFixed = "false";
  promptForm.removeAttribute("data-edit-id");

  if (prompt) {
    modalTitle.textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
    nameInput.value = prompt.name || "";
    contextInput.value = prompt.context || "";
    personalizationInput.value = prompt.personalization || "";
    textInput.value = prompt.text || "";
    freqSelect.value = prompt.frequency || "semanal";
    promptForm.dataset.editId = prompt.id;
    promptForm.dataset.isFixed = prompt.fixed ? "true" : "false";

    // if fixed, disable inputs and hide save/delete as required
    const isFixed = prompt.fixed === true;
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = isFixed);

    if (!isFixed) {
      deleteBtn.classList.remove("hidden");
    } else {
      // hide guardar for fixed base prompts
      saveBtn.classList.add("hidden");
    }
  } else {
    modalTitle.textContent = "Nuevo Prompt";
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
  }

  promptModal.setAttribute("aria-hidden", "false");
  promptForm.scrollTop = 0;
}

// close modal
function closeModalWindow() {
  promptModal.setAttribute("aria-hidden", "true");
}

// save / update
promptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (promptForm.dataset.isFixed === "true") {
    alert("Los prompts base no se pueden editar.");
    return;
  }

  const newData = {
    id: promptForm.dataset.editId ? promptForm.dataset.editId : `user-${Date.now()}`,
    name: nameInput.value.trim(),
    context: contextInput.value.trim(),
    personalization: personalizationInput.value.trim(),
    text: textInput.value.trim(),
    frequency: freqSelect.value,
    fixed: false
  };

  if (promptForm.dataset.editId) {
    // update existing user prompt
    const idx = userPrompts.findIndex(p => p.id == promptForm.dataset.editId);
    if (idx > -1) userPrompts[idx] = newData;
  } else {
    userPrompts.push(newData); // append at end
  }

  localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
  renderPrompts();
  closeModalWindow();
});

// delete prompt (user prompts only)
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

// search
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return renderPrompts();
  const filtered = getAllPrompts().filter(p =>
    (p.name || "").toLowerCase().includes(q) ||
    (p.context || "").toLowerCase().includes(q) ||
    (p.text || "").toLowerCase().includes(q)
  );
  renderPrompts(filtered);
});

// open sheet modal
if (exportBtnSheet) {
  exportBtnSheet.addEventListener("click", () => {
    // open sheet modal (simple)
    if (sheetModal) {
      sheetModal.setAttribute("aria-hidden", "false");
    } else {
      // fallback: open directly
      window.open(document.getElementById("openSheetLink").href, "_blank", "noopener");
    }
  });
}
if (closeSheetX) closeSheetX.addEventListener("click", () => sheetModal.setAttribute("aria-hidden","true"));
if (closeSheetBtn) closeSheetBtn.addEventListener("click", () => sheetModal.setAttribute("aria-hidden","true"));
if (sheetModal) sheetModal.addEventListener("click", (e)=> { if (e.target === sheetModal) sheetModal.setAttribute("aria-hidden","true"); });

// EXPORT: try to download the official XLSX from GitHub raw path; fallback to CSV
exportBtn.addEventListener("click", async () => {
  const rawXlsxUrl = "https://raw.githubusercontent.com/jairoamayalaverde/contador4-biblioteca/main/Biblioteca%20de%20Prompts%20Contador%204.0.xlsx";
  const fallbackFileName = "Biblioteca_de_Prompts_Contador_4.0.xlsx";

  try {
    // Try fetching the raw XLSX file and downloading
    const res = await fetch(rawXlsxUrl);
    if (!res.ok) throw new Error("XLSX not available via raw URL (status " + res.status + ")");
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fallbackFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    return;
  } catch (err) {
    console.warn("No se pudo descargar el XLSX desde GitHub (fallback CSV).", err);
    // fallback: create CSV (simple, safe)
    const prompts = getAllPrompts();
    const headers = ["Nombre", "Contenido", "Contexto", "Personalización", "Frecuencia", "Tipo"];
    const rows = prompts.map(p => [
      p.name || "",
      p.text || "",
      p.context || "",
      p.personalization || "",
      p.frequency || "",
      p.fixed ? "Base" : "Personal"
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Biblioteca_de_Prompts_Contador_4.0.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }
});

// UI events
addPromptBtn.addEventListener("click", () => openModal(null));
closeModalBtn.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", (e) => { e.preventDefault(); closeModalWindow(); });

// close modal by clicking outside
promptModal.addEventListener("click", (e) => { if (e.target === promptModal) closeModalWindow(); });

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (promptModal.getAttribute("aria-hidden") === "false") closeModalWindow();
    if (sheetModal && sheetModal.getAttribute("aria-hidden") === "false") sheetModal.setAttribute("aria-hidden","true");
  }
});

// initial render
renderPrompts();
