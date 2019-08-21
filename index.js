const express = require("express");
const api = express();

api.use(express.json());

// Variavel para contagem
var quantReq = 0;
// Guardando Array vazio
const projects = [];

// Checar existência do projeto com Middleware
function checarProjeto(req, res, next) {
  const id = req.params.id;
  const projeto = projects.find(p => p.id == id);

  if (!projeto) {
    return res.status(400).json({ error: "Projeto não encontrado!" });
  }

  return next();
}

// Midlleware para log de requisições
function requestLog(req, res, next) {
  quantReq++;
  console.log(`Quantidade de requisições: ${quantReq}`);

  return next();
}

api.use(requestLog);

// Rotas do Projeto
api.get("/projects", (req, res) => {
  return res.json(projects);
});

api.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const projeto = {
    id,
    title,
    tasks: []
  };

  projects.push(projeto);
  return res.json(projeto);
});

api.post("/projects/:id/tasks", checarProjeto, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projeto = projects.find(p => p.id == id);
  projeto.tasks.push(title);

  return res.json(projeto);
});

api.put("/projects/:id", checarProjeto, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projeto = projects.find(p => p.id == id);

  projeto.title = title;
  return res.json(projeto);
});

api.delete("/projects/:id", checarProjeto, (req, res) => {
  const { id } = req.params;
  const projetoIndex = projects.findIndex(p => p.id == id);

  projects.splice(projetoIndex, 1);
  return res.send();
});

// Configuração do Servidor
api.listen(3000);
