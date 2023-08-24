// Import of express
const express = require("express");

// Import of fs
const fs = require("fs");

// Import of body-parser
const bodyParser = require("body-parser");

// Import of jsonServer
const jsonServer = require("json-server");

const jsm = jsonServer.router("db.json");

//Launch the server
const app = express();

// ------------------ APP USE AND SET ------------------ //

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api", jsm);

app.set("view engine", "ejs");

// ------------------ Routes------------------ //
app.get("/", (req, res) => {
  res.redirect("/tasks");
});

app.get("/tasks", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync("db.json")).tasks; // We retrieve the tasks in the JSON file.
  res.render("tasks", { tasks });
});

app.listen(3000, () => console.log("The server is running on port 3000"));

app.post("/tasks/create", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync("db.json")).tasks; // On récupère les tâches dans le fichier JSON.
  const newTask = {
    // On crée une nouvelle tâche.
    id: Date.now(), // On génère un id unique pour la nouvelle tâche.
    title: req.body.title, // On récupère le titre de la nouvelle tâche.
    description: req.body.description, // On récupère la description de la nouvelle tâche.
    status: req.body.status, // On récupère le statut de la nouvelle tâche.
  };
  tasks.push(newTask); // On ajoute la nouvelle tâche dans le tableau des tâches.
  fs.writeFileSync("db.json", JSON.stringify({ tasks })); // On enregistre les tâches dans le fichier JSON.
  res.redirect("/tasks"); // On redirige l'internaute vers la page des tâches.
});

app.get("/tasks/delete/:id", (req, res) => {
  // On définit la route "/tasks/delete/:id".
  const tasks = JSON.parse(fs.readFileSync("db.json")).tasks; // On récupère les tâches dans le fichier JSON.
  const newTasks = tasks.filter((task) => task.id !== parseInt(req.params.id)); // On filtre les tâches pour ne garder que les tâches dont l'id est différent de l'id de la tâche à supprimer.
  fs.writeFileSync("db.json", JSON.stringify({ tasks: newTasks })); // On enregistre les tâches dans le fichier JSON.
  res.redirect("/tasks"); // On redirige l'internaute vers la page des tâches.
});
