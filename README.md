## Descripción del proyecto

ZeldaTracker es una aplicación web que permite buscar información sobre el universo de _The Legend of Zelda_ usando la **Zelda Fan API**. Los usuarios pueden explorar juegos, personajes, mazmorras, jefes, lugares y objetos, guardar sus elementos favoritos en una base de datos en la nube, y visualizar un catálogo local de juegos con opción de descarga.

La aplicación está pensada para fans de la saga que quieran organizar su contenido favorito y acceder rápidamente a descripciones, fechas de lanzamiento, razas, géneros, etc.

---

## Tecnologías y herramientas

| Herramienta                                           | Uso en el proyecto                               |
| ----------------------------------------------------- | ------------------------------------------------ |
| HTML/CSS/JS                                           | Estructura, estilo y lógica principal            |
| **xml2js**                                            | Conversión de XML a JSON (juegos)                |
| **PapaParse**                                         | Conversión de JSON a CSV (descarga del catálogo) |
| Firebase Firestore                                    | Almacenamiento de favoritos en la nube           |
| LocalStorage                                          | Caché temporal de búsquedas                      |
| Zelda Fan API                                         | Fuente de datos principal                        |
| https://www.jsonschemavalidator.net/                  | Validador JSON Schema online                     |
| https://wwwc.freeformatter.com/xml-validator-xsd.html | Validador XML-XSD online                         |

### ¿Por qué xml2js y PapaParse?

- **xml2js**: El archivo `juegos.xml` está en formato XML porque es un formato común en sistemas legacy o en intercambios de datos estructurados. Necesitaba convertirlo a JSON para poder manipularlo fácilmente en el frontend sin tener que parsear XML manualmente. Alternativas como `fast-xml-parser` serían más rápidas, pero `xml2js` es más sencillo de usar y tiene buena documentación.

- **PapaParse**: Lo usé para generar un archivo CSV descargable desde el JSON del catálogo. CSV es ideal para que los usuarios puedan abrir los datos en Excel o Google Sheets sin necesidad de programación. Alternativas como `csv-writer` serían más pesadas y están pensadas para Node.js del lado del servidor, mientras que PapaParse funciona perfectamente en el build script.

---

## 🌐 La Zelda API

La Zelda API es una API REST (Interfaz de Programación de Aplicaciones), las cuales permiten a distintas aplicaciones comunicarse entre sí. En el caso de esta API, tenemos varias categorias representadas con su endpoint, donde podemos extraer datos de juegos, enemigos, etc... de la saga Zelda. Aquí es donde entra función fetch de JS (nos permite mandar peticiones HTTP asincronas) y desde esta podemos mandar un HTTP/GET a esos endpoints y obtener el JSON con los datos que queremos. (Tambien podriamos mandar otro tipo de peticiones como POST pero GET es la relevante para el proyecto)

**Endpoints utilizados:**  
`https://zelda.fanapis.com/api/{categoría}?name={búsqueda}`

**Categorías disponibles:**  
`games`, `characters`, `dungeons`, `monsters` `bosses`, `places`, `items`
(El único que no he incluido es staff porque he considerado que los desarrolladores se salian un poco de la temática)

### Ejemplo de respuesta real (GET /api/characters?name=link)

```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "data": [
    {
      "id": "5f6f9b3c9b3c9b3c9b3c9b3c",
      "name": "Link",
      "description": "The Hero of Hyrule, chosen by the Master Sword.",
      "gender": "Male",
      "race": "Hylian"
    }
  ]
}
```

**Campos que extraigo en cada categoría:**

| Categoría  | Campos usados                    |
| ---------- | -------------------------------- |
| games      | name, description, released_date |
| characters | name, description, gender, race  |
| dungeons   | name, description                |
| bosses     | name, description                |
| places     | name, description                |
| items      | name, description                |

**Integración:**

- Llamada asíncrona con `fetch`.
- Cacheo en `localStorage` para evitar repetir peticiones.
- Manejo de errores mostrando un mensaje visual.

---

## Formatos de datos

### JSON (JavaScript Object Notation)

Formato ligero de intercambio de datos, fácil de leer y escribir para humanos y máquinas, similar a un objeto de JS  
➜ En el proyecto lo uso para almacenar la caché de la API y para el catálogo de juegos (`juegos.json`).

### XML (eXtensible Markup Language)

Formato más verboso y formado por etiquetas que permite definir estructuras complejas con atributos y validación vía XSD.  
➜ Lo recibo en `juegos.xml` porque es el formato original del proveedor de datos.

### CSV (Comma-Separated Values)

Formato tabular separado por comas muy simple, ideal para hojas de cálculo.  
➜ Lo genero para que el usuario pueda descargar el catálogo y abrirlo en Excel o Google Sheets.

---

## Esquemas

### JSON Schema (para validar el formato general de la zelda api)

Los JSON Schemas son los arcivos que marcan el formato esperado de un JSON
El que uso valida que cada juego tenga:

- `success` (boolean)
- `count` (number)
- `data` (Array de objetos)
  - `id` (string)
- `description` (string)
- `name` (string)
  Todos los campos son required porque todos estos son los campos minimos de cualquier endpoint de la zeldaAPI. He incluido additionalProperties: true para que todos los endpoints sean válidos aun teniendo campos extra

**Evidencia de validación:**  

<img width="1925" height="1105" alt="Captura de pantalla_20260426_151549" src="https://github.com/user-attachments/assets/16996d55-782e-4811-a8b3-af7965892a29" />


### XSD (para `juegos.xml`)

Los XSD son los archivos que marcan el formato esperado para el XML al que se enlazan
El que uso valida la estructura del XML predeterminado del proyecto:

- Elemento raíz `<saga>`
- Uno o más `<juego>` con atributo `id`
- Hijos obligatorios: `<titulo>`, `<desarrolladora>`, etc.
- Tipos de datos: números para `<anio>` y `<puntuacion>`

**Evidencia de validación:**  

<img width="1925" height="1150" alt="Captura de pantalla_20260426_151815" src="https://github.com/user-attachments/assets/1346e712-7a4f-430e-b30c-c37b4cda6978" />

---

## Almacenamiento

### ¿Por qué `localStorage` para caché y Firestore para favoritos?

- **localStorage** → Ideal para caché porque es síncrono, muy rápido y no requiere red. Almaceno temporalmente las búsquedas para evitar repetir llamadas a la API.
- **Firestore** → Los favoritos deben persistir entre dispositivos y sesiones, y permitir operaciones complejas (filtros, ordenación, borrados). Firestore ofrece sincronización en tiempo real y seguridad mediante reglas.

### Limitaciones de localStorage para favoritos

- Tamaño máximo ~5-10 MB por dominio.
- No compartido entre dispositivos.
- Datos en texto plano (no seguros).
- No permite consultas ni índices.

### Reglas de seguridad de Firestore en producción

Ejemplo básico (solo lectura/escritura para usuarios autenticados):

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /favorites/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

En producción deberías añadir validaciones de datos y límites de documentos por usuario.

### Alternativas de almacenamiento

Las alternativas a FireStore como tal serían otros clientes de BD como:

| Alternativa           | Cuándo usarla                                          |
| --------------------- | ------------------------------------------------------ |
| IndexedDB             | Grandes volúmenes de datos offline (ej. mapas, audios) |
| SQLite (WebAssembly)  | Necesitas SQL real y relaciones complejas              |
| MongoDB Realm         | Aplicación mobile-first con sincronización avanzada    |
| PostgreSQL + REST API | Aplicación con backend propio y escalabilidad          |

---

## Decisiones técnicas

### 1. Comodidad en el desarrollo (librerías conversión + innerHTML)

**Justificación** Por simple comodidad a la hora de crear las tarjetas, he usado innerHTML en lugar de crearlas con `createElement()` y derivados. Aunque en otros casos está decision podría verse como mala práctica, al no trabajar con inputs del usuario directamente, si no que formo la tarjeta con los datos de la API, pienso que es una decisión correcta ya que agilizo el desarrollo y no tengo posibilidad de inyección de código, ya que como he dicho no trabajo el input del usuario directamente. Lo mismo para la conversión de archivos, he usado `PapaParser`y `xml2js` por ser alternativas más directas y robustas que el DOMParser, además de que así separo responsabilidad entre frontend (JS del navegador) y backend (NodeJS)

### 2. Separar la carga de favoritos en una función independiente (`loadFavorites`)

**Justificación:** Los favoritos se muestran en una página distinta y necesitan lógica específica (filtros, ordenación, borrado). Separarla del resto de la UI mejora la mantenibilidad y permite que cada página cargue solo lo que necesita, optimizando el rendimiento.

---

### Requisitos previos

- Node.js instalado (para ejecutar el script de transformación de datos)

### Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto (ej. `zelda-tracker`)
3. Habilita **Firestore Database** en modo de prueba (para desarrollo)

### Uso básico

- En **Inicio**: escribe en el buscador y selecciona categorías. Los resultados se cachean automáticamente.
- Para guardar favoritos: haz clic en "Añadir a Favoritos" en cualquier carta.
- En **Favoritos**: filtra y ordena tus elementos guardados.
- En **Catálogo**: explora los juegos y descarga la lista en CSV.

---

## Notas adicionales

- El modal de confirmación aparece antes de borrar favoritos para evitar eliminaciones accidentales.
- Los filtros en favoritos solo ocultan visualmente los elementos (no borran nada).
