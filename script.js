document.addEventListener("DOMContentLoaded", () => {
  let db;

  const btnNovaTurma = document.getElementById("btnNovaTurma");
  const listaTurmas = document.getElementById("listaTurmas");
  const inputNomeTurma = document.getElementById("nomeTurma");

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

  btnNovaTurma.addEventListener("click", () => {
    const nome = inputNomeTurma.value.trim();
    if (!nome) {
      alert("Digite o nome da turma");
      return;
    }

    const turma = {
      id: Date.now(),
      nome: nome
    };

    const tx = db.transaction("turmas", "readwrite");
    const store = tx.objectStore("turmas");
    store.add(turma);

    tx.oncomplete = () => {
      inputNomeTurma.value = "";
      carregarTurmas();
    };
  });

  function carregarTurmas() {
    const tx = db.transaction("turmas", "readonly");
    const store = tx.objectStore("turmas");
    const req = store.getAll();

    req.onsuccess = () => {
      renderizarTurmas(req.result);
    };
  }

  function renderizarTurmas(turmas) {
  listaTurmas.innerHTML = "";

  turmas.forEach(turma => {
    const li = document.createElement("li");

    const nome = document.createElement("span");
    nome.textContent = turma.nome;

    const btnEntrar = document.createElement("button");
    btnEntrar.textContent = "Entrar";
    btnEntrar.classList.add("btnEntrar");

    btnEntrar.addEventListener("click", () => {
      alert("Em breve você vai entrar na turma: " + turma.nome);
    });

    li.appendChild(nome);
    li.appendChild(btnEntrar);

    listaTurmas.appendChild(li);
  });
}
});
