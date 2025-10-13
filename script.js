// === ELEMENTOS ===
const addPromptBtn = document.getElementById("addPromptBtn");
const promptModal = document.getElementById("promptModal");
const closeModal = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const promptForm = document.getElementById("promptForm");
const promptList = document.getElementById("promptList");
const exportBtn = document.getElementById("exportBtn");
const exportBtnSheet = document.getElementById("exportBtnSheet");

const nameInput = document.getElementById("promptName");
const contextInput = document.getElementById("promptContext");
const personalizationInput = document.getElementById("promptPersonalization");
const textInput = document.getElementById("promptText");
const freqSelect = document.getElementById("promptFrequency");

// === PROMPTS BASE ===
const defaultPrompts = [
  { name: "Análisis Express Rentabilidad PYME" },
  { name: "Propuesta Premium de Servicios" },
  { name: "Calendario Fiscal Automatizado" },
  { name: "Reporte Ejecutivo Semanal" },
  { name: "Detección de Irregularidades en Nómina" }
];

// === RENDER ===
function renderPrompts() {
  promptList.innerHTML = "";
  defaultPrompts.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("prompt-card");
    card.textContent = p.name;
    promptList.appendChild(card);
  });
}
renderPrompts();

// === MODAL ===
addPromptBtn.addEventListener("click", () => {
  promptModal.style.display = "flex";
});
closeModal.addEventListener("click", () => {
  promptModal.style.display = "none";
});
cancelBtn.addEventListener("click", () => {
  promptModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === promptModal) promptModal.style.display = "none";
});

// === EXPORTAR EXCEL ===
exportBtn.addEventListener("click", () => {
  alert("La descarga Excel se ejecutará próximamente (versión en desarrollo).");
});

// === GOOGLE SHEETS ===
exportBtnSheet.addEventListener("click", () => {
  window.open("https://docs.google.com/spreadsheets/d/1LdUoniteMSwjeLTm0RfCtk5rPMVBY4jQte3Sh0SKKNc/edit?usp=sharing", "_blank");
});
