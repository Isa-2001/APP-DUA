document.addEventListener("DOMContentLoaded", () => {
  let db;
  let turmaSelecionada = null;

  const app = document.getElementById("app");

  const request = indexedDB.open("appDUA", 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;

    if (!db.objectStoreNames.contains("turmas")) {
      db.createObjectStore("turmas", { keyPath: "id" });
    }

    if (!db.objectStoreNames.contains("estudantes")) {
      db.createObjectStore("estudantes", { keyPath: "id" });
    }
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    telaInicial();
  };

  request.onerror = () => {
    alert("Erro ao abrir o banco de dados");
  };

  // ===== TELA INICIAL =====
  function telaInicial() {
    app.innerHTML = `
      <section class="card">
        <h2>Minhas Turmas</h2>
        <div class="form">
          <input type="text" id="nomeTurma" placeholder="Nome da turma">
          <button id="btnNovaTurma">Criar Turma</button>
        </div>
        <ul id="listaTurmas"></ul>
      </section>
    `;

    document.getElementById("btnNovaTurma").addEventListener("click", criarTurma);
    carregarTurmas();
  }

  function criarTurma() {
    const nome = document.getElementById("nomeTurma").value.trim();
    if (!nome) return;

    const turma = { id: Date.now(), nome };

    const tx = db.transaction("turmas", "readwrite");
    const store = tx.objectStore("turmas");
    store.add(turma);

    tx.oncomplete = () => {
      telaInicial();
    };
  }

  function carregarTurmas() {
    const tx = db.transaction("turmas", "readonly");
    const store = tx.objectStore("turmas");
    const req = store.getAll();

    req.onsuccess = () => {
      renderizarTurmas(req.result);
    };
  }

  function renderizarTurmas(turmas) {
    const listaTurmas = document.getElementById("listaTurmas");
    listaTurmas.innerHTML = "";

    if (!turmas || turmas.length === 0) {
      listaTurmas.innerHTML = "<li style='font-style: italic;'>Nenhuma turma cadastrada.</li>";
      return;
    }

    turmas.forEach(turma => {
      const li = document.createElement("li");

      const nome = document.createElement("span");
      nome.textContent = turma.nome;

      const btnEntrar = document.createElement("button");
      btnEntrar.textContent = "Entrar";
      btnEntrar.classList.add("btnEntrar");

      btnEntrar.addEventListener("click", () => {
        turmaSelecionada = turma;
        telaTurma();
      });

      li.appendChild(nome);
      li.appendChild(btnEntrar);
      listaTurmas.appendChild(li);
    });
  }

  // ===== TELA DA TURMA =====
  function telaTurma() {
    app.innerHTML = `
      <section class="card">
        <button id="btnVoltar" class="btnVoltar">← Voltar</button>
        <h2>${turmaSelecionada.nome}</h2>

        <div class="form">
          <input type="text" id="nomeAluno" placeholder="Nome do estudante">
          <button id="btnNovoAluno">Adicionar estudante</button>
        </div>

        <ul id="listaAlunos"></ul>
      </section>
    `;

    document.getElementById("btnVoltar").addEventListener("click", () => {
      turmaSelecionada = null;
      telaInicial();
    });

    document.getElementById("btnNovoAluno").addEventListener("click", adicionarAluno);
    carregarAlunos();
  }

  function adicionarAluno() {
    const nome = document.getElementById("nomeAluno").value.trim();
    if (!nome) return;

    const aluno = {
      id: Date.now(),
      nome,
      turmaId: turmaSelecionada.id
    };

    const tx = db.transaction("estudantes", "readwrite");
    const store = tx.objectStore("estudantes");
    store.add(aluno);

    tx.oncomplete = () => {
      telaTurma();
    };
  }

  function carregarAlunos() {
    const tx = db.transaction("estudantes", "readonly");
    const store = tx.objectStore("estudantes");
    const req = store.getAll();

    req.onsuccess = () => {
      const todos = req.result || [];
      const alunosDaTurma = todos.filter(a => a.turmaId === turmaSelecionada.id);
      renderizarAlunos(alunosDaTurma);
    };
  }

  function renderizarAlunos(alunos) {
    const listaAlunos = document.getElementById("listaAlunos");
    listaAlunos.innerHTML = "";

    if (!alunos || alunos.length === 0) {
      listaAlunos.innerHTML = "<li style='font-style: italic;'>Nenhum estudante cadastrado ainda.</li>";
      return;
    }

    alunos.forEach(aluno => {
      const li = document.createElement("li");
      li.textContent = aluno.nome;
      listaAlunos.appendChild(li);
    });
  }
});
