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
const deleteBtn = document.getElementById("deletePrompt");

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
  if (list.length === 0) {
    promptList.innerHTML = "<p style='text-align:center;color:#888;'>No hay prompts disponibles.</p>";
    return;
  }
  list.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("prompt-item");
    if (p.fixed) div.classList.add("fixed");

    div.innerHTML = `<h3>${p.name}</h3>`;
    div.addEventListener("click", () => openModal(p));
    promptList.appendChild(div);
  });
}

// --- Modal ---
function openModal(prompt = null) {
  promptForm.reset();
  deleteBtn.style.display = "none"; // Por defecto, oculto

  if (prompt) {
    modalTitle.textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
    nameInput.value = prompt.name;
    textInput.value = prompt.text;
    contextInput.value = prompt.context;
    personalizationInput.value = prompt.personalization;
    freqSelect.value = prompt.frequency;
    promptForm.dataset.editId = prompt.id;
    promptForm.dataset.isFixed = prompt.fixed || false;

    promptForm.querySelectorAll("input, textarea, select").forEach(el => {
      el.disabled = prompt.fixed ? true : false;
    });

    if (!prompt.fixed) {
      deleteBtn.style.display = "inline-block"; // ✅ Mostrar botón eliminar
    }
  } else {
    modalTitle.textContent = "Nuevo Prompt";
    delete promptForm.dataset.editId;
    promptForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
    setTimeout(() => nameInput.focus(), 100);
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

// --- Exportar CSV ---
exportBtn.addEventListener("click", () => {
  const headers = ["Nombre", "Contexto", "Personalización", "Texto", "Frecuencia", "Tipo"];
  const rows = getAllPrompts().map(p => [
    p.name, p.context, p.personalization, p.text, p.frequency, p.fixed ? "Base" : "Personal"
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "biblioteca_prompts_contador4.csv";
  link.click();
});
// --- Toast notifications ---
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;
  container.appendChild(toast);

  // Desaparecer después de 3s
  setTimeout(() => {
    toast.style.animation = "toast-out 0.4s forwards";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// --- Eventos principales ---
addPromptBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", closeModalWindow);
cancelBtn.addEventListener("click", closeModalWindow);

// --- Render inicial ---
renderPrompts();
