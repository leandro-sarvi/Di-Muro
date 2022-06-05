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
const modalEditar = document.getElementById('modal-editar');
const btnCancelar = document.getElementById('btnCancelar');
let editStatus = false;
let id = "";
btnCancelar.addEventListener('click',(e)=>{
  e.preventDefault();
    modalEditar.classList.toggle('hidden');
  });
  tbody.addEventListener("click",(e) => {
    if(e.target.classList.contains('btn-edit')){
      editar(e);
    }
  });
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
      <td><button class="btn btn-primary btn-edit" data-id="${doc.id}">🖉</button></td>
      <td><button class="btn btn-danger btn-delete" data-id="${doc.id}" disabled>🗑</button></td>
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

  });
});

async function editar(e){
  taskForm["task-title"].value = '';
  taskForm["task-precio"].value = '';
  taskForm["task-image"].value = '';
try {
  const doc = await getTask(e.target.dataset.id);
  const task = doc.data();
  taskForm["task-title"].value = task.title;
  taskForm["task-precio"].value = task.precio;
  taskForm["task-image"].value = task.imagen;
  editStatus = true;
  id = doc.id;
  modalEditar.classList.toggle('hidden');
} catch (error) {
  console.log(error);
}
}



async function updateTbody (){
  onGetTasks((querySnapshot) => {
    tbody.innerHTML='';
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      tbody.innerHTML+=`
      <tr>
      <td>${task.title}</td>
      <td>${task.precio}</td>
      <td><button class="btn btn-primary btn-edit" data-id="${doc.id}">🖉</button></td>
      <td><button class="btn btn-danger btn-delete" data-id="${doc.id}" disabled>🗑</button></td>
     </tr>
      `;
});
  });
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskForm["task-title"];
  const precio = taskForm["task-precio"];
  try {
    if (!editStatus) {
      await saveTask(title.value, precio.value);
    } else {
      await updateTask(id, {
        title: title.value,
        precio: precio.value,
      });
      await updateTbody();
      editStatus = false;
      id = "";
      modalEditar.classList.toggle('hidden');
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});
