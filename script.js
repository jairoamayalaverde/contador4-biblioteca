// ===============================
// 📦 CONFIGURACIÓN INICIAL
// ===============================
const defaultPrompts = [
  {
    name: "Análisis Express Rentabilidad PYME",
    content: "Actúa como analista financiero experto. Evalúa los márgenes de utilidad neta de una PYME del sector retail colombiano.",
    context: "Cliente pregunta por qué bajó la utilidad neta.",
    customization: "Incluye 'sector retail Colombia' y lenguaje simple.",
    frequency: "Semanal",
    isDefault: true
  },
  {
    name: "Propuesta Premium de Servicios",
    content: "Genera una propuesta de servicios contables premium para clientes actuales interesados en upgrade.",
    context: "Prospecto solicita cotización o upgrade de cliente actual.",
    customization: "Usa un tono profesional y beneficios tangibles.",
    frequency: "Mensual",
    isDefault: true
  },
  {
    name: "Calendario Fiscal Automatizado",
    content: "Crea una lista de recordatorios automáticos de obligaciones fiscales del mes actual.",
    context: "Inicio de mes para planificar obligaciones.",
    customization: "Usa ejemplos aplicables a Colombia.",
    frequency: "Mensual",
    isDefault: true
  },
  {
    name: "Reporte Ejecutivo Semanal",
    content: "Redacta un informe ejecutivo con los indicadores contables más relevantes de la semana.",
    context: "Todos los lunes para clientes premium.",
    customization: "Usa formato de viñetas y resumen al final.",
    frequency: "Semanal",
    isDefault: true
  },
  {
    name: "Detección de Irregularidades en Nómina",
    content: "Analiza posibles errores en cálculos de nómina o aportes parafiscales.",
    context: "Antes de procesar nómina mensual.",
    customization: "Usa lenguaje técnico y precisión contable.",
    frequency: "Mensual",
    isDefault: true
  }
];

let prompts = JSON.parse(localStorage.getItem("prompts")) || [];
if (prompts.length === 0) {
  prompts = defaultPrompts;
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

// ===============================
// 🎨 RENDERIZAR PROMPTS
// ===============================
const promptList = document.getElementById("promptList");

function renderPrompts(filter = "") {
  promptList.innerHTML = "";
  const filtered = prompts.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${p.name}</h3>`;
    card.onclick = () => openModal(p, index);
    promptList.appendChild(card);
  });
}

renderPrompts();

// ===============================
// 🔍 BUSCADOR
// ===============================
document.getElementById("search").addEventListener("input", e => {
  renderPrompts(e.target.value);
});

// ===============================
// 🪟 MODAL LOGIC
// ===============================
const modal = document.getElementById("promptModal");
const closeModal = document.getElementById("closeModal");
const cancelPrompt = document.getElementById("cancelPrompt");

function openModal(prompt = null, index = null) {
  modal.style.display = "flex";
  document.getElementById("modalTitle").textContent = prompt ? "Editar Prompt" : "Nuevo Prompt";

  document.getElementById("promptName").value = prompt ? prompt.name : "";
  document.getElementById("promptContent").value = prompt ? prompt.content : "";
  document.getElementById("promptContext").value = prompt ? prompt.context : "";
  document.getElementById("promptCustomization").value = prompt ? prompt.customization : "";
  document.getElementById("promptFrequency").value = prompt ? prompt.frequency : "Semanal";

  const saveButton = document.getElementById("savePrompt");
  saveButton.onclick = () => savePrompt(index);

  // Si no es prompt base, permitir eliminar
  if (prompt && !prompt.isDefault) {
    addDeleteButton(index);
  } else {
    removeDeleteButton();
  }
}

function closeModalWindow() {
  modal.style.display = "none";
  removeDeleteButton();
}

closeModal.onclick = closeModalWindow;
cancelPrompt.onclick = closeModalWindow;
window.onclick = e => {
  if (e.target === modal) closeModalWindow();
};

// ===============================
// 💾 GUARDAR / EDITAR PROMPT
// ===============================
function savePrompt(index = null) {
  const newPrompt = {
    name: document.getElementById("promptName").value.trim(),
    content: document.getElementById("promptContent").value.trim(),
    context: document.getElementById("promptContext").value.trim(),
    customization: document.getElementById("promptCustomization").value.trim(),
    frequency: document.getElementById("promptFrequency").value,
    isDefault: false
  };

  if (!newPrompt.name || !newPrompt.content) {
    alert("Por favor completa al menos el nombre y contenido del prompt.");
    return;
  }

  if (index !== null) {
    prompts[index] = newPrompt;
  } else {
    prompts.push(newPrompt);
  }

  localStorage.setItem("prompts", JSON.stringify(prompts));
  renderPrompts();
  closeModalWindow();
}

// ===============================
// 🗑️ ELIMINAR PROMPT
// ===============================
function addDeleteButton(index) {
  removeDeleteButton();
  const footer = document.querySelector(".modal-footer");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Eliminar";
  deleteBtn.className = "btn";
  deleteBtn.style.background = "#dc3545";
  deleteBtn.style.color = "white";
  deleteBtn.onclick = () => {
    if (confirm("¿Seguro que deseas eliminar este prompt?")) {
      prompts.splice(index, 1);
      localStorage.setItem("prompts", JSON.stringify(prompts));
      renderPrompts();
      closeModalWindow();
    }
  };
  footer.prepend(deleteBtn);
}

function removeDeleteButton() {
  const oldDelete = document.querySelector(".modal-footer button:first-child");
  if (oldDelete && oldDelete.textContent === "Eliminar") oldDelete.remove();
}

// ===============================
// 🆕 NUEVO PROMPT
// ===============================
document.getElementById("newPrompt").onclick = () => openModal();

// ===============================
// 📤 EXPORTAR EXCEL
// ===============================
document.getElementById("exportExcel").addEventListener("click", exportToExcel);

function exportToExcel() {
  import("https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs").then(XLSX => {
    const data = prompts.map(p => ({
      "Nombre del Prompt": p.name,
      "Contenido del Prompt": p.content,
      "Contexto / Cuándo usarlo": p.context,
      "Personalización": p.customization,
      "Frecuencia": p.frequency
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prompts Contador 4.0");

    // Estilos de encabezado
    const headerCells = ["A1", "B1", "C1", "D1", "E1"];
    headerCells.forEach(cell => {
      if (ws[cell]) {
        ws[cell].s = {
          fill: { fgColor: { rgb: "E66E33" } },
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    });

    XLSX.writeFile(wb, "Biblioteca_Prompts_Contador4.0.xlsx");
  });
}
