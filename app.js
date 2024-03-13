// jshint esversion: 8
import { login, logout } from "./auth.js";
import { insert, getItems, update } from "./firestore.js";
import { getUUID } from "./utils.js";

let currentUser;
let todos = [];

const buttonLogin = document.getElementById("button-login");
const buttonLogout = document.getElementById("button-logout");
const todoInput = document.getElementById("todo-input");
const todoForm = document.getElementById("todo-form");
const userInfo = document.getElementById("user-info");
const todosContainer = document.getElementById("todos-container");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    currentUser = user;
    init();
  } else {
  }
});

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value;
  if (text !== "") {
    addTodo(text);
  }
});

buttonLogin.addEventListener("click", async (e) => {
  try {
    currentUser = await login();
    init();
  } catch (error) {
    console.error(error);
  }
});

buttonLogout.addEventListener("click", (e) => {
  logout();
  buttonLogin.classList.remove("hidden");
  buttonLogout.classList.add("hidden");
  todoForm.classList.add("hidden");
  todosContainer.innerHTML = "";
});

async function init() {
  buttonLogin.classList.add("hidden");
  buttonLogout.classList.remove("hidden");
  todoForm.classList.remove("hidden");
  userInfo.innerHTML = `
    <img src="${currentUser.photoURL}" width="32" />
    <span>${currentUser.displayName}</span>
  `;

  loadTodos();
}

async function addTodo(text) {
  try {
    const todo = {
      id: getUUID(),
      text: text,
      completed: false,
      userid: currentUser.uid,
    };
    const response = await insert(todo);
    
    // Agrega el todo al array antes de llamar a loadTodos
    todos.push(todo);
    loadTodos();
  } catch (error) {
    console.error(error);
  }
}

async function loadTodos() {
  todosContainer.innerHTML = "";
  todos = [];

  try {
    const response = await getItems(currentUser.uid);

    // Actualiza 'todos' con los datos obtenidos de Firestore
    todos = [...response];
    renderTodos();
  } catch (error) {
    console.error(error);
  }
}

function renderTodos() {
  let html = "";

  // Verificar si 'todos' está definido
  if (todos) {
    todos.forEach((todo) => {
      html += `
        <li>
          <input type="checkbox" id="${todo.id}" ${
        todo.completed ? "checked" : ""
      } />
          <label for="${todo.id}">${todo.text}</label>
        </li>
      `;
    });
  }

  todosContainer.innerHTML = html;

  document
    .querySelectorAll('#todos-container input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", async (e) => {
        const id = e.target.id;
        try {
          await update(id, e.target.checked);
        } catch (error) {
          console.error(error);
        }
      });
    });
}
