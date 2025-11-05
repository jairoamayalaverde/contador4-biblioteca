// script.js — Biblioteca de Prompts – Contador 4.0
// Lógica V2.4: Filtros de categoría + Búsqueda + Acciones rápidas

document.addEventListener("DOMContentLoaded", () => {
  // --- REFERENCIAS DOM ---
  const addPromptBtn = document.getElementById("addPromptBtn");
  const viewSheetBtn = document.getElementById("viewSheetBtn");
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

  // (NUEVO) Referencias para filtros
  const filterBtns = document.querySelectorAll(".filter-btn");

  // --- Formulario Modal ---
  const nameInput = document.getElementById("promptName");
  const textInput = document.getElementById("promptText");
  const contextInput = document.getElementById("promptContext");
  const personalizationInput = document.getElementById("promptPersonalization");
  const freqSelect = document.getElementById("promptFrequency");

  // --- ESTADO DE LA APP ---
  let userPrompts = [];
  let currentFilter = 'todos'; // 'todos', 'diario', 'semanal', etc.

  // --- DATOS ---

  // Prompts base (fijos)
  const defaultPrompts = [
    { id: "base-1", name: "Análisis Express Rentabilidad PYME", context: "Cliente pregunta por qué bajó la utilidad neta.", personalization: "Incluye 'sector retail Colombia' y lenguaje simple.", text: "Actúa como analista financiero experto. Evalúa los márgenes de utilidad neta de una PYME del sector retail colombiano.", frequency: "semanal", fixed: true, createdAt: Date.now() },
    { id: "base-2", name: "Propuesta Premium de Servicios", context: "Prospecto solicita cotización o upgrade de cliente actual.", personalization: "Cambio 'CEO' por 'Gerente', énfasis en ROI cuantificado.", text: "Redacta una propuesta contable con enfoque premium para retener clientes y destacar ROI con claridad.", frequency: "mensual", fixed: true, createdAt: Date.now() },
    { id: "base-3", name: "Calendario Fiscal Automatizado", context: "Inicio de mes para planificar obligaciones.", personalization: "Solo clientes régimen común, formato tabla con alertas.", text: "Genera un calendario fiscal automatizado para empresas en régimen común con fechas y alertas críticas.", frequency: "mensual", fixed: true, createdAt: Date.now() },
    { id: "base-4", name: "Reporte Ejecutivo Semanal", context: "Todos los lunes para clientes premium.", personalization: "Dashboard visual, máximo 1 página, 3 métricas clave.", text: "Elabora un reporte ejecutivo semanal con resumen financiero, proyección y 3 métricas clave.", frequency: "semanal", fixed: true, createdAt: Date.now() },
    { id: "base-5", name: "Detección de Irregularidades en Nómina", context: "Antes de procesar nómina mensual.", personalization: "Detectar duplicados, horas extras inusuales y empleados inactivos.", text: "Analiza nómina y devuelve hallazgos: duplicados, horas extras anómalas, posibles empleados fantasma.", frequency: "mensual", fixed: true, createdAt: Date.now() }
  ];

  // Cargar prompts del usuario (localStorage)
  try {
    userPrompts = JSON.parse(localStorage.getItem("userPrompts")) || [];
  } catch (e) {
    console.warn("Error al cargar userPrompts de localStorage:", e);
    userPrompts = [];
  }

  // --- HELPERS ---

  // Helper: Obtener todos los prompts
  function getAllPrompts() {
    const sortedUserPrompts = userPrompts.sort((a, b) => b.createdAt - a.createdAt);
    return [...sortedUserPrompts, ...defaultPrompts];
  }

  // Helper: Truncar texto
  const truncate = (str, len) => {
    if (!str) return "";
    return str.length > len ? str.substring(0, len) + '...' : str;
  };

  // Helper: Capitalizar
  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  // --- (MODIFICADO) LÓGICA CENTRAL DE RENDERIZADO ---

  /**
   * (NUEVA) Función central para aplicar filtros y búsqueda.
   * Esta función decide QUÉ mostrar.
   */
  function applyFiltersAndSearch() {
    const allPrompts = getAllPrompts();
    const searchTerm = searchInput.value.toLowerCase();

    // 1. Filtrar por Categoría (currentFilter)
    const filteredByCategory = allPrompts.filter(p => {
      if (currentFilter === 'todos') {
        return true; // Mostrar todos
      }
      return p.frequency === currentFilter;
    });

    // 2. Filtrar por Búsqueda (searchTerm)
    const filteredBySearch = filteredByCategory.filter(p => {
      if (searchTerm === '') {
        return true; // Mostrar todos los de la categoría
      }
      // Buscar en nombre, contexto o texto
      return p.name.toLowerCase().includes(searchTerm) ||
             p.context.toLowerCase().includes(searchTerm) ||
             p.text.toLowerCase().includes(searchTerm);
    });

    // 3. Llamar a renderPrompts para que DIBUJE la lista final
    renderPromptsUI(filteredBySearch);
  }

  /**
   * (MODIFICADA) Esta función ahora solo se encarga de DIBUJAR.
   * Ya no decide qué mostrar, solo recibe una lista y la renderiza.
   */
  function renderPromptsUI(listToRender) {
    promptList.innerHTML = "";
    
    if (!Array.isArray(listToRender) || listToRender.length === 0) {
      const emptyMsg = (searchInput.value || currentFilter !== 'todos')
        ? "No se encontraron prompts que coincidan con tu filtro o búsqueda."
        : "No hay prompts aún. Presiona '+ Nuevo Prompt' para crear uno.";
      
      const empty = document.createElement("div");
      empty.className = "prompt-empty-message";
      empty.textContent = emptyMsg;
      promptList.appendChild(empty);
      return;
    }

    listToRender.forEach(p => {
      const card = document.createElement("div");
      card.className = "prompt-card";
      if (p.fixed) {
        card.classList.add("fixed-prompt");
      }
      
      const categoria = capitalize(p.frequency) || 'General';
      const contexto = truncate(p.context || 'Sin contexto', 100);
      const contenido = truncate(p.text || 'Prompt vacío', 150);

      // Lógica de botones (Base vs. Usuario)
      let actionsHTML = '';
      if (p.fixed) {
        actionsHTML = `<button class="btn-action primary btn-copy" data-id="${p.id}">📋 Copiar</button>`;
      } else {
        actionsHTML = `
          <button class="btn-action primary btn-copy" data-id="${p.id}">📋 Copiar</button>
          <button class="btn-action btn-view" data-id="${p.id}">👁️ Ver / Editar</button>
          <button class="btn-action danger btn-delete" data-id="${p.id}">🗑️ Eliminar</button>
        `;
      }

      card.innerHTML = `
        <div class="prompt-header">
          <span class="prompt-categoria">${categoria}</span>
        </div>
        <h3 class="prompt-titulo">${p.name}</h3>
        <p class="prompt-subcategoria">${contexto}</p>
        <div class="prompt-contenido">
          ${contenido}
        </div>
        <div class="prompt-actions">
          ${actionsHTML}
        </div>
      `;

      // Asignar eventos a botones
      card.querySelector('.btn-copy').addEventListener('click', (e) => {
        e.stopPropagation();
        copiarPrompt(p.id);
      });

      if (!p.fixed) {
        card.querySelector('.btn-view').addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(p);
        });
        card.querySelector('.btn-delete').addEventListener('click', (e) => {
          e.stopPropagation();
          eliminarPrompt(p.id);
        });
      }

      promptList.appendChild(card);
    });
  }


  // --- ACCIONES DE TARJETAS Y MODAL ---

  // Copiar al portapapeles
  function copiarPrompt(id) {
    const prompt = getAllPrompts().find(p => p.id === id);
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.text).then(() => {
      alert("✅ Prompt copiado al portapapeles");
    }).catch(err => {
      console.error('Error al copiar:', err);
      alert("Error al copiar el prompt.");
    });
  }

  // Eliminar un prompt
  function eliminarPrompt(id) {
    if (!id || !confirm("¿Seguro que deseas eliminar este prompt? Esta acción no se puede deshacer.")) return;

    userPrompts = userPrompts.filter(p => p.id !== id);
    localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
    applyFiltersAndSearch(); // (MODIFICADO) Llama a la función central
    closeModal();
  }


  // --- MANEJO DEL MODAL ---

  // Abrir modal
  function openModal(prompt = null) {
    promptForm.reset();
    delete promptForm.dataset.editId;
    delete promptForm.dataset.isFixed;
    deleteBtn.style.display = "none";
    saveBtn.style.display = "inline-block";

    if (prompt) {
      // Modo Vista / Edición
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

      if (prompt.fixed) {
        saveBtn.style.display = "none";
      } else {
        deleteBtn.style.display = "inline-block";
      }
    } else {
      // Modo Creación
      modalTitle.textContent = "Nuevo Prompt";
      [nameInput, textInput, contextInput, personalizationInput, freqSelect].forEach(el => { el.disabled = false; });
    }

    showOverlay();
    promptModal.classList.add("active");
    promptModal.style.display = "block";
  }

  // Cerrar modal
  function closeModal() {
    promptModal.classList.remove("active");
    promptModal.style.display = "none";
    hideOverlay();
  }

  // Overlay show/hide
  function showOverlay() { modalOverlay.classList.add("active"); modalOverlay.style.display = "block"; }
  function hideOverlay() { modalOverlay.classList.remove("active"); modalOverlay.style.display = "none"; }

  // Eventos para cerrar modal
  modalOverlay.addEventListener("click", closeModal);
  closeBtns.forEach(b => b.addEventListener("click", closeModal));
  cancelBtn.addEventListener("click", closeModal);

  // Botón "Nuevo Prompt"
  addPromptBtn.addEventListener("click", () => openModal(null));


  // --- FORMULARIO (Guardar / Crear) ---
  promptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (promptForm.dataset.isFixed === "true") return;

    const id = promptForm.dataset.editId || String(Date.now());
    let createdAt = Date.now();
    const existingIndex = userPrompts.findIndex(p => p.id === id);
    
    if (existingIndex > -1) {
      createdAt = userPrompts[existingIndex].createdAt;
    }

    const newPrompt = {
      id,
      name: nameInput.value.trim() || "Sin título",
      text: textInput.value.trim(),
      context: contextInput.value.trim(),
      personalization: personalizationInput.value.trim(),
      frequency: freqSelect.value,
      fixed: false,
      createdAt: createdAt
    };

    if (existingIndex > -1) {
      userPrompts[existingIndex] = newPrompt;
    } else {
      userPrompts.push(newPrompt);
    }

    localStorage.setItem("userPrompts", JSON.stringify(userPrompts));
    applyFiltersAndSearch(); // (MODIFICADO) Llama a la función central
    closeModal();
  });

  // Botón Eliminar del modal
  deleteBtn.addEventListener("click", () => {
    const id = promptForm.dataset.editId;
    eliminarPrompt(id);
  });


  // --- BÚSQUEDA Y FILTROS ---

  // (MODIFICADO) Evento de Búsqueda
  searchInput.addEventListener("input", () => {
    applyFiltersAndSearch(); // Llama a la función central
  });

  // (NUEVO) Eventos de Filtros
  filterBtns.forEach(btn => {
    btn.addEventListener("click", ()F => {
      // 1. Actualiza el estado
      currentFilter = btn.dataset.filter;

      // 2. Actualiza la UI de los botones
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // 3. Re-renderiza la lista
      applyFiltersAndSearch();
    });
  });


  // --- ACCIONES EXTERNAS ---

  // Botón Ver en Google Sheets
  viewSheetBtn.addEventListener("click", () => {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1LdUoniteMSwjeLTm0RfCtk5rPMVBY4jQte3Sh0SKKNc/edit?usp=sharing";
    window.open(sheetUrl, "_blank");
  });

  // Exportar Excel
  exportBtn.addEventListener("click", () => {
    const url = "https://github.com/jairoamayalaverde/contador4-biblioteca/raw/main/Biblioteca%20de%20Prompts%20Contador%204.0.xlsx";
    window.open(url, "_blank");
  });

  // --- INICIALIZACIÓN ---
  applyFiltersAndSearch(); // (MODIFICADO) Llama a la función central al cargar

});
