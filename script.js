const prompts = [
  {
    title: "Análisis Express Rentabilidad PYME",
    description: "Genera un análisis rápido de rentabilidad para una empresa PYME con métricas clave."
  },
  {
    title: "Propuesta Premium de Servicios",
    description: "Crea una propuesta de servicios contables premium con valor agregado y diferenciación."
  },
  {
    title: "Calendario Fiscal Automatizado",
    description: "Desarrolla un calendario automatizado con fechas clave fiscales y recordatorios."
  },
  {
    title: "Reporte Ejecutivo Semanal",
    description: "Genera un informe ejecutivo semanal con métricas financieras relevantes."
  },
  {
    title: "Detección de Irregularidades en Nómina",
    description: "Analiza los datos de nómina para identificar irregularidades o anomalías."
  }
];

// Render de tarjetas
const container = document.getElementById("promptsContainer");
container.innerHTML = prompts
  .map(p => `<div class="prompt-card" onclick="openPrompt('${p.title}','${p.description}')">${p.title}</div>`)
  .join("");

// Modal funcional
const modal = document.getElementById("promptModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const closeBtn = document.querySelector(".close");

function openPrompt(title, description) {
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modal.style.display = "block";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// Botón Exportar Excel
document.getElementById("exportExcel").addEventListener("click", () => {
  const url = "https://github.com/jairoamayalaverde/contador4-biblioteca/raw/main/Biblioteca%20de%20Prompts%20Contador%204.0.xlsx";
  const link = document.createElement("a");
  link.href = url;
  link.download = "Biblioteca de Prompts Contador 4.0.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Botón Google Sheets
document.getElementById("viewSheets").addEventListener("click", () => {
  window.open("https://docs.google.com/spreadsheets/d/1LdUoniteMSwjeLTm0RfCtk5rPMVBY4jQte3Sh0SKKNc/edit?usp=sharing", "_blank");
});
