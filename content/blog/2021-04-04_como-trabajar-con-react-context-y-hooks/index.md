---
slug: 2021/04/04/como-trabajar-con-react-context-y-hooks
title: "Cómo trabajar con React Context y Hooks"
date: 2021-04-04T09:07:02.000-08:00
description: "Esta mañana, leía la fechas de lanzamientos de algunas librerías de desarrollo de software que hoy damos sentadas. React, por ejemplo, se lanzó el 29 de mayo del año 2013. En estos casi 10 años, hemos visto la evolución de este ecosistema. Hoy, te mostraré cómo hacer uso de una de las características más útiles de este popular Framework: el contexto."
coverCaption: Photo by [Ferenc Almasi](https://unsplash.com/ko/@flowforfrank?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/tvHtIGbbjMo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
keywords: ["react","español","react context","cómo usar react context","user","blog","hooks","reemplazar redux","reemplazar redux con context","dejar de usar redux","redux","reducer","global state","estado global"]
tags: ["react","redux","javascript","react context"]
---

{{< param "description" >}}

## Antes de empezar

Estoy asumiendo que:

- Haz trabajado con *React*.
- Haz utilizado *Hooks*.
- Haz trabajado con librerías como *Redux*.

Si no, no importa. Igual quédate, de una forma u otra debes dar el primer paso.

## Ok, React Context

In a nutshell, *React Context* nos permite compartir el _State_ de nuestra aplicación a través del árbol de componentes sin tener que explicítamente *enviar* o *recibir* propiedades entre sí.

Veamos el siguiente ejemplo en el archivo `App.js`, un carrito de compras:

```jsx {linenos=inline,hl_lines=[7, 12, 25, 36]}
import React from "react";
import { Container, Row, Col, Form } from "reactstrap";

export default function App() {
  const [cart] = React.useState([{ name: `iPad` }, { name: `OnePlus 9` }]);
  const [user] = React.useState({ name: `Mario` });
  /* En nuestra App, aquí tenemos el origen de datos */
  return <Layout cart={cart} user={user} />;
}

function Layout({ cart, user }) {
  /* Construímos el esqueleto de la interfaz */
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
  /* Aquí consumimos a user, pero no a cart */
  return (
    <Form>
      <h1>Carrito de {user.name}</h1>
      <CartList cart={cart} />
      <button type="submit">Buy</button>
    </Form>
  );
}

function CartList({ cart }) {
  /* Finalmente consumimos a cart */
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

Seguro notaste como los *States* ***user*** y ***cart*** tienen que *enviados* y *recibidos* por todos los componentes del árbol para llegar a esos dónde realmente serán utilizados. Creéme cuando te digo que esto puede complicarse aún más.

Sería de mucha ayuda poder acceder a ellos justo dónde los necesitemos.

## Provider, Consumer, useReducer y useContext

Ya que el título de esta sección me dio tu atención, vamos a introducir unos cuantos conceptos:

- ***Provider***: Como su nombre lo sugiere (proveedor en español), es el componente que proveerá los datos a *todos* sus componentes hijos. Es aquí dónde el *State* vivirá.

- ***Consumer***: Con él, cada nodo (o componente) puede acceder al *State* que vive en el *Provider*.

Estos dos conceptos son fundamentales para entender lo qué sucede al implementar React Context en tu aplicación. Sin embargo, el título de este artículo tiene un "y Hooks" al final. Así que también debemos explicar lo siguiente:

- ***useReducer***: Si has utilizado *Redux*, ya conoces el próposito de un *reducer*. Es una función que recibe dos parametros, el *state* actual y una _action_. Con estos dos párametros, podemos organizar la forma en cómo el *State* será actualizado reduciendo las actualizaciones a casos. Los utilizaremos aquí junto con *useContext*.

- ***useContext***: In a nutshell, este Hook actúa como un *Consumer*.

## Ah sí, el Context

Lo siguiente en nuestra lista es:

- Configurar un Contexto
- Establecer una forma de actualizar el Context
- Consumir el Contexto

Para eso, necesitamos el siguiente script, `context.js`. Encontrarás comentarios explícativos.

```jsx {linenos=inline,hl_lines=["22-26", "38-43", "56-60", 71]}
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

/* Exportamos */
export { Provider, useConsumer };
```

En el script anterior, nos encontramos con 3 funciones importantes.

- ***Provider***: Más que una función, un tipo. Para ser más específicos, un componente de React. Este componente proveerá el _State_ global.

- ***useConsumer***: Más que una función, un custom Hook. Con él, consumiremos el *State* en los hijos del componente `<Provider />`.

- ***reducer***: Nuestra función ***reducer***. Con ella, organizaremos cómo actualizaremos nuestro *State*.

Por último, exportamos únicamente lo que usaremos en los componentes dónde necesitemos el *State*. En nuestro script `App.js`.

```jsx {linenos=inline,hl_lines=[1,"5-7"],linenostart=24}
function CartForm({ cart, user }) {
  /* Aquí consumimos a user, pero no a cart */
  return (
    <Form>
      <h1>Carrito de {user.name}</h1>
      <CartList cart={cart} />
      <button type="submit">Buy</button>
    </Form>
  );
}
```
```jsx {linenos=inline,hl_lines=[1, 3, "5-7", "12-14"],linenostart=24}
function CartForm()) {

  const [state, dispatch] = useConsumer();

  function removeItem(index) {
    dispatch({ type: `REMOVE_ITEM`, data: { index } });
  }

  /* Aquí consumimos a user, pero no a cart */
  return (
    <Form>
      <h1>Carrito de {state.user.name}</h1>
      <CartList cart={state.cart} removeItem={removeItem} />
      <Button type="submit" onClick={() => alert(`Thank you!`)}>Buy</Button>
    </Form>
  );
}
```

En este ejemplo, `<CartForm>` es el componente desde el cuál accedimos al contexto utilizando nuestro *Consumer* `useConsumer`. En él, programamos lógica para poder ejecutar acciones como remover un *item* de la lista del carrito. En el archivo `App.js`:

```jsx {linenos=inline,hl_lines=[1,7],linenostart=42}
function CartList({ cart }) {
  /* Finalmente consumimos a cart */
  return (
    <div className={`p-2`}>
      {cart.map((item, index) => (
        <div key={index}>
          <span style={{ color: `red`, cursor: `pointer` }}>[x]</span>
          <span className={`mx-1`} />
```
```jsx {linenos=inline,hl_lines=[1,7],linenostart=42}
function CartList({ cart, removeItem }) {
  /* Finalmente consumimos a cart */
  return (
    <div className={`p-2`}>
      {cart.map((item, index) => (
        <div key={index}>
          <span style={{ color: `red`, cursor: `pointer` }} onClick={() => removeItem(index)}>[x]</span>
          <span className={`mx-1`} />
```

Te preguntarás, ¿Por qué consumir el *State* únicamente en el componente `<CartForm />` y no también en `<CartList>`? La respuesta es simple. El *React Context* es una herramienta muy poderosa, pero no significa que debamos usarla para todo.

En nuestro ejemplo, es más importante mantener el componente `<CartList>` reusable, de esta forma, si tenemos que renderizar la lista en otro lado, no dependeremos del contexto que creamos aquí.

<!-- 
Puedes ver la Aplicación resultante abajo:

<iframe src="https://codesandbox.io/embed/boring-pasteur-gx6vs?fontsize=14&hidenavigation=1&moduleview=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="boring-pasteur-gx6vs"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe> -->

## No hay una solución milagrosa

Espero te haya sido de utilidad este Post. Seguramente verás como más y más proyectos utilizan las APIs nativas de React para manejar varibles globales, en lugar de instalar librerías de terceros.

Únicamente ten en cuenta que estás son meramente herramientas, y no hay una sola que sea perfecta para cada caso de uso. En el ejemplo, tomamos la decisión de dejar el componente presentacional `<CartList>` independiente para poder usarlo en otros contextos sin problemas.

## Referencias

- [Context](https://reactjs.org/docs/context.html)
- [How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)
