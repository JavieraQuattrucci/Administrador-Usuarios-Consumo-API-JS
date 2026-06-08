// --- 1. MEMORIA CACHÉ GLOBAL ---
let cachedUsers = null; 

// --- 2. FUNCIÓN ASINCRÓNICA CON CALLBACK (Maneja el XMLHttpRequest) ---
function obtenerUsuarios(callback) {
    // Si ya existen datos guardados en la caché global, los usamos de inmediato
    if (cachedUsers) {
        console.log("[CACHÉ] Datos obtenidos desde memoria local (XHR).");
        callback(cachedUsers); 
        return;
    }

    // Si no hay caché, hacemos la petición al servidor
    const url = "https://jsonplaceholder.typicode.com/users";
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', url, true); // true = Asincrónico

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Guardamos los datos en la caché global
            cachedUsers = JSON.parse(xhr.responseText);
            console.log("[API] Datos obtenidos del servidor por primera vez (XHR):", cachedUsers);
            
            // Ejecutamos el callback pasándole los datos
            callback(cachedUsers);
        } else {
            console.error("Error en la petición:", xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error("Error de red.");
    };

    xhr.send();
}

// --- 3. FUNCIÓN PARA MOSTRAR LA LISTA EN EL HTML ---
function mostrarLista(usuariosPreordenados = null) {
    // Función interna para renderizar el HTML y evitar repetir código
    const renderizar = (usuarios) => {
        const div = document.getElementById("salida-lista");
        if (!div) return; // Evita errores si el div no existe en el HTML

        div.innerHTML = `
            <div class="lista-usuarios">
                ${usuarios.map(u => `
                    <div class="usuario-item">
                        <i class="bi bi-person-circle"></i>
                        <span class="usuario-texto">Nombre: ${u.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    };

    // Si ya nos pasaron los usuarios ordenados, los pintamos directo
    if (usuariosPreordenados) {
        renderizar(usuariosPreordenados);
    } else {
        // Si no, hacemos el flujo clásico de pedir a la API/Caché
        obtenerUsuarios(function(usuarios) {
            renderizar(usuarios);
            console.group("Lista de Todos los Usuarios en Consola");
            usuarios.forEach(user => console.log(user.name));
            console.groupEnd();
        });
    }
}

// --- 4. CLASE ADMINISTRADORA (Corregida e Integrada) ---
class UserAdmin {
    constructor() {
        // Inicializamos cargando los datos en nuestra propiedad local mediante el callback
        this.actualizarDatosLocales();
    }

    // Método interno para asegurar que la clase tenga acceso a los datos de la caché
    actualizarDatosLocales(callbackDestino = null) {
        obtenerUsuarios((usuarios) => {
            this.users = usuarios; // Sincroniza los usuarios de la caché con la clase
            if (callbackDestino) callbackDestino(); // Si venía una acción posterior, la ejecuta
        });
    }

    // Auxiliar para buscar usuario por nombre
    buscarUsuarioPorNombre() {
        const nombreInput = prompt("Ingrese el nombre completo del usuario:");
        if (!nombreInput) return null;

        const usuario = this.users.find(u => u.name.toLowerCase() === nombreInput.toLowerCase().trim());
        
        if (!usuario) {
            console.warn(`Usuario "${nombreInput}" no encontrado.`);
            alert("Usuario no encontrado.");
            return null;
        }
        return usuario;
    }

    // 1. Listar los nombres de todos los usuarios (Antes borrado, ahora restaurado y conectado al HTML)
    listarNombres() {
        // Primero nos aseguramos de tener los datos actualizados, luego ejecutamos la acción gráfica
        this.actualizarDatosLocales(() => {
            mostrarLista();
        });
    }

    // 2. Información básica (username y correo)
    mostrarInfoBasica() {
        this.actualizarDatosLocales(() => {
            const usuario = this.buscarUsuarioPorNombre();
            if (usuario) {
                console.group(`Información Básica de ${usuario.name}`);
                console.log(`Username: ${usuario.username}`);
                console.log(`Email: ${usuario.email}`);
                console.groupEnd();
            }
        });
    }

    // 3. Dirección completa [todos los campos]
    mostrarDireccion() {
        this.actualizarDatosLocales(() => {
            const usuario = this.buscarUsuarioPorNombre();
            if (usuario) {
                console.group(`Dirección de ${usuario.name}`);
                console.log(`Calle: ${usuario.address.street}`);
                console.log(`Suite: ${usuario.address.suite}`);
                console.log(`Ciudad: ${usuario.address.city}`);
                console.log(`Código Postal: ${usuario.address.zipcode}`);
                console.log(`Geolocalización - Lat: ${usuario.address.geo.lat}, Lng: ${usuario.address.geo.lng}`);
                console.groupEnd();
            }
        });
    }

    // 4. Información avanzada (teléfono, sitio web y compañía)
    mostrarInfoAvanzada() {
        this.actualizarDatosLocales(() => {
            const usuario = this.buscarUsuarioPorNombre();
            if (usuario) {
                console.group(`Información Avanzada de ${usuario.name}`);
                console.log(`Teléfono: ${usuario.phone}`);
                console.log(`Sitio Web: ${usuario.website}`);
                console.group(`Compañía`);
                console.log(`Nombre: ${usuario.company.name}`);
                console.log(`Frase Clave: ${usuario.company.catchPhrase}`);
                console.log(`BS: ${usuario.company.bs}`);
                console.groupEnd();
                console.groupEnd();
            }
        });
    }

    // 5. Listar todas las compañías junto a su frase clave
    listarCompanias() {
        this.actualizarDatosLocales(() => {
            console.group("Compañías y sus Frases Clave");
            this.users.forEach(user => {
                console.log(`Compañía: ${user.company.name} | Frase: "${user.company.catchPhrase}"`);
            });
            console.groupEnd();
        });
    }

    // 6. Listar nombres ordenados alfabéticamente
    listarOrdenados() {
        this.actualizarDatosLocales(() => {
            console.group("Usuarios Ordenados Alfabéticamente (A-Z)");
            
            // 1. Clonamos y ordenamos el array completo de objetos usuario
            const usuariosOrdenados = [...this.users].sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            
            // 2. Mostramos en consola para mantener tu feedback actual
            usuariosOrdenados.forEach(user => console.log(user.name));
            console.groupEnd();

            // 3. ¡Magia! Enviamos la lista ordenada al Front (si no existía la lista, la crea)
            mostrarLista(usuariosOrdenados);
        });
    }
}

// --- 5. INICIALIZACIÓN Y EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    // Instanciamos la clase (Ya no requiere pasarle la URL por parámetro aquí)
    const admin = new UserAdmin();

    // Vinculamos los botones HTML con los métodos de la clase
    document.getElementById('btn-listar-nombres').addEventListener('click', () => admin.listarNombres());
    document.getElementById('btn-info-basica').addEventListener('click', () => admin.mostrarInfoBasica());
    document.getElementById('btn-direccion').addEventListener('click', () => admin.mostrarDireccion());
    document.getElementById('btn-info-avanzada').addEventListener('click', () => admin.mostrarInfoAvanzada());
    document.getElementById('btn-companias').addEventListener('click', () => admin.listarCompanias());
    document.getElementById('btn-ordenados').addEventListener('click', () => admin.listarOrdenados());
});