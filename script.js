let db;
const request = indexedDB.open("appDUA", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains("turmas")) {
    db.createObjectStore("turmas", { keyPath: "id" });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  carregarTurmas();
};

function salvarTurma(turma) {
  const tx = db.transaction("turmas", "readwrite");
  const store = tx.objectStore("turmas");
  store.add(turma);
}

function carregarTurmas() {
  const tx = db.transaction("turmas", "readonly");
  const store = tx.objectStore("turmas");
  const request = store.getAll();

  request.onsuccess = () => {
    renderizarTurmas(request.result);
  };
}

const btnNovaTurma = document.getElementById("btnNovaTurma");
const listaTurmas = document.getElementById("listaTurmas");

btnNovaTurma.addEventListener("click", () => {
  const nome = prompt("Nome da turma:");
  if (!nome) return;

  const turma = {
    id: Date.now(),
    nome: nome
  };

  salvarTurma(turma);
  carregarTurmas();
});

function renderizarTurmas(turmas) {
  listaTurmas.innerHTML = "";
  turmas.forEach(turma => {
    const li = document.createElement("li");
    li.textContent = turma.nome;
    listaTurmas.appendChild(li);
  });
}
