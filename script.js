// ====================================================
// CONTROL DE VERSIÓN LOCAL - CONTADOR 4.0
// ====================================================

// Cambia este número cuando actualices tu app:
const APP_VERSION = "1.1.0";

// Crear notificación visual
function showUpdateToast(version) {
  const toast = document.createElement("div");
  toast.textContent = `Biblioteca actualizada a la versión ${version} ✅`;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.background = "#1e3a8a"; // azul oscuro
  toast.style.color = "white";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "8px";
  toast.style.fontFamily = "Lato, sans-serif";
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.4s ease";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);

  // animación suave
  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Verifica si hay una versión guardada
const storedVersion = localStorage.getItem("appVersion");

// Si es una versión nueva, limpiar datos antiguos y mostrar aviso
if (storedVersion !== APP_VERSION) {
  console.log(`⚙️ Actualizando a nueva versión ${APP_VERSION}... limpiando caché local.`);
  localStorage.clear();
  localStorage.setItem("appVersion", APP_VERSION);
  window.addEventListener("load", () => showUpdateToast(APP_VERSION));
}
// ====================================================
// CONTROL DE VERSIÓN LOCAL - CONTADOR 4.0
// ====================================================

// Cambia este número cuando actualices tu app:
const APP_VERSION = "1.1.0";

// Verifica si hay una versión guardada
const storedVersion = localStorage.getItem("appVersion");

// Si es una versión nueva, limpia datos antiguos
if (storedVersion !== APP_VERSION) {
  console.log(`⚙️ Actualizando a nueva versión ${APP_VERSION}... limpiando caché local.`);
  localStorage.clear();
  localStorage.setItem("appVersion", APP_VERSION);
}
// ===============================
// BIBLIOTECA DE PROMPTS – CONTADOR 4.0
// ===============================

// Referencias DOM
const addPromptBtn = document.getElementById("addPromptBtn");
const promptModal = document.getElementById("promptModal");
const closeModal = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const promptList = document.getElementById("promptList");
const modalTitle = document.getElementById("modalTitle");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.getElementById("searchInput");

// Campos del formulario
const nameInput = document.getElementById("promptName");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const textInput = document.getElementById("promptText");
const freqSelect = document.getElementById("promptFrequency");

// ===============================
// Inicialización
// ===============================
let prompts = JSON.parse(localStorage.getItem("prompts")) || [];

// Si no hay datos guardados, cargar ejemplos iniciales
if (prompts.length === 0) {
  prompts = [
    {
      id: Date.now() + 1,
      name: "Análisis Express Rentabilidad PYME",
      context: "Cliente pregunta por qué bajó utilidad.",
      personalization: "Incluye 'sector retail Colombia' y lenguaje simple.",
      text: "Actúa como un analista financiero experto. Evalúa los márgenes de rentabilidad de una PYME colombiana del sector retail durante el último trimestre y explica causas probables de la caída en utilidad neta en lenguaje claro.",
      frequency: "semanal"
    },
    {
      id: Date.now() + 2,
      name: "Propuesta Premium de Servicios",
      context: "Cuando un prospecto solicita cotización o upgrade.",
      personalization: "Cambiar 'CEO' por 'Gerente'. Enfatizar ROI cuantificado.",
      text: "Genera una propuesta ejecutiva de servicios contables premium enfocada en ROI tangible para el cliente. Mantén tono profesional y claridad en los beneficios financieros.",
      frequency: "mensual"
    },
    {
      id: Date.now() + 3,
      name: "Calendario Fiscal Automatizado",
      context: "Inicio de mes para planificar obligaciones.",
      personalization: "Incluir solo clientes régimen común, formato tabla con alertas.",
      text: "Crea un calendario fiscal para el mes actual en formato tabla, incluyendo fechas límite para IVA, retención en la fuente y nómina electrónica en Colombia. Usa emojis o alertas visuales para cada tipo de vencimiento.",
      frequency: "mensual"
    },
    {
      id: Date.now() + 4,
      name: "Reporte Ejecutivo Semanal",
      context: "Todos los lunes para clientes premium.",
      personalization: "Dashboard visual, máximo 1 página, 3 métricas clave.",
      text: "Elabora un reporte ejecutivo semanal con resumen financiero, proyección de flujo de caja y métricas clave de desempeño. Presenta en formato breve tipo dashboard con lenguaje de negocio.",
      frequency: "semanal"
    },
    {
      id: Date.now() + 5,
      name: "Detección de Irregularidades en Nómina",
      context: "Antes de procesar nómina mensual.",
      personalization: "Detectar duplicados, horas extras inusuales y empleados inactivos.",
      text: "Analiza una nómina simulada e identifica irregularidades: duplicados, horas extras inusuales o inconsistencias. Devuelve una tabla con observaciones y posibles causas.",
      frequency: "mensual"
    }
  ];
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

renderPrompts();

// ===============================
// Funciones principales
// ===============================

function renderPrompts(filter = "") {
  promptList.innerHTML = "";
  const filtered = prompts.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    promptList.innerHTML = `<p style="color:#6c757d;">No se encontraron prompts...</p>`;
    return;
  }

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p><strong>Frecuencia:</strong> ${capitalize(p.frequency)}</p>
      <p><strong>Contexto:</strong> ${p.context}</p>
    `;
    card.addEventListener("click", () => openPromptModal(p.id));
    promptList.appendChild(card);
  });
}

function openPromptModal(id = null) {
  const isEdit = !!id;
  promptModal.style.display = "flex";
  modalTitle.textContent = isEdit ? "Editar Prompt" : "Nuevo Prompt";

  if (isEdit) {
    const prompt = prompts.find((p) => p.id === id);
    nameInput.value = prompt.name;
    contextInput.value = prompt.context;
    personalizationInput.value = prompt.personalization;
    textInput.value = prompt.text;
    freqSelect.value = prompt.frequency;
    promptForm.dataset.editing = id;
  } else {
    promptForm.reset();
    delete promptForm.dataset.editing;
  }
}

function closePromptModal() {
  promptModal.style.display = "none";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===============================
// Eventos
// ===============================
addPromptBtn.addEventListener("click", () => openPromptModal());
closeModal.addEventListener("click", closePromptModal);
cancelBtn.addEventListener("click", closePromptModal);

window.addEventListener("click", (e) => {
  if (e.target === promptModal) closePromptModal();
});

promptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = promptForm.dataset.editing;

  const newPrompt = {
    id: id ? parseInt(id) : Date.now(),
    name: nameInput.value.trim(),
    context: contextInput.value.trim(),
    personalization: personalizationInput.value.trim(),
    text: textInput.value.trim(),
    frequency: freqSelect.value
  };

  if (id) {
    const index = prompts.findIndex((p) => p.id === parseInt(id));
    prompts[index] = newPrompt;
  } else {
    prompts.push(newPrompt);
  }

  localStorage.setItem("prompts", JSON.stringify(prompts));
  renderPrompts(searchInput.value);
  closePromptModal();
});

// ===============================
// Búsqueda en tiempo real
// ===============================
searchInput.addEventListener("input", (e) => {
  renderPrompts(e.target.value);
});

// ===============================
// Exportar a Excel (CSV simple)
// ===============================
exportBtn.addEventListener("click", () => {
  const headers = ["Nombre", "Contexto", "Personalización", "Contenido", "Frecuencia"];
  const rows = prompts.map((p) => [
    p.name,
    p.context,
    p.personalization,
    `"${p.text.replace(/"/g, '""')}"`,
    p.frequency
  ]);

  let csvContent = headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "biblioteca_prompts_contador40.csv";
  link.click();
});
