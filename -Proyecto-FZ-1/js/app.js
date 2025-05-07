const formularioInicioSesion = document.getElementById('formulario-inicio-sesion');
const formularioRecuperarContraseña = document.getElementById('formulario-recuperar-contraseña');
const acciones = document.getElementById('acciones');
const agregarMantenimiento = document.getElementById('agregar-mantenimiento');
const buscarMantenimientoBtn = document.getElementById('buscar-mantenimiento-btn');
const mantenimientosDiv = document.getElementById('mantenimientos');
const buscarMantenimientoDiv = document.getElementById('buscar-mantenimiento');
const formMantenimiento = document.getElementById('form-mantenimiento');
const volverMenuBtn = document.getElementById('volver-menu');
const volverMenuBuscarBtn = document.getElementById('volver-menu-buscar');
const tablaMantenimientos = document.getElementById('tabla-mantenimientos').querySelector('tbody');
const buscarInput = document.getElementById('buscar-input');
const tablaBusqueda = document.getElementById('tabla-busqueda').querySelector('tbody');

// Inicialización de variables
formularioRecuperarContraseña.style.display = 'none';
const mantenimientos = JSON.parse(localStorage.getItem('mantenimientos')) || [];

// Inicializar EmailJS con tu user_id
emailjs.init("service_rxr2n9j");  // Reemplaza con tu `user_id`
// Evento para cuando el usuario hace clic en "Olvidé mi contraseña"
document.getElementById('olvidas-contraseña').addEventListener('click', function(e) {
  e.preventDefault();  // Previene el comportamiento predeterminado (enviar el formulario o recargar la página)
  
  // Cambia la vista a la pantalla de recuperar contraseña
  formularioInicioSesion.style.display = 'none';  // Oculta el formulario de inicio de sesión
  formularioRecuperarContraseña.style.display = 'flex';  // Muestra el formulario de recuperar contraseña
  formularioRecuperarContraseña.style.flexDirection = 'column';  // Organiza los elementos de forma vertical

  // Aquí enviamos el correo usando EmailJS
  emailjs.send("service_rxr2n9j", "template_yourTemplateID", {
    user_email: "carlosamaya2207@gmail.com",  // Tu correo de destino
    message: "Solicitud para recuperar la contraseña"
  }).then(function(response) {
    alert("Correo de recuperación enviado exitosamente");
  }, function(error) {
    alert("Hubo un error al enviar el correo: " + error);
  });
});


// Mostrar formulario de recuperación de contraseña
document.getElementById('olvidas-contraseña').addEventListener('click', function(e) {
  e.preventDefault();
  formularioInicioSesion.style.display = 'none';
  formularioRecuperarContraseña.style.display = 'flex';
  formularioRecuperarContraseña.style.flexDirection = 'column';
});

