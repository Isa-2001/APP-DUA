document.addEventListener("DOMContentLoaded", () => {
  let db;

  const btnNovaTurma = document.getElementById("btnNovaTurma");
  const listaTurmas = document.getElementById("listaTurmas");

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

  request.onerror = () => {
    alert("Erro ao abrir o banco de dados");
  };

  const inputNomeTurma = document.getElementById("nomeTurma");

btnNovaTurma.addEventListener("click", () => {
  const nome = inputNomeTurma.value.trim();
  if (!nome) return;

  inputNomeTurma.value = "";

    const turma = {
      id: Date.now(),
      nome: nome
    };

    const tx = db.transaction("turmas", "readwrite");
    const store = tx.objectStore("turmas");
    store.add(turma);

    tx.oncomplete = () => {
      carregarTurmas();
    };
  });

  function carregarTurmas() {
    const tx = db.transaction("turmas", "readonly");
    const store = tx.objectStore("turmas");
    const request = store.getAll();

    request.onsuccess = () => {
      renderizarTurmas(request.result);
    };
  }

  function renderizarTurmas(turmas) {
    listaTurmas.innerHTML = "";
    turmas.forEach(turma => {
      const li = document.createElement("li");
      li.textContent = turma.nome;
      listaTurmas.appendChild(li);
    });
  }
});
