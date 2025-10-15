// script.js — Biblioteca de Prompts – Contador 4.0
// Lógica: render base + user prompts, CRUD (localStorage), búsqueda, export -> GitHub XLSX
document.addEventListener("DOMContentLoaded", () => {

  // DOM references
  const addPromptBtn = document.getElementById("addPromptBtn");
  const promptModal = document.getElementById("promptModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeBtns = document.querySelectorAll(".close-modal, .close-btn");
  const cancelBtn = document.getElementById("cancelBtn");
  const promptForm = document.getElementById("promptForm");
  const promptList = document.getElementById("promptList");
  const modalTitle = document.getElementById("modalTitle");
  const exportBtn = document.getElementById("exportBtn");
  const searchInput = document.getElementById("searchInput");
  const deleteBtn = document.getElementById("deletePrompt");
  const saveBtn = document.getElementById("savePrompt");

  const nameInput = document.getElementById("promptName");
  const textInput = document.getElementById("promptText");
  const contextInput = document.getElementById("promptContext");
  const personalizationInput = document.getElementById("promptPersonalization");
  const freqSelect = document.getElementById("promptFrequency");

  // Base prompts (fixed)
  const defaultPrompts = [
    { id: "base-1", name: "Análisis Express Rentabilidad PYME", context: "Cliente pregunta por qué bajó la utilidad neta.", personalization: "Incluye 'sector retail Colombia' y lenguaje simple.", text: "Actúa como analista financiero experto. Evalúa los márgenes de utilidad neta de una PYME del sector retail colombiano.", frequency: "semanal", fixed: true, createdAt: Date.now() },
    { id: "base-2", name: "Propuesta Premium de Servicios", context: "Prospecto solicita cotización o upgrade de cliente actual.", personalization: "Cambio 'CEO' por 'Gerente', énfasis en ROI cuantificado.", text: "Redacta una propuesta contable con enfoque premium para retener clientes y destacar ROI con claridad.", frequency: "mensual", fixed: true, createdAt: Date.now() },
    { id: "base-3", name: "Calendario Fiscal Automatizado", context: "Inicio de mes para planificar obligaciones.", personalization: "Solo clientes régimen común, formato tabla con alertas.", text: "Genera un calendario fiscal automatizado para empresas en régimen común con fechas y alertas críticas.", frequency: "mensual", fixed: true, createdAt: Date.now() },
    { id: "base-4", name: "Reporte Ejecutivo Semanal", context: "Todos los lunes para clientes premium.", personalization: "Dashboard visual, máximo 1 página, 3 métricas clave.", text: "Elabora un reporte ejecutivo semanal con resumen financiero, proyección y 3 métricas clave.", frequency: "semanal", fixed: true, createdAt: Date.now() },
    { id: "base-5", name: "Detección de Irregularidades en Nómina", context: "Antes de procesar nómina mensual.", personalization: "Detectar duplicados, horas extras inusuales y empleados inactivos.", text: "Analiza nómina y devuelve hallazgos: duplicados, horas extras anómalas, posibles empleados fantasma.", frequency: "mensual", fixed: true, createdAt: Date.now() }
  ];

  // Load user prompts safely
  let userPrompts = [];
  try {
    userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];
  } catch (e) {
    console.warn("localStorage userPrompts parse error:", e);
    userPrompts = [];
  }

  // Helper: get all prompts
  function getAllPrompts() {
    return [...defaultPrompts, ...userPrompts];
  }

  // Render only name in cards
  function renderPrompts(list = getAllPrompts()) {
    promptList.innerHTML = "";
    if (!Array.isArray(list) || list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "center small";
      empty.textContent = "No hay prompts aún. Presiona + Nuevo Prompt para crear uno.";
      promptList.appendChild(empty);
      return;
    }

    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "prompt-item";
      if (p.fixed) card.classList.add("fixed");

      const title = document.createElement("h3");
      title.textContent = p.name;
      card.appendChild(title);

      card.addEventListener("click", () => openModal(p));
      promptList.appendChild(card);
    });
  }

  // Overlay show/hide
  function showOverlay() { modalOverlay.classList.add("active"); modalOverlay.style.display = "block"; }
  function hideOverlay() { modalOverlay.classList.remove("active"); modalOverlay.style.display = "none"; }

  // Open modal
  function openModal(prompt = null) {
    promptForm.reset();
    delete promptForm.dataset.editId;
    delete promptForm.dataset.isFixed;

    deleteBtn.style.display = "none";
    saveBtn.style.display = "inline-block";

    if (prompt) {
      modalTitle.textContent = prompt.fixed ? "Vista de Prompt Base" : "Editar Prompt";
      nameInput.value = prompt.name || "";
      textInput.value = prompt.text || "";
      contextInput.value = prompt.context || "";
      personalizationInput.value = prompt.personalization || "";
      freqSelect.value = prompt.frequency || "semanal";
      promptForm.dataset.editId = prompt.id;
      promptForm.dataset.isFixed = prompt.fixed ? "true" : "false";

      const readonly = !!prompt.fixed;
      [nameInput, textInput, contextInput, personalizationInput, freqSelect].forEach(el => { el.disabled = readonly; });

      if (prompt.fixed) saveBtn.style.display = "none";
      else deleteBtn.style.display = "inline-block";
    } else {
      modalTitle.textContent = "Nuevo Prompt";
      [nameInput, textInput, contextInput, personalizationInput, freqSelect].forEach(el => { el.disabled = false; });
    }

    showOverlay();
    promptModal.classList.add("active");
    promptModal.style.display = "block";
  }

  function closeModal() {
    promptModal.classList.remove("active");
    promptModal.style.display = "none";
    hideOverlay();
  }

  modalOverlay.addEventListener("click", closeModal);
  closeBtns.forEach(b => b.addEventListener("click", closeModal));
  cancelBtn.addEventListener("click", closeModal);

  // Guardar o crear
  promptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (promptForm.dataset.isFixed === "true") { alert("Los prompts base no se pueden editar."); return; }

    const id = promptForm.dataset.editId || String(Date.now());
    const newPrompt = {
      id,
      name: nameInput.value.trim() || "Sin título",
      text: textInput.value.trim(),
      context: contextInput.value.trim(),
      personalization: personalizationInput.value.trim(),
      frequency: freqSelect.value,
      fixed: false,
      createdAt: Date.now()
    };

    const existingIndex = userPrompts.findIndex(p => p.id === id);
    if (existingIndex > -1) userPrompts[existingIndex] = newPrompt;
    else userPrompts.push(newPrompt);

    localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
    renderPrompts();
    closeModal();
  });

  // Eliminar
  deleteBtn.addEventListener("click", () => {
    const id = promptForm.dataset.editId;
    if (!id) return;
    if (!confirm("¿Seguro que deseas eliminar este prompt?")) return;
    userPrompts = userPrompts.filter(p => p.id !== id);
    localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
    renderPrompts();
    closeModal();
  });

  // Botón nuevo prompt
  addPromptBtn.addEventListener("click", () => openModal(null));

  // Buscar
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = getAllPrompts().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.context.toLowerCase().includes(q) ||
      p.text.toLowerCase().includes(q)
    );
    renderPrompts(filtered);
  });

  // Exportar Excel
  exportBtn.addEventListener("click", () => {
    const url = "https://github.com/jairoamayalaverde/contador4-biblioteca/raw/main/Biblioteca%20de%20Prompts%20Contador%204.0.xlsx";
    window.open(url, "_blank");
  });

  // Inicial
  renderPrompts();

});
