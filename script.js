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

  // Open modal: prompt = null (new) or prompt object (view/edit)
  function openModal(prompt = null) {
    // reset
    promptForm.reset();
    delete promptForm.dataset.editId;
    delete promptForm.dataset.isFixed;

    // default buttons visibility
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
    const mc = promptModal.querySelector(".modal-content");
    if (mc) mc.scrollTop = 0;
    setTimeout(() => { if (!prompt) nameInput.focus(); }, 120);
  }

  function closeModal() {
    promptModal.classList.remove("active");
    promptModal.style.display = "none";
    hideOverlay();
    delete promptForm.dataset.editId;
    delete promptForm.dataset.isFixed;
  }

  // Bind overlay & close handlers
  modalOverlay.addEventListener("click", closeModal);
  closeBtns.forEach(b => b.addEventListener("click", closeModal));
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (promptModal.classList.contains("active")) closeModal(); } });

  // Save / create
  promptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (promptForm.dataset.isFixed === "true") { alert("Los prompts base no se pueden editar."); return; }

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

    const existingIndex = userPrompts.findIndex(p => String(p.id) === String(id));
    if (existingIndex > -1) userPrompts[existingIndex] = newPrompt;
    else userPrompts.push(newPrompt);

    try { localStorage.setItem("userPrompts", JSON.stringify(userPrompts)); } catch (err) { console.warn("localStorage save error:", err); }
    renderPrompts();
    closeModal();
  });

  // Delete personal prompt
  deleteBtn.addEventListener("click", () => {
    const id = promptForm.dataset.editId;
    if (!id) return;
    if (!confirm("¿Seguro que deseas eliminar este prompt? Esta acción no se puede deshacer.")) return;
    userPrompts = userPrompts.filter(p => String(p.id) !== String(id));
    try { localStorage.setItem("userPrompts", JSON.stringify(userPrompts)); } catch (err) { console.warn("localStorage save error:", err); }
    renderPrompts();
    closeModal();
  });

  // Add new prompt button
  if (addPromptBtn) addPromptBtn.addEventListener("click", () => openModal(null));

  // Search filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = String(e.target.value || "").trim().toLowerCase();
      if (!q) { renderPrompts(); return; }
      const filtered = getAllPrompts().filter(p => {
        return (p.name && p.name.toLowerCase().includes(q)) ||
               (p.context && p.context.toLowerCase().includes(q)) ||
               (p.text && p.text.toLowerCase().includes(q));
      });
      renderPrompts(filtered);
    });
  }

  // Export -> opens XLSX stored in GitHub (raw)
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rawUrl = "https://github.com/jairoamayalaverde/contador4-biblioteca/raw/main/Biblioteca%20de%20Prompts%20Contador%204.0.xlsx";
      window.open(rawUrl, "_blank");
    });
  }

  // Initial render
  renderPrompts();

});
/* ===============================
   🔹 Header optimizado con 2 botones
=============================== */
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 0.8rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.site-logo {
  height: 38px;
  width: auto;
  object-fit: contain;
}

.site-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #333;
  font-size: 1.2rem;
  margin-left: 10px;
}

.site-title span {
  color: #E86C2A;
}

/* --- Botones del header --- */
.header-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-add,
.btn-secondary {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Botón “Nuevo Prompt” */
.btn-add {
  background: #E86C2A;
  color: #fff;
  border: none;
}

.btn-add:hover {
  background: #cf5d22;
  transform: translateY(-1px);
}

/* Botón “Ver o editar en Google Sheets” */
.btn-secondary {
  background: transparent;
  border: 2px solid #E86C2A;
  color: #E86C2A;
}

.btn-secondary:hover {
  background: #E86C2A;
  color: #fff;
}

/* 🔹 Móvil */
@media (max-width: 700px) {
  .header-inner {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .site-logo {
    height: 34px;
  }

  .site-title {
    font-size: 1rem;
    text-align: center;
  }

  .header-buttons {
    flex-direction: column;
    width: 100%;
    gap: 6px;
  }

  .btn-add,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
