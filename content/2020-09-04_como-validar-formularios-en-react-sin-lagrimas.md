---
author: "Mario Menjívar"
slug: "como-validar-formularios-en-react-sin-lagrimas"
title: "Cómo validar formularios en React, sin lágrimas"
timestamp: "2020-09-04T07:08:02.000-07:00"
brief: "Históricamente, validar un formulario en React requiere de una cantidad impresionante de boilerplate que añade complejidad innecesaria. Veamos cómo librarnos de eso."
keywords: "formik,español,react,cómo,validar formularios react,binaria,blog"
cover: "https://imgur.com/wm6iA0l.png"
---

# Cómo validar formularios en React, sin lágrimas

Todos los desarrolladores de software que trabajamos con React, absolutamente todos, hemos tenido ese tedioso ticket para crear y/o validar un formulario. Afortunadamente para ti, hoy te mostraré la forma más sencilla de cerrarlo: Formik.

## Formik what?

[Formik](https://formik.org/docs/overview) es uno de los paquetes de software de código abierto más útiles que podemos encontrar en el repositorio de `npm` (o `yarn`, como gustes). En palabras de uno de sus creadores, [@JaredPalmer](https://twitter.com/jaredpalmer):

> "Admítamoslo, los formularios requiren de muchísimo código en React. Para poner las cosas peor, la mayoría de utilidades para construirlos hacen muchísima, demasiada magia que frecuentemente trae un costo al desempeño" de [Formik Docs](https://formik.org/docs/overview)

Para Jared y compañía había un beneficio en estandarizar los componentes de entrada y cómo los datos fluían a través del Form. Es la razón de ser de Formik.

## Preparando el ejemplo

Para ser prácticos, vamos a hacer uso del famosísimo toolchain `create-react-app`. Ve a tu línea de comandos y ejecuta:

```bash
$ npx create-react-app formik-sample
$ cd formik-sample
$ npm start
```

![React App by create-react-app](https://imgur.com/8tQZ4qO.png)

Ahora tenemos la base para trabajar nuestra aplicación React, pero necesitamos un form al cuál validar, para eso instalaremos el siguiente paquete:

```bash
$ npm install bootstrap reactstrap --save
```

Este paquete componetiza la mayoría de utilidades del popular framework CSS Bootstrap, lo cuál acelera nuestra habilidad de construir el layout del formulario. Una vez completa la instalación, copia y pega este código en tu archivo `src/App.js`:

```javascript
// src/App.js

import React from "react";
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardHeader,
  FormFeedback,
} from "reactstrap";

function Formulario() {
  return (
    <Container className="p-5">
      <Card>
        <CardHeader></CardHeader>
        <CardBody>
          <Form>
            <h1>Form</h1>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" name="name" placeholder="Woody Allen" />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="contoso@domain.com"
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Provide a password"
              />
            </FormGroup>
            <FormGroup>
              <Label for="bio">Text Area</Label>
              <Input type="textarea" name="bio" />
            </FormGroup>

            <Button type="submit">Submit</Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default Formulario;
```

También, añade está línea en el archivo `src/index.js`:

```javascript
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'; // Importa bootstrap a la React App
// ...
```

Deberías ver un formulario similar al de la imagen:

![Form built with reactstrap](https://imgur.com/6NWfclG.png)

Continuemos.

## Formik

Llegados a este punto, ya estamos listos para ver la magia de Formik.

```bash
$ npm install formik --save
```

Ya que la instalación haya finalizado, vamos a hacer unas modificaciones a nuestro código en `src/App.js`.

```javascript
// src/App.js

import React from "react";
import { Formik } from "formik"; // Importamos el component <Formik />
import {
  Container,
// ...
```

Este componente debe encapsular a nuestro formulario, cómo se muestra abajo. Formik se mantiene al tanto del estado del formulario y te provee valores, métodos reusables y manejadores de eventos a través de `props`.

Además, Formik sigue una regla básica para simplificar el proceso de validación. Para que la librería puede relacionar un `initialValues` a un `<Input>` específico, tanto la propiedad como el `name` de `<Input>` deben tener el mismo nombre. En el ejemplo de abajo, hemos definido 5 controles: `name`, `email`, `password`, `bio`, and `multiple`.

Aunque no debemos olvidar que estamos en React, por lo qué debemos manejar el cambio de los valores de los controles. Esto lo logramos con los manejadores provistos por Formik: `handleChange` y `handleBlur`. Sin olvidar que debemos renderizar el valor adecuado en el control, para eso haremos uso de la propiedad `values`.

Aparte de las útiles `props` provistas por Formik, también el tag en sí mismo necesita de ciertas propiedades para funcionar:

- `initialValues`: Le dice a Formik de cuales valores debe mantenerse al tanto y buscar sus respectivos controles en el formulario.
- `validate`: Esta función recibe como parametro los `values` de los cuáles la librería está al tanto para ser validados.
- `onSubmit`: Quizá la función que más te interese de la librería. Es aquí dónde definimos que debe suceder si nuestro formulario ha sido validado con éxito. Por ejemplo, postear los valores a un servicio del backend.

Ya qué hemos cubierto una breve explicación, es hora de ver todo esto en código.

```javascript
// src/App.js

// ...
function Formulario() {
  return (
    <Container className="p-5">
      <Card>
        <CardHeader></CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              bio: "",
            }}
            validate={(values) => {
              const errors = {};

              // We need a name
              if (!values.name) errors.name = "Required";

              // We need a valid e-mail
              if (!values.email) errors.email = "Required";
              else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
                errors.email = "Invalid email address";

              // We need a valid password
              if (!values.password) errors.password = "Required";
              else if (`${values.password}`.length < 7)
                errors.password =
                  "Password must be larger than 7 characters";

              console.log({ values, errors });

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));

                setSubmitting(false);
              }, 250);
            }}
          >
            {(props) => {
              const {
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* y otras más */
              } = props;
              return (
                <Form onSubmit={handleSubmit}>
                  <h1>Form</h1>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Woody Allen"
                      invalid={errors.name && touched.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="contoso@domain.com"
                      invalid={errors.email && touched.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Provide a password"
                      invalid={errors.password && touched.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <FormFeedback>{errors.password}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="bio">Text Area</Label>
                    <Input
                      type="textarea"
                      name="bio"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                  </FormGroup>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? `Loading` : `Submit`}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </Container>
  );
}
// ...
```

El código de arriba nos permite validar el nombre, e-mail y contraseña en nuestro formulario. Al hacer clic en `Submit`, sin completar un solo `<Input>`, deberías ver algo similar a esto:

![Formulario validado](https://imgur.com/IIVx4c9.png)

Listo, ya hemos validado el formulario. Lo único que nos queda es definir el manejador `onSubmit` en el tag `Formik` y tendremos la certeza de qué si nuestro programa ejecuta ese `callback` se debe a que nuestros datos han sido previamente validados.

## Podemos hacerlo mejor

Seguramente tienes alguna de estas preguntas en tu cabeza: ¿Por qué repetir la asignación de `handleChange` y `handleBlur`? y ¿Por qué validar _manualmente_ cada propiedad paso a paso?. Creéme, yo también me hice esas preguntas.

Para fortuna de quién tenga que mantener este formulario, hay una forma más sencilla de definir las validación y los controles de estado.

### Formik Field

Para reducir el número de veces que repetimos la asignación de los manejadores de eventos, vamos a importar otro elemento de la librería Formik.

```javascript
// src/App.js

// ...
import { Formik, Field } from "formik"; // Importamos el component <Field />
// ...
```

Este componente nos permite ahorrarnos la asignación de manejadores y valor directamente al componente. Lo único que debemos hacer, y ya que estamos usando `reacstrap`, es asignarlo a la propiedad `tag` de cada elemento `<Input>`. Formik se encargará del resto.

```javascript
<Input
  type="text"
  name="name"
  placeholder="Woody Allen"
  invalid={errors.name && touched.name}
- onChange={handleChange}
- onBlur={handleBlur}
- value={values.name}
+ tag={Field}
/>
```

Es imprescindible que la propiedad `name` del `<Input>` tenga el mismo nombre a una propiedad en `initialValues`.

### Formik + Yup

[`Yup`](https://github.com/jquense/yup) es una librería que nos permite construir esquemas de conversión y validación. El punto más fuerte de `Yup` es el nível de expresividad que las validaciones pueden alcanzar, sencillas o complejas.

De acuerdo a la [documentación](https://formik.org/docs/guides/validation#validationschema) de `Formik`, `Yup` es un ciudadano de primera clase en la librería por lo que posee una `prop` especial en el elemento `<Formik>` llamada `validationSchema`.

```bash
$ npm install yup --save
```

Una vez instalamos `Yup`, debemos importarlo:

```javascript
// src/App.js

// ...
import * as Yup from "yup"; // Importando Yup
import {
  Container,
// ...
```

Regresemos al código del componente `Formulario`. Justo en la propiedades del elmento `<Formik>` vamos a eliminar la propiedad `validate` y en su lugar asignaremos la propiedad `validationSchema`.

```javascript
<Formik
  initialValues={{
    name: "",
    email: "",
    password: "",
    bio: "",
  }}
  validationSchema={Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8, "Password is too short").required("Required"),
  })}
  onSubmit={(values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));

      setSubmitting(false);
    }, 250);
  }}
>
```

Por último, podemos llenar nuestro formulario y ver que una vez validado, el `callback` en la propiedad `onSubmit` del elemento `<Formik>` es ejecutada.

![Formulario completo](https://imgur.com/wm6iA0l.png)

## Conclusión

Espero este post te sea de mucha ayuda. En mi experiencia con React, Formik ha facilitado el trabajo con lo que a validar formularios se refiere al proveerme de métodos que me permiten ajustar el a cada momento los valores y las validación que necesito. La expresividad del código es de gran valor ya que permite escalar y/o mantener de una forma sencilla sin reinventar la rueda para cada formulario.

## Referencias

- [Formik documentation](https://formik.org/docs/overview)