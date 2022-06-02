import {
  onGetTasks,
  saveTask,
  deleteTask,
  getTask,
  updateTask,
  getTasks,
} from "./firebase.js";

const taskForm = document.getElementById("task-form");
const tbody = document.getElementById('tbody');

let editStatus = false;
let id = "";
window.addEventListener("DOMContentLoaded", async (e) => {
  // const querySnapshot = await getTasks();
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.data());
  // });

  onGetTasks((querySnapshot) => {

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      tbody.innerHTML+=`
      <tr>
      <td>${task.title}</td>
      <td>${task.precio}</td>
      <td><button class="btn btn-secondary btn-edit" data-id="${doc.id}">🖉</button></td>
      <td><button class="btn btn-primary btn-delete" data-id="${doc.id}">🗑</button></td>
     </tr>
      `;
    });
    const btnsDelete = tbody.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        try {
          await deleteTask(dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tbody.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-title"].value = task.title;
          taskForm["task-precio"].value = task.precio;
          taskForm["task-image"].value = task.imagen;
          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});
async function updateTbody (){
  onGetTasks((querySnapshot) => {
    tbody.innerHTML='';
    querySnapshot.forEach((doc) => {
      const task = doc.data();
    tbody.innerHTML+=`
    <tr>
    <td>${task.title}</td>
    <td>${task.precio}</td>
    <td>${task.categoria}</td>
    <td><button class="btn btn-secondary btn-edit" data-id="${doc.id}">🖉</button></td>
    <td><button class="btn btn-primary btn-delete" data-id="${doc.id}">🗑</button></td>
   </tr>
    `;
});
  });
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const precio = taskForm["task-precio"];
  const imagen = taskForm["task-image"];


  try {
    if (!editStatus) {
      await saveTask(title.value, precio.value, imagen.value);
    } else {
      await updateTask(id, {
        title: title.value,
        precio: precio.value,
        imagen: imagen.value
      });
      await updateTbody();
      editStatus = false;
      id = "";
      taskForm["btn-task-form"].innerText = "Save";
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});
