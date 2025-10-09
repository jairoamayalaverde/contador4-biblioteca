// script.js
// Biblioteca de Prompts – Contador 4.0
// Versión final: modal reordenado, eliminar prompt (solo personales), export fijo

// --- Elementos del DOM ---
const addPromptBtn = document.getElementById("addPromptBtn");
const promptModal = document.getElementById("promptModal");
const closeModalBtn = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const promptList = document.getElementById("promptList");
const modalTitle = document.getElementById("modalTitle");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.getElementById("searchInput");
const deleteBtn = document.getElementById("deletePrompt");

// inputs del modal (orden: name -> text -> context -> personalization -> frequency)
const nameInput = document.getElementById("promptName");
const textInput = document.getElementById("promptText");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const freqSelect = document.getElementById("promptFrequency");

// --- Prompts base (fijos) ---
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
    personalization: "Cambio 'CEO' por 'Gerente', énfasis en ROI cuantificado.",
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

// --- Cargar prompts de usuario desde localStorage ---
let userPrompts = [];
try {
  userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];
} catch (e) {
  console.warn("No se pudo parsear userPrompts desde localStorage:", e);
  userPrompts = [];
}

// --- Helper: obtener todos los prompts (base + usuario) ---
function getAllPrompts() {
  return [...defaultPrompts, ...userPrompts];
}

// --- Renderizar las tarjetas (solo nombre) ---
function renderPrompts(list = getAllPrompts()) {
  promptList.innerHTML = "";
  if (!Array.isArray(list) || list.length === 0) {
    const empty = document.createElement("div");
    empty.style.padding = "24px";
    empty.textContent = "No hay prompts (aún). Usa + Nuevo Prompt para crear uno.";
    promptList.appendChild(empty);
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "prompt-item";
    if (p.fixed) card.classList.add("fixed");

    // Solo el nombre en la tarjeta (UX solicitado)
    const h = document.createElement("h3");
    h.textContent = p.name;
    card.appendChild(h);

    // Al hacer click abre modal con detalle
    card.addEventListener("click", () => openModal(p));
    promptList.appendChild(card);
  });
}

// --- Abrir modal (ver/editar/nuevo) ---
function openModal(prompt = null) {
  // esconder botón eliminar por defecto
  if (deleteBtn) deleteBtn.style.display = "none";

  // limpiar form
  promptForm.reset();
  delete promptForm.dataset.editId;
  delete promptForm.dataset.isFixed;

  if (prompt) {
    // Mostrar valores
    modalTitle.textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
    nameInput.value = prompt.name || "";
    textInput.value = prompt.text || "";
    contextInput.value = prompt.context || "";
    personalizationInput.value = prompt.personalization || "";
    freqSelect.value = prompt.frequency || "semanal";
    promptForm.dataset.editId = prompt.id;
    promptForm.dataset.isFixed = prompt.fixed ? "true" : "false";

    // Si es base: readonly (deshabilitar campos)
    const readonly = !!prompt.fixed;
    [nameInput, textInput, contextInput, personalizationInput, freqSelect].forEach(el => {
      el.disabled = readonly;
    });

    // Mostrar botón eliminar solo si no es base
    if (!prompt.fixed && deleteBtn) {
      deleteBtn.style.display = "block";
    }
  } else {
    modalTitle.textContent = "Nuevo Prompt";
    // asegurar campos habilitados
    [nameInput, textInput, contextInput, personalizationInput, freqSelect].forEach(el => {
      el.disabled = false;
    });
  }

  // mostrar modal
  promptModal.style.display = "flex";
  // focus en el nombre para nuevo prompt
  setTimeout(() => {
    if (!prompt) nameInput.focus();
  }, 120);
}

// --- Cerrar modal ---
function closeModalWindow() {
  promptModal.style.display = "none";
  // limpiar dataset
  delete promptForm.dataset.editId;
  delete promptForm.dataset.isFixed;
}

// --- Guardar / Actualizar prompt ---
promptForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // impedir guardar base (cuando dataset.isFixed true)
  if (promptForm.dataset.isFixed === "true") {
    alert("Los prompts base no se pueden editar.");
    return;
  }

  const id = promptForm.dataset.editId || String(Date.now());
  const newPrompt = {
    id,
    name: nameInput.value.trim() || "Sin título",
    text: textInput.value.trim() || "",
    context: contextInput.value.trim() || "",
    personalization: personalizationInput.value.trim() || "",
    frequency: freqSelect.value || "semanal",
    fixed: false,
    createdAt: Date.now()
  };

  // Si editamos (exists in userPrompts) -> reemplazar
  const existingIndex = userPrompts.findIndex(p => String(p.id) === String(id));
  if (existingIndex > -1) {
    userPrompts[existingIndex] = newPrompt;
  } else {
    // nuevo
    userPrompts.push(newPrompt);
  }

  // persistir
  localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
  renderPrompts();
  closeModalWindow();
});

