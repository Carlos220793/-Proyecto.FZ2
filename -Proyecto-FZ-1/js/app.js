// Sistema local sin Firebase
const $ = id => document.getElementById(id);

let mantenimientos = JSON.parse(localStorage.getItem("mantenimientos")) || [];

const loginForm = $("formulario-inicio-sesion");
const recuperarForm = $("formulario-recuperar-contraseña");
const emailInput = $("email-recuperar");
const mensajeCorreo = $("mensaje-validacion");
const acciones = $("acciones");
const mantenimientoForm = $("form-mantenimiento");
const tabla = $("tabla-mantenimientos").querySelector("tbody");
const buscarInput = $("buscar-input");
const modal = $("modal-edicion");
const cerrarModal = $("cerrar-modal");
const edicionForm = $("form-edicion");

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const usuario = $("usuario").value.trim();
  const contraseña = $("contraseña").value.trim();
  if (usuario === "Administrador" && contraseña === "sysadm1n") {
    document.body.classList.remove("fondo-inicio-sesion");
    document.body.classList.add("sesion-activa");
    document.body.style.background = "#eef2f5";
    loginForm.style.display = "none";
    acciones.style.display = "flex";
    $("mantenimientos").style.display = "none";
    $("buscar-mantenimiento").style.display = "none";
  } else {
    alert("Credenciales incorrectas.");
  }
});

$("olvidas-contraseña").addEventListener("click", e => {
  e.preventDefault();
  loginForm.style.display = "none";
  recuperarForm.style.display = "flex";
});

$("volver-al-login").addEventListener("click", e => {
  e.preventDefault();
  recuperarForm.style.display = "none";
  loginForm.style.display = "block";
  mensajeCorreo.textContent = "";
});

recuperarForm.addEventListener("submit", e => {
  e.preventDefault();
  const correo = emailInput.value.trim();
  if (correo) {
    alert("Si este correo está registrado, se enviarán instrucciones de recuperación.");
    mensajeCorreo.textContent = "Se ha enviado un mensaje de recuperación.";
    mensajeCorreo.className = "mensaje-validacion valido";
  } else {
    mensajeCorreo.textContent = "Ingresa un correo válido.";
    mensajeCorreo.className = "mensaje-validacion";
  }
});

$("agregar-mantenimiento").onclick = () => {
  document.body.classList.add("sesion-activa");
  $("mantenimientos").style.display = "block";
  $("buscar-mantenimiento").style.display = "none";
  acciones.style.display = "none";
  cargarMantenimientos();
};

$("volver-menu").onclick = () => {
  document.body.classList.add("sesion-activa");
  $("mantenimientos").style.display = "none";
  acciones.style.display = "flex";
};

$("buscar-mantenimiento-btn").onclick = () => {
  document.body.classList.add("sesion-activa");
  $("buscar-mantenimiento").style.display = "block";
  $("mantenimientos").style.display = "none";
  acciones.style.display = "none";
  buscarMantenimientos();
};

$("volver-menu-buscar").onclick = () => {
  document.body.classList.add("sesion-activa");
  $("buscar-mantenimiento").style.display = "none";
  acciones.style.display = "flex";
};

mantenimientoForm.addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(mantenimientoForm).entries());
  data.id = Date.now().toString();
  mantenimientos.push(data);
  localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos));
  mantenimientoForm.reset();
  cargarMantenimientos();
});

function cargarMantenimientos() {
  tabla.innerHTML = "";
  mantenimientos.forEach(data => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.fecha}</td><td>${data.estado}</td><td>${data.nombre}</td>
      <td>${data.placa}</td><td>${data.serial}</td><td>${data.descripcion}</td>
      <td>${data.persona}</td><td>${data.centroCosto}</td><td>${data.modelo}</td>
      <td>${data.area}</td><td>${data.cd}</td>
      <td>
        <button onclick="editarMantenimiento('${data.id}')">✏️</button>
        <button onclick="eliminarMantenimiento('${data.id}')">🗑️</button>
      </td>`;
    tabla.appendChild(tr);
  });
}

window.eliminarMantenimiento = id => {
  mantenimientos = mantenimientos.filter(m => m.id !== id);
  localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos));
  cargarMantenimientos();
};

window.editarMantenimiento = id => {
  const data = mantenimientos.find(m => m.id === id);
  if (!data) return;
  $("edit-id").value = data.id;
  for (const key in data) {
    const input = $("edit-" + key);
    if (input) input.value = data[key];
  }
  modal.style.display = "flex";
};

cerrarModal.onclick = () => modal.style.display = "none";

edicionForm.addEventListener("submit", e => {
  e.preventDefault();
  const id = $("edit-id").value;
  const data = Object.fromEntries(new FormData(edicionForm).entries());
  data.id = id;
  const index = mantenimientos.findIndex(m => m.id === id);
  if (index >= 0) mantenimientos[index] = data;
  localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos));
  modal.style.display = "none";
  cargarMantenimientos();
});

function buscarMantenimientos() {
  const filtro = buscarInput.value.toLowerCase();
  const tbody = $("tabla-busqueda").querySelector("tbody");
  tbody.innerHTML = "";
  mantenimientos.forEach(data => {
    const cadena = Object.values(data).join(" ").toLowerCase();
    if (cadena.includes(filtro)) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.fecha}</td><td>${data.estado}</td><td>${data.nombre}</td>
        <td>${data.placa}</td><td>${data.serial}</td><td>${data.descripcion}</td>
        <td>${data.persona}</td><td>${data.centroCosto}</td><td>${data.modelo}</td>
        <td>${data.area}</td><td>${data.cd}</td>`;
      tbody.appendChild(tr);
    }
  });
}

buscarInput.addEventListener("input", buscarMantenimientos);
