// script.js – v2.5
document.addEventListener("DOMContentLoaded", () => {
  const addPromptBtn = document.getElementById("addPromptBtn");
  const modal = document.getElementById("promptModal");
  const savePromptBtn = document.getElementById("savePromptBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const promptTableBody = document.getElementById("promptTableBody");
  const exportExcelBtn = document.getElementById("exportExcel");
  const clearLibraryBtn = document.getElementById("clearLibrary");

  // Cargar prompts desde localStorage
  let prompts = JSON.parse(localStorage.getItem("prompts")) || [];

  // Si está vacío, agregar 5 ejemplos iniciales
  if (prompts.length === 0) {
    prompts = [
      {
        categoria: "Análisis Financiero",
        nombre: "Rentabilidad PYME Express",
        cuando: "Cuando el cliente pregunta por qué bajó la utilidad",
        personalizacion: "Incluye 'Sector retail Colombia' y lenguaje simple",
        tiempo: 20,
        frecuencia: "Semanal"
      },
      {
        categoria: "Propuestas",
        nombre: "Propuesta Premium Servicios",
        cuando: "Cuando un prospecto pide cotización o upgrade",
        personalizacion: "Cambio CEO por Gerente, énfasis en ROI cuantificado",
        tiempo: 30,
        frecuencia: "Mensual"
      },
      {
        categoria: "Planificación Fiscal",
        nombre: "Calendario Fiscal Automatizado",
        cuando: "Inicio de mes para planificar obligaciones",
        personalizacion: "Solo clientes régimen común, formato tabla con alertas",
        tiempo: 15,
        frecuencia: "Mensual"
      },
      {
        categoria: "Reportes Ejecutivos",
        nombre: "Reporte Ejecutivo Semanal",
        cuando: "Cada lunes para clientes premium",
        personalizacion: "Dashboard visual, máximo 1 página, 3 métricas clave",
        tiempo: 12,
        frecuencia: "Semanal"
      },
      {
        categoria: "Auditoría de Nómina",
        nombre: "Detección Irregularidades Nómina",
        cuando: "Antes de procesar la nómina mensual",
        personalizacion: "Buscar duplicados, horas extra inusuales, empleados fantasma",
        tiempo: 25,
        frecuencia: "Mensual"
      }
    ];
    localStorage.setItem("prompts", JSON.stringify(prompts));
  }

  // Renderizar tabla
  function renderTable() {
    promptTableBody.innerHTML = "";
    if (prompts.length === 0) {
      promptTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#888;">No hay prompts aún. Usa el botón “+” para agregar uno nuevo.</td></tr>`;
      return;
    }

    prompts.forEach((p, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${p.categoria}</td>
        <td><strong>${p.nombre}</strong></td>
        <td>${p.cuando}</td>
        <td>${p.personalizacion}</td>
        <td>${p.tiempo}</td>
        <td>${p.frecuencia}</td>
        <td><button class="delete-btn" data-index="${i}">🗑️</button></td>
      `;
      promptTableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        prompts.splice(index, 1);
        localStorage.setItem("prompts", JSON.stringify(prompts));
        renderTable();
      });
    });
  }

  // Mostrar modal
  addPromptBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cerrar modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Guardar prompt
  savePromptBtn.addEventListener("click", () => {
    const newPrompt = {
      categoria: document.getElementById("promptCategory").value,
      nombre: document.getElementById("promptName").value,
      cuando: document.getElementById("promptWhen").value,
      personalizacion: document.getElementById("promptCustom").value,
      tiempo: document.getElementById("promptTime").value,
      frecuencia: document.getElementById("promptFrequency").value
    };

    if (!newPrompt.nombre.trim()) {
      alert("El nombre del prompt es obligatorio");
      return;
    }

    prompts.push(newPrompt);
    localStorage.setItem("prompts", JSON.stringify(prompts));
    renderTable();
    modal.style.display = "none";
    document.querySelectorAll("input, textarea").forEach(i => i.value = "");
  });

  // Exportar a Excel
  exportExcelBtn.addEventListener("click", () => {
    const headers = ["Categoría","Nombre","Cuándo Usar","Personalización","Tiempo","Frecuencia"];
    let csv = headers.join(",") + "\n";
    prompts.forEach(p => {
      csv += `${p.categoria},${p.nombre},${p.cuando},${p.personalizacion},${p.tiempo},${p.frecuencia}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Biblioteca_Prompts_Contador4.csv";
    link.click();
  });

  // Limpiar biblioteca
  clearLibraryBtn.addEventListener("click", () => {
    if (confirm("¿Seguro que deseas borrar toda la biblioteca?")) {
      prompts = [];
      localStorage.removeItem("prompts");
      renderTable();
    }
  });

  // Render inicial
  renderTable();
});