// --- Eliminar prompt (solo personales) ---
if (deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    const id = promptForm.dataset.editId;
    if (!id) return;
    if (confirm("¿Seguro que deseas eliminar este prompt? Esta acción no se puede deshacer.")) {
      userPrompts = userPrompts.filter(p => String(p.id) !== String(id));
      localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
      renderPrompts();
      closeModalWindow();
    }
  });
}

// --- Búsqueda en tiempo real ---
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      renderPrompts();
      return;
    }
    const filtered = getAllPrompts().filter(p => {
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.text && p.text.toLowerCase().includes(q)) ||
        (p.context && p.context.toLowerCase().includes(q))
      );
    });
    renderPrompts(filtered);
  });
}

// --- Exportar a Excel (.xlsx si XLSX disponible, si no fallback a CSV) ---
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const prompts = getAllPrompts();

    // Si existe XLSX (librería cargada en index.html), usamos formato xlsx con librería
    if (window.XLSX) {
      try {
        // Preparar workbook
        const wb = XLSX.utils.book_new();

        // Título y encabezados
        const today = new Date().toLocaleDateString();
        const titleRow = [`Biblioteca de Prompts – Contador 4.0 (Exportado: ${today})`];
        const emptyRow = [];
        const headers = ["ID", "Nombre del Prompt", "Frecuencia", "Contexto / Cuándo usarlo", "Personalización", "Contenido del Prompt", "Tipo", "Fecha de Creación"];

        const data = [titleRow, emptyRow, headers];

        prompts.forEach(p => {
          data.push([
            p.id || "",
            p.name || "",
            p.frequency || "",
            p.context || "",
            p.personalization || "",
            p.text || "",
            p.fixed ? "Base" : "Personal",
            p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""
          ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(data);

        // Autowidth (simple)
        const cols = headers.map((h, i) => {
          const maxLen = Math.max(
            h.length,
            ...prompts.map(r => (String([
              r.id || "",
              r.name || "",
              r.frequency || "",
              r.context || "",
              r.personalization || "",
              r.text || "",
              r.fixed ? "Base" : "Personal",
              r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""
            ][i]).length))
          );
          return { wch: Math.min(Math.max(maxLen, 18), 60) };
        });
        ws['!cols'] = cols;

        // Intento de estilos (funciona si se usa xlsx-style); si no, se ignora
        try {
          const headerStyle = {
            fill: { fgColor: { rgb: "1F4E79" } },
            font: { color: { rgb: "FFFFFF" }, bold: true },
            alignment: { horizontal: "center", vertical: "center", wrapText: true }
          };
          const titleStyle = {
            font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "E66E33" } },
            alignment: { horizontal: "center", vertical: "center" }
          };

          const range = XLSX.utils.decode_range(ws['!ref']);
          for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
              if (!ws[cellRef]) continue;
              // fila 0 -> title, fila 2 -> headers
              if (R === 0) ws[cellRef].s = titleStyle;
              else if (R === 2) ws[cellRef].s = headerStyle;
            }
          }
        } catch (styErr) {
          // No crítico si falla (algunas builds de xlsx no soportan estilo)
          console.warn("No se aplicaron estilos XLSX:", styErr);
        }

        XLSX.utils.book_append_sheet(wb, ws, "Prompts");
        const fileName = "Biblioteca_Prompts_Contador4.xlsx";
        XLSX.writeFile(wb, fileName);
        return;
      } catch (err) {
        console.error("Error exportando con XLSX, se intentará fallback CSV:", err);
      }
    }

    // --- Fallback a CSV (compatible con Excel/Sheets) ---
    const headers = ["ID", "Nombre del Prompt", "Frecuencia", "Contexto", "Personalización", "Contenido del Prompt", "Tipo", "Fecha de Creación"];
    const rows = prompts.map(p => [
      p.id || "",
      escapeCsv(p.name || ""),
      escapeCsv(p.frequency || ""),
      escapeCsv(p.context || ""),
      escapeCsv(p.personalization || ""),
      escapeCsv(p.text || ""),
      p.fixed ? "Base" : "Personal",
      p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""
    ]);

    const csvArray = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvArray], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // nombre fijo solicitado
    link.download = "Biblioteca_Prompts_Contador4.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

// helper para escapar CSV (no usado si usamos la versión que ya envuelve en comillas)
function escapeCsv(value) {
  if (value == null) return "";
  return String(value).replace(/\r?\n/g, " "); // mantener en una celda eliminando saltos
}

// --- Eventos de control del modal / botones ---
addPromptBtn.addEventListener("click", () => openModal(null));
closeModalBtn.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);

// cerrar modal al click fuera del contenido
promptModal.addEventListener("click", (e) => {
  if (e.target === promptModal) closeModalWindow();
});

// tecla ESC para cerrar
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (promptModal.style.display === "flex") closeModalWindow();
  }
});

// --- Inicialización ---
renderPrompts();
