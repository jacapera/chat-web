# useRef

#### En React, el hook `useRef` se utiliza para mantener referencias a elementos del DOM o para mantener valores persistentes en componentes funcionales. A diferencia de las variables de estado (`useState`), las referencias creadas con `useRef` no provocan una actualización del componente cuando cambian su valor. Esto hace que `useRef` sea una buena opción para almacenar datos que no afectan directamente a la representación visual del componente.

# bcryptjs.genSaltSync() / bcryptjs.hash()
#### La principal diferencia entre `bcryptjs.genSaltSync()` y `bcryptjs.hash()` radica en su funcionalidad y en si son funciones síncronas o asíncronas.

- #### *`bcryptjs.genSaltSync()`*: Es una función síncrona que se utiliza para generar un "salt" o "sal" aleatorio. Como es síncrona, bloquea la ejecución del código hasta que se genera el salt. Acepta un parámetro opcional para especificar el número de rondas de encriptación (work factor) que se utilizarán para generar el salt.

- #### *`bcryptjs.hash()`*`: Es una función asíncrona que se utiliza para realizar el hash de una contraseña utilizando un salt. A diferencia de genSaltSync(), esta función no genera el salt por sí misma, sino que espera que se le pase un salt pregenerado como argumento. Por lo tanto, primero se debe generar el salt (por ejemplo, con bcryptjs.genSalt() o bcryptjs.genSaltSync()) y luego se utiliza ese salt para realizar el hash de la contraseña.

Si tu aplicación tiene el potencial de crecer mucho en el futuro, te recomendaría utilizar bcryptjs.hash() en lugar de bcryptjs.genSaltSync() por las siguientes razones:

`Eficiencia y escalabilidad:` bcryptjs.hash() es una función asíncrona que utiliza un salt pregenerado. Al ser asíncrona, no bloquea la ejecución del código mientras realiza el hash, lo que es especialmente importante en aplicaciones que podrían recibir muchas solicitudes simultáneas. Al ser más eficiente, contribuirá a una mejor escalabilidad de tu aplicación, permitiendo que responda rápidamente a las solicitudes de los usuarios.

`Mayor seguridad:` Al utilizar bcryptjs.hash(), puedes generar un salt con un mayor número de rondas de encriptación (work factor), lo que aumenta la seguridad del hash. Un mayor número de rondas hace que sea más costoso y lento para los atacantes intentar romper el hash utilizando ataques de fuerza bruta o diccionario.

`Buena práctica actual`: La tendencia actual en el desarrollo de aplicaciones web es utilizar funciones asíncronas y evitar bloquear el hilo principal del servidor. Además, las funciones asíncronas permiten aprovechar las ventajas de Node.js, que es especialmente adecuado para aplicaciones de alto rendimiento y escalabilidad.

En resumen, aunque bcryptjs.genSaltSync() también es una opción válida y segura, si tu aplicación tiene el potencial de crecer mucho en el futuro, te recomendaría utilizar bcryptjs.hash() con un salt pregenerado para obtener un mejor rendimiento y seguridad.

# new FormData()
`new FormData()` es una función constructora proporcionada por el estándar de JavaScript para crear objetos FormData. FormData es una interfaz en la API Fetch que permite construir fácilmente datos de formulario para enviar en solicitudes HTTP.

Cuando deseas enviar datos como un formulario desde el cliente al servidor a través de una solicitud HTTP, puedes utilizar el objeto FormData para organizar y estructurar esos datos en un formato adecuado. Esto es especialmente útil cuando necesitas enviar archivos, como imágenes, a través de una solicitud POST o PUT.

Puedes crear un nuevo objeto FormData utilizando el constructor FormData(), y luego puedes agregar campos y valores al FormData utilizando el método append(). El método append() acepta dos argumentos: el nombre del campo y su valor.

Es importante tener en cuenta que FormData se utiliza principalmente para enviar datos estructurados como formularios HTML y archivos. Si solo necesitas enviar datos JSON simples, no es necesario utilizar FormData; en cambio, puedes pasar los datos directamente en el cuerpo (body) de la solicitud en formato JSON utilizando axios.post() o fetch().

# jwt.verify y jwt.decode

# Redux-Toolking
Dentro de las funciones reductoras en Redux Toolkit, no se recomienda realizar directamente peticiones HTTP o cualquier tipo de operación asíncrona, como llamadas a APIs externas o solicitudes a servidores. Las funciones reductoras están destinadas a ser puras y sincrónicas, lo que significa que deben ser funciones que toman un estado y una acción y devuelven un nuevo estado sin tener efectos secundarios externos.

Realizar peticiones HTTP dentro de una función reductora podría llevar a efectos no deseados, como bloquear la ejecución del reductor o causar problemas de rendimiento en la aplicación.

Para manejar peticiones HTTP en Redux, lo más común es utilizar middleware, como "redux-thunk" o "redux-saga". Estos middleware permiten realizar operaciones asíncronas, como peticiones HTTP, y luego despachar acciones con los resultados de esas operaciones.

Ejemplo utilizando "redux-thunk":
bash
Copy code
npm install redux-thunk
javascript
Copy code
// store.js
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: [thunkMiddleware],
});

export default store;
javascript
Copy code
// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: "",
  userName: "",
  image: "",
  access: false,
  rol: "",
  allUsers: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user_id, userName, image, access, rol } = action.payload;
      state.user_id = user_id;
      state.userName = userName;
      state.image = image;
      state.access = access;
      state.rol = rol;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    }
  }
});

export const { setUser, setAllUsers } = userSlice.actions;
export default userSlice.reducer;

// Función asíncrona utilizando redux-thunk
export const fetchAllUsers = () => async (dispatch) => {
  try {
    const response = await fetch('https://api.example.com/users');
    const data = await response.json();
    dispatch(setAllUsers(data));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
En este ejemplo, hemos utilizado "redux-thunk" para definir una función asíncrona fetchAllUsers que realiza una solicitud HTTP a la API para obtener los usuarios y luego despacha la acción setAllUsers con los datos recibidos desde el servidor.

Recuerda que el middleware "redux-thunk" se encargará de manejar la función asíncrona y permitirá que las acciones puedan ser funciones, en lugar de objetos simples, lo que habilita la realización de operaciones asíncronas dentro de ellas.


# Modelo de Chat base de datos

#### Relaciones para chat uno a uno:

- Un usuario (User) puede tener muchos chats enviados (ChatsSent), y cada chat enviado tiene un usuario como receptor (UserReceived).
- Un usuario (User) también puede tener muchos chats recibidos (ChatsReceived), y cada chat recibido tiene un usuario como remitente (UserSent).
- Cada chat (Chat) puede tener muchos mensajes (Message), y cada mensaje pertenece a un chat específico (chat_id).

#### Relaciones para chat grupal:

- Un usuario (User) puede estar asociado a muchos chats grupales (GroupChats), y cada chat grupal tiene varios usuarios como participantes (Participants).
- Cada chat grupal (GroupChat) puede tener muchos mensajes (Message), y cada mensaje pertenece a un chat grupal específico (chat_id).