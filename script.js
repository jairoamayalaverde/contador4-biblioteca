/* =========================================================
   Biblioteca de Prompts – Contador 4.0 v2.7
   Autor: Jairo Amaya Laverde - Full Stack Marketer
   Funcionalidad completa con almacenamiento local
   ========================================================= */

const tbody = document.querySelector("#promptTable tbody");
const newPromptBtn = document.getElementById("newPromptBtn");
const exportExcelBtn = document.getElementById("exportExcelBtn");

// Modal
const modal = document.getElementById("viewPromptModal");
const viewTitle = document.getElementById("viewPromptTitle");
const viewBody = document.getElementById("viewPromptBody");
const closeModalBtn = document.getElementById("closeModalBtn");
const copyPromptBtn = document.getElementById("copyPrompt");

// ===============================
//   Base de datos local
// ===============================
const defaultPrompts = [
  {
    nombre: "Análisis Express Rentabilidad PYME",
    cuando: "Cliente pregunta por qué bajó la utilidad neta",
    frecuencia: "Semanal",
    contenido: `Analiza la rentabilidad mensual de una PYME del sector retail en Colombia. 
Incluye causas posibles de variación en utilidad neta, compara con promedios del sector 
y presenta recomendaciones claras en lenguaje no técnico.`
  },
  {
    nombre: "Propuesta Premium de Servicios Contables",
    cuando: "Prospecto solicita cotización o upgrade de cliente actual",
    frecuencia: "Mensual",
    contenido: `Genera una propuesta comercial de servicios contables premium orientada a ROI. 
Usa tono profesional, enfatiza beneficios financieros y eficiencia con IA.`
  },
  {
    nombre: "Calendario Fiscal Automatizado",
    cuando: "Inicio de mes para planificar obligaciones",
    frecuencia: "Mensual",
    contenido: `Crea un calendario fiscal automatizado con fechas de vencimiento, 
tipo de obligación y alertas anticipadas. Presenta en formato tabla, 
solo para régimen común Colombia.`
  },
  {
    nombre: "Reporte Ejecutivo Semanal",
    cuando: "Lunes por la mañana para clientes premium",
    frecuencia: "Semanal",
    contenido: `Diseña un reporte ejecutivo de 1 página con 3 métricas clave: 
ingresos, gastos y margen. Añade breve análisis narrativo y recomendaciones.`
  },
  {
    nombre: "Detección de Irregularidades en Nómina",
    cuando: "Antes de procesar nómina mensual",
    frecuencia: "Mensual",
    contenido: `Analiza datos de nómina en busca de duplicados, 
horas extras inusuales o registros sospechosos. 
Sugiere un resumen de hallazgos con posibles impactos financieros.`
  }
];

// Cargar prompts guardados o iniciales
let prompts = JSON.parse(localStorage.getItem("promptsContador4")) || defaultPrompts;

// ===============================
//   Renderización de la tabla
// ===============================
function renderPrompts() {
  tbody.innerHTML = "";
  prompts.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="#">${i + 1}</td>
      <td data-label="Nombre"><a class="prompt-link" data-index="${i}">${p.nombre}</a></td>
      <td data-label="Cuándo usar">${p.cuando}</td>
      <td data-label="Frecuencia">${p.frecuencia}</td>
      <td data-label="Acciones">
        <button class="btn btn-secondary btn-sm deleteBtn" data-index="${i}">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  savePrompts();
}

// Guardar en localStorage
function savePrompts() {
  localStorage.setItem("promptsContador4", JSON.stringify(prompts));
}

// ===============================
//   Modal para ver prompt
// ===============================
tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("prompt-link")) {
    const index = e.target.dataset.index;
    const p = prompts[index];
    viewTitle.innerText = p.nombre;
    viewBody.innerText = p.contenido;
    modal.style.display = "flex";

    copyPromptBtn.onclick = () => {
      navigator.clipboard.writeText(p.contenido);
      alert("✅ Prompt copiado al portapapeles");
    };
  }
});

// ===============================
//   Cerrar modal
// ===============================
closeModalBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// ===============================
//   Eliminar prompt
// ===============================
tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const index = e.target.dataset.index;
    if (confirm(`¿Eliminar el prompt "${prompts[index].nombre}"?`)) {
      prompts.splice(index, 1);
      savePrompts();
      renderPrompts();
    }
  }
});

// ===============================
//   Agregar nuevo prompt
// ===============================
newPromptBtn.onclick = () => {
  const nombre = prompt("Nombre del nuevo prompt:");
  if (!nombre) return;

  const cuando = prompt("¿Cuándo usarlo?");
  if (!cuando) return;

  const frecuencia = prompt("Frecuencia (diaria, semanal, mensual, etc.):");
  if (!frecuencia) return;

  const contenido = prompt("Escribe el contenido completo del prompt:");
  if (!contenido) return;

  prompts.push({ nombre, cuando, frecuencia, contenido });
  savePrompts();
  renderPrompts();
};

// ===============================
//   Exportar a Excel (CSV)
// ===============================
exportExcelBtn.onclick = () => {
  const csv = [
    ["Nombre", "Cuándo Usar", "Frecuencia", "Contenido"],
    ...prompts.map(p => [p.nombre, p.cuando, p.frecuencia, p.contenido])
  ]
    .map(r => r.map(v => `"${v}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Biblioteca_Prompts_Contador4.csv";
  link.click();
};

// Inicializar
renderPrompts();
