Proyecto que consume API pública y utiliza XMLHttpRequest para crear las peticiones. Esta práctica es antigua, se recomienda el uso de fetch que permite el uso de promesas para un flujo asincrónico. Además de que optimiza y facilita el manejo de errores.

El estándar de Fetch API se incluyó en los navegadores en el año 2015. Llegó junto con las especificaciones de ES6 (ECMAScript 2015) para modernizar y reemplazar el uso de XMLHttpRequest

Apunte de Diferencias:

* **XMLHttpRequest** gestiona peticiones mediante eventos manuales (`onload`, `onerror`) y funciones callback anidadas que dificultan el mantenimiento.
* **Fetch API** utiliza promesas que permiten encadenar métodos de forma limpia (`.then()`, `.catch()`) y evitar la estructura del *callback hell*.
* **XHR** procesa las respuestas como texto plano que requiere parseo manual, mientras que **Fetch** resuelve de forma nativa promesas con formato JSON.
* **Fetch** permite integrar `async/await`, transformando el flujo asincrónico para que se lea y comporte igual que el código sincrónico tradicional.
* **XHR** maneja errores de red mediante eventos separados, mientras que **Fetch** unifica todo el flujo de errores dentro de un único bloque de captura.