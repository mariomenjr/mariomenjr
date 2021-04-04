---
author: "Mario Menjívar"
slug: "como-trabajar-con-react-context-y-hooks"
title: "Cómo trabajar con React Context y Hooks"
timestamp: "2021-04-04T09:07:02.000-08:00"
brief: "Esta mañana, por curiosidad, leía la fechas de lanzamientos de algunas de las herramientas que hoy damos por hecho. React, por ejemplo, fue lanzado el 29 de mayo del año 2013. En estos casi 10 años, hemos visto la evolución de este ecosistema, desde _Class Components_ a _Hooks_. Hoy, te mostraré cómo hacer uso de una de las últimas características añadidas a este popular Framework: el contexto."
keywords: "react,español,context,cómo usar react context,user,blog,hooks,reemplazar redux,dejar de usar redux,redux,reducer,state"
cover: "https://imgur.com/5ZmbSG2.png"
---

# Cómo trabajar con React Context y Hooks

Esta mañana, por curiosidad, leía la fechas de lanzamientos de algunas de las herramientas que hoy damos por hecho. React, por ejemplo, fue lanzado el 29 de mayo del año 2013. En estos casi 10 años, hemos visto la evolución de este ecosistema, desde _Class Components_ a _Hooks_. Hoy, te mostraré cómo hacer uso de una de las últimas características añadidas a este popular Framework: el contexto.

## Hold on

Para ser prácticos, estoy asumiendo que:

- Ya conoces cómo funcionan los _Hooks_.
- Ya haz trabajado con librerías de Estado global (por ejemplo, _Redux_).

Si este no es tu caso, igual quédate. Nos vamos a divertir.

## Ok, React Context

_In a nutshell_, _React Context_ nos permite compartir el _State_ de nuestra aplicación a través del árbol de componentes sin tener que _pasar_ las propiedades explicítamente por cada uno de ellos. Pero... ¿Por qué querríamos acceder a las propiedades sin tener que pasarlas explícitamente?

Veamos el siguiente ejemplo, un carrito de compras:

```jsx
// App.js

import React from "react";
import { Container, Row, Col, Form } from "reactstrap";

export default function App() {
  const [cart] = React.useState([{ name: `iPad` }, { name: `OnePlus 9` }]);
  const [user] = React.useState({ name: `Mario` });
  /*
   * En nuestra App, aquí tenemos el origen de datos
   */
  return <Layout cart={cart} user={user} />;
}

function Layout({ cart, user }) {
  /*
   * Construímos el esqueleto de la interfaz
   */
  return (
    <Container>
      <Row>
        <Col>
          <CartForm cart={cart} user={user} />
        </Col>
      </Row>
    </Container>
  );
}

function CartForm({ cart, user }) {
  /*
   * Aquí consumimos a user, pero no a cart
   */
  return (
    <Form>
      <h1>Carrito de {user.name}</h1>
      <CartList cart={cart} />
      <button type="submit">Buy</button>
    </Form>
  );
}

function CartList({ cart }) {
  /*
   * Finalmente consumimos a cart
   */
  return (
    <div className={`p-2`}>
      {cart.map((item, index) => (
        <div key={index}>
          <span style={{ color: `red`, cursor: `pointer` }}>[x]</span>
          <span className={`mx-1`} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
```

Seguro notaste como los _States_ **_user_** y **_cart_** tienen que _pasar_ por todos los componentes del árbol para llegar a los componentes dónde realmente serán de utilidad. Creéme cuando te digo que esto puede complicarse aún más.

¿No sería más sencillo poder acceder a ellos justo dónde los necesitemos?

## Provider, Consumer, useReducer y useContext

Ya que tengo tu atención, vamos a introducir unos cuantos conceptos:

- **_Provider_**: Como su nombre lo sugiere (proveedor en español), es el componente que proveerá los datos a _todos_ sus componentes hijos. Es aquí dónde el _State_ vivirá.

- **_Consumer_**: Con él, cada nodo (o componente) que puede acceder al _State_ que vive en el _Provider_.

Estos dos conceptos son fundamentales para entender lo qué sucede al implementar React Context en tu aplicación. Sin embargo, el título de este artículo tiene un "y Hooks" al final. Así que debemos presentar los siguientes Hooks:

- **_useReducer_**: Si has utilizado _Redux_, ya conoces el próposito de un _reducer_. Es una función que recibe dos parametros, el _state_ actual y una _action_. Con estos dos párametros, podemos organizar la forma en cómo el _State_ será actualizado _reduciendo_ las actualizaciones a casos. Los utilizaremos aquí junto con _useContext_.

- **_useContext_**: _In a nutshell_, este Hook actúa como un _Consumer_.

## Ah sí, el Context

Lo siguiente en nuestra lista es:

- Configurar un Contexto
- Establece una forma de actualizar
- Consumirlo

Para eso, necesitamos el siguiente script. Encontrarás comentarios explícativos.

```jsx
// context.js

import React from "react";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case `REMOVE_ITEM`:
      const index = Number(action.data.index);
      return {
        ...state,
        cart: [...state.cart.slice(0, index), ...state.cart.slice(index + 1)],
      };

    default:
      return state;
  }
}

function Provider({ children }) {
  /*
   * Creamos un State usando el hook useReducer
   * De esta manera, obtenemos la habilidad de separar nuestra lógica
   * En acciones.
   *
   * Ver: https://es.reactjs.org/docs/hooks-reference.html#usereducer
   */
  const [state, dispatch] = React.useReducer(reducer, {
    user: { name: `Mario` },
    cart: [
      { name: `iPad Air` },
      { name: `OnePlus 9` },
      { name: `Thinpad X1 Carbo 9 Gen` },
    ],
  });

  /*
   * Establecemos 2 Providers
   * 1 para proveer el State
   * 1 para proveer la función Dispatch
   *
   * Esto es así, ya que la función Dispatch nunca cambiará
   * Por esta razón, la separamos del resto del State
   */
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useConsumer() {
  /*
   * Finalmente, hacemos uso del Hook useContext
   * para consumir el State que reside en cada Provider
   *
   * La razón por la que es un Array es para darle el formato
   * de un custom Hook.
   */
  return [
    React.useContext(StateContext),
    React.useContext(DispatchContext),
  ].map((ctx) => {
    if (ctx === undefined) throw new Error(`Provider not found`);
    return ctx;
  });
}

/*
 * Exportamos
 */
export { Provider, useConsumer };
```

En el script anterior, nos encontramos con 3 funciones importantes.

- **_Provider_**: Más que una función, un tipo. Para ser más específicos, un componente de React. Este componente proveerá el _State_ global.

- **_useConsumer_**: Más que una función, un custom Hook. Con él, consumiremos el _State_ en los hijos del componente `<Provider />`.

- **_reducer_**: Nuestra función **_reducer_**. Con ella, organizaremos cómo actualizaremos nuestro _State_.

Por último, exportamos únicamente lo que usaremos en los componentes dónde necesitemos el _State_. En nuestro script `App.js`.

```jsx
// App.js

// ...
- function CartForm({ cart, user }) {       // Removed
+ function CartForm()) {                    // Added

+  const [state, dispatch] = useConsumer();

+  function removeItem(index) {
+    dispatch({ type: `REMOVE_ITEM`, data: { index } });
+  }

  /*
   * Aquí consumimos a user, pero no a cart
   */
  return (
    <Form>
-     <h1>Carrito de {user.name}</h1>
+     <h1>Carrito de {state.user.name}</h1>

-     <CartList cart={state.cart} removeItem={removeItem} />
+     <CartList cart={state.cart} removeItem={removeItem} />

-     <Button type="submit">Buy</Button>
+     <Button type="submit" onClick={() => alert(`Thank you!`)}>Buy</Button>
    </Form>
  );
}
// ...
```

En este ejemplo, `<CartForm>` es el componente desde el cuál accedimos al contexto utilizando nuestro _Consumer_ `useConsumer`. En él, programamos lógica para poder ejecutar acciones como remover un _item_ de la lita del carrito.

```jsx
// App.js

// ...
- function CartList({ cart }) {             // Removed
+ function CartList({ cart, removeItem }) { // Added
  /*
   * Finalmente consumimos a cart
   */
  return (
    <div className={`p-2`}>
      {cart.map((item, index) => (
        <div key={index}>
-         <span style={{ color: `red`, cursor: `pointer` }}>[x]</span>
+         <span style={{ color: `red`, cursor: `pointer` }} onClick={() => removeItem(index)}>[x]</span>
          <span className={`mx-1`} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
// ...
```

Te preguntarás, ¿Por qué consumir el _State_ únicamente en el componente `<CartForm />` y no también en `<CartList>`? La respuesta es simple. El _React Context_ es una herramienta muy poderosa, pero no significa que debamos usarla para todo.

En nuestro ejemplo, es más importante mantener el componente `<CartList>` reusable, de esta forma, si tenemos que renderizar la lista en otro lado, no dependeremos del contexto que creamos aquí.

Puedes ver la Aplicación resultante abajo:

<iframe src="https://codesandbox.io/embed/boring-pasteur-gx6vs?fontsize=14&hidenavigation=1&moduleview=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="boring-pasteur-gx6vs"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

<br />

## Conclusión

Espero te haya sido de utilidad este Post. Seguramente verás como más y más proyectos utilizan las APIs nativas de React para manejar varibles globales, en lugar de instalar librerías de terceros.

Únicamente ten en cuenta que estás son meramente herramientas, y no hay una sola que sea perfecta para cada caso de uso. En el ejemplo, tomamos la decisión de dejar el componente presentacional `<CartList>` independiente para poder usarlo en otros contextos sin problemas.

## Referencias

- [Context](https://reactjs.org/docs/context.html)
- [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)
- [React Context Explained (2020)](https://www.youtube.com/watch?v=rFnfvhtrNbQ)
- [How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)