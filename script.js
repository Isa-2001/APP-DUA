const btnNovaTurma = document.getElementById("btnNovaTurma");
const listaTurmas = document.getElementById("listaTurmas");

let turmas = [];

btnNovaTurma.addEventListener("click", () => {
  const nome = prompt("Nome da turma:");
  if (!nome) return;

  turmas.push({ id: Date.now(), nome });
  renderizarTurmas();
});

function renderizarTurmas() {
  listaTurmas.innerHTML = "";
  turmas.forEach(turma => {
    const li = document.createElement("li");
    li.textContent = turma.nome;
    listaTurmas.appendChild(li);
  });
}