// Lógica para iniciar sesión
formularioInicioSesion.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const contraseña = document.getElementById('contraseña').value;

  // Si las credenciales son correctas
  if (usuario === "Administrador" && contraseña === "sysadm1n") {
    // Eliminar la clase que pone el fondo de pantalla
    document.body.classList.remove('fondo-inicio-sesion');

    formularioInicioSesion.style.display = 'none';
    acciones.style.display = 'block';
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

// Función para agregar mantenimiento
agregarMantenimiento.addEventListener('click', function() {
  mantenimientosDiv.style.display = 'block';
  buscarMantenimientoDiv.style.display = 'none';
  mostrarMantenimientos();
});

// Función para buscar mantenimiento
buscarMantenimientoBtn.addEventListener('click', function() {
  buscarMantenimientoDiv.style.display = 'block';
  mantenimientosDiv.style.display = 'none';
  buscarInput.value = '';
  mostrarBusqueda();
});

// Función para volver al menú principal
volverMenuBtn.addEventListener('click', function() {
  if (confirm("¿Volver al menú principal?")) {
    mantenimientosDiv.style.display = 'none';
    acciones.style.display = 'block';
  }
});

volverMenuBuscarBtn.addEventListener('click', function() {
  if (confirm("¿Volver al menú principal?")) {
    buscarMantenimientoDiv.style.display = 'none';
    acciones.style.display = 'block';
  }
});

// Función para mostrar los mantenimientos registrados
formMantenimiento.addEventListener('submit', function(e) {
  e.preventDefault();
  const nuevo = {
    fecha: document.getElementById('fecha').value,
    estado: document.getElementById('estado').value,
    nombre: document.getElementById('nombre').value,
    placa: document.getElementById('placa').value,
    serial: document.getElementById('serial').value,
    descripcion: document.getElementById('descripcion').value,
    persona: document.getElementById('persona').value,
    centroCosto: document.getElementById('centroCosto').value,
    modelo: document.getElementById('modelo').value,
    area: document.getElementById('area').value,
    cd: document.getElementById('cd').value
  };

  mantenimientos.push(nuevo);
  localStorage.setItem('mantenimientos', JSON.stringify(mantenimientos));
  formMantenimiento.reset();
  mostrarMantenimientos();
});

// Función para mostrar la lista de mantenimientos
function mostrarMantenimientos() {
  tablaMantenimientos.innerHTML = '';
  mantenimientos.forEach((m, index) => {
    const fila = `
      <tr>
        <td>${m.fecha}</td>
        <td>${m.estado}</td>
        <td>${m.nombre}</td>
        <td>${m.placa}</td>
        <td>${m.serial}</td>
        <td>${m.descripcion}</td>
        <td>${m.persona}</td>
        <td>${m.centroCosto}</td>
        <td>${m.modelo}</td>
        <td>${m.area}</td>
        <td>${m.cd}</td>
        <td>
          <button onclick="editarMantenimiento(${index})">Editar</button>
          <button onclick="eliminarMantenimiento(${index})">Eliminar</button>
        </td>
      </tr>
    `;
    tablaMantenimientos.innerHTML += fila;
  });
}

function mostrarBusqueda() {
  buscarInput.addEventListener('input', function() {
    const busqueda = buscarInput.value.toLowerCase();
    const resultados = mantenimientos.filter(m =>
      m.nombre.toLowerCase().includes(busqueda) ||
      m.cd.toLowerCase().includes(busqueda) ||
      m.fecha.includes(busqueda)
    );
    tablaBusqueda.innerHTML = '';
    resultados.forEach(m => {
      const fila = `
        <tr>
          <td>${m.fecha}</td>
          <td>${m.estado}</td>
          <td>${m.nombre}</td>
          <td>${m.placa}</td>
          <td>${m.serial}</td>
          <td>${m.descripcion}</td>
          <td>${m.persona}</td>
          <td>${m.centroCosto}</td>
          <td>${m.modelo}</td>
          <td>${m.area}</td>
          <td>${m.cd}</td>
        </tr>
      `;
      tablaBusqueda.innerHTML += fila;
    });
  });
}

window.editarMantenimiento = function(index) {
  const m = mantenimientos[index];
  document.getElementById('fecha').value = m.fecha;
  document.getElementById('estado').value = m.estado;
  document.getElementById('nombre').value = m.nombre;
  document.getElementById('placa').value = m.placa;
  document.getElementById('serial').value = m.serial;
  document.getElementById('descripcion').value = m.descripcion;
  document.getElementById('persona').value = m.persona;
  document.getElementById('centroCosto').value = m.centroCosto;
  document.getElementById('modelo').value = m.modelo;
  document.getElementById('area').value = m.area;
  document.getElementById('cd').value = m.cd;

  mantenimientos.splice(index, 1);
  localStorage.setItem('mantenimientos', JSON.stringify(mantenimientos));
  mostrarMantenimientos();
}

window.eliminarMantenimiento = function(index) {
  if (confirm('¿Estás seguro de eliminar este mantenimiento?')) {
    mantenimientos.splice(index, 1);
    localStorage.setItem('mantenimientos', JSON.stringify(mantenimientos));
    mostrarMantenimientos();
  }
}

mostrarMantenimientos();
