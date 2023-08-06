---
slug: 2020/09/04/como-validar-formularios-en-react-sin-lagrimas
title: "Cómo validar formularios en React, sin lágrimas"
date: 2020-09-04T07:08:02.000-07:00
description: "Cualquier desarrollador que haya trabajado con React ha tenido ese ticket fastidioso para validar un formulario. Afortunadamente para ti, hoy te mostraré la forma más sencilla de cerrarlo: Formik."
coverCaption: Photo by [Kelly Sikkema](https://unsplash.com/@kellysikkema?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/wDghq14BBa4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
keywords: ["formik","español","react","cómo","validar formulario react","formulario html","formulario react","validar formulario javascript","validar formulario"]
tags: ["formik", "react", "javascript"]
---

{{< param "description" >}}

## Formik what?

[Formik](https://formik.org/docs/overview) es uno de los paquetes de software de código abierto más útiles que podemos encontrar en el repositorio de `npm` (o `yarn`, como gustes). En palabras de uno de sus creadores:

> Admítamoslo, los formularios requiren de muchísimo código en React. Para poner las cosas peor, la mayoría de utilidades para construirlos hacen muchísima, demasiada magia que frecuentemente trae un costo al desempeño <br>
> — <cite>[@JaredPalmer](https://twitter.com/jaredpalmer)[^1]<cite>

[^1]: Esta cita es parte de la introducción escrita por Jared en el sitio [Formik Docs](https://formik.org/docs/overview).

Para Jared y compañía había un beneficio en estandarizar los componentes de entrada y cómo los datos fluían a través del Form. Es la razón de ser de Formik.

## Preparando el escenario

Haremos uso del famosísimo toolchain `create-react-app`. Ve a tu línea de comandos y ejecuta:

```bash
npx create-react-app formik-sample
cd formik-sample
npm start
```

![React App by create-react-app](https://imgur.com/8tQZ4qO.png)

Ya tenemos la base para trabajar nuestra aplicación React, pero necesitamos un form a validar. Para eso instalaremos el siguiente paquete:

```bash
npm install bootstrap reactstrap --save
```

Este paquete componetiza la mayoría de utilidades del popular framework CSS Bootstrap, lo cuál acelera nuestra habilidad de construir el layout del formulario. Una vez completa la instalación, copia y pega este código en tu archivo `src/App.js`:

```jsx {linenos=inline,hl_lines=[2]}
import React from "react";
import { Container, Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader, FormFeedback } from "reactstrap";

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

```jsx {linenos=inline,hl_lines=[4]}
import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
```

Deberías ver un formulario similar al de la imagen:

![Form built with reactstrap](https://imgur.com/6NWfclG.png)

En adición a estos dos archivos, crearemos un tercero para escribir dos funciones que serán de mucha importacia al implementar `Formik`. `srs/helpers.js`:

```javascript {linenos=inline,hl_lines=[1,20]}
export function validate(values) {
  const errors = {};

  // Name
  if (!values.name) errors.name = "Required";

  // Email
  const emailRgx = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!values.email) errors.email = "Required";
  else if (emailRgx.test(values.email)) errors.email = `Invalid email address`;

  // Password
  if (!values.password) errors.password = `Required`;
  else if (`${values.password}`.length < 7)
    errors.password = `Password must be larger than 7 characters`;

  return errors;
}

export function onSubmit() {
  setTimeout(() => {
    alert(JSON.stringify(values, null, 2));

    setSubmitting(false);
  }, 250);
}
```

Las cuáles importamos en `srs/App.js`:

```javascript {linenos=inline,hl_lines=[3]}
import React from "react";
import { Container, Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader, FormFeedback } from "reactstrap";
import { validate, onSubmit } from "./helpers.js";
```

## Formik

La instalación es muy sencilla, simplemente es otro paquete en `npm`.

```bash
npm install formik --save
```

Luego de instalarlo, lo importamos en `src/App.js`.

```javascript {linenos=inline,hl_lines=[2]}
import React from "react";
import { Formik } from "formik";
```

`Formik` es el componente principal de la librería, se mantiene al tanto del estado del formulario y provee valores, métodos y manejadores de eventos a través del parámetro `props`. Es indispensable que el formulario sea encapsulado por esta etiqueta `<Formik>`. Visualicemos una implementación básica de la librería con el código siguiente:

```jsx {linenos=inline,hl_lines=["9-12", "14-15", 18, 26, "29-31", 39, "42-44", 52, "55-57", 65, "66-68"],linenostart=6}
function Formulario() {
  return (
    <Container className="p-5">
      <Card>
        <CardHeader></CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              name: ``,
              email: ``,
              password: ``,
              bio: ``,
            }}
            validate={validate}
            onSubmit={onSubmit}
          >
            {(props) => {
              const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = props;
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
```

Para que Formik pueda mantenerse al tanto de los cambios de valores en el formulario y, por ende, ser capaz de validarlos, es necesario proveer una colección de valores iniciales, ó `initialValues`, que esté relacionados por nombre a los diferentes `<Input>`s. En el código anterior, definimos 4 controles: `name`, `email`, `password` y `bio`. Líneas 14-17, 31, 44, 57 y 70.

Es en base a esa configuración que los demás métodos y variables contenidas en `props` permitirán que Formik haga su magia. Línea 23.

No debemos olvidar que estamos en React, por lo qué debemos manejar el cambio de los valores en los controles. Esto lo logramos con los manejadores provistos por Formik: `handleChange` y `handleBlur`. Sin olvidar que debemos renderizar el valor adecuado en el control, para eso haremos uso de la propiedad `values`. Líneas 34-36, 47-49, 60-62 y 71-73.

También el tag `<Formik>` en sí mismo necesita de ciertas propiedades para funcionar, entre ellas:

- `initialValues`: Le dice a Formik de cuales valores debe mantenerse al tanto y buscar sus respectivos controles en el formulario.
- `validate`: Esta función recibe como parametro los `values` de los cuáles la librería está al tanto para ser validados. Línea 19.
- `onSubmit`: Quizá la función que más te interese de la librería. Es aquí dónde definimos que debe suceder si nuestro formulario ha sido validado con éxito. Por ejemplo, postear los valores a un servicio del backend. Línea 20.

Al hacer clic en `Submit`, sin completar un solo `<Input>`, deberías ver algo similar a esto:

![Formulario validado](https://imgur.com/IIVx4c9.png)

Listo, ya hemos validado el formulario.

## Simplifiquemos el código

Seguramente tienes alguna de estas preguntas en tu cabeza: 

- *¿Por qué repetir la asignación de `handleChange` y `handleBlur`?* y 
- *¿Por qué validar _manualmente_ cada propiedad paso a paso?*

Creéme, yo también me hice esas preguntas.

Para fortuna de quién tenga que mantener este formulario, hay una forma más sencilla de definir las validación y los controles de estado.

### Formik Field

Para reducir el número de veces que repetimos la asignación de los manejadores de eventos, vamos a importar otro elemento de la librería Formik. En el archivo `src/App.js`:

```javascript {linenos=inline,hl_lines=[2]}
import React from "react";
import { Formik, Field } from "formik"; // + Field
```

Este componente nos permite ahorrarnos la asignación de manejadores y valor directamente al componente. Lo único que debemos hacer, y ya que estamos usando `reacstrap`, es asignarlo a la propiedad `tag` de cada elemento `<Input>`. Formik se encargará del resto.

```jsx {linenos=inline,hl_lines=["6-8"],linenostart=29}
                    <Input
                      type="text"
                      name="name"
                      placeholder="Woody Allen"
                      invalid={errors.name && touched.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
```
```jsx {linenos=inline,hl_lines=["6"],linenostart=29}
                    <Input
                      type="text"
                      name="name"
                      placeholder="Woody Allen"
                      invalid={errors.name && touched.name}
                      tag={Field}
                    />
```

Es imprescindible que la propiedad `name` del `<Input>` tenga el mismo nombre a una propiedad en `initialValues`, como lo explicamos antes.

### Formik + Yup

[`Yup`](https://github.com/jquense/yup) es una librería que nos permite construir esquemas de conversión y validación de una manera sintáctica. El punto más fuerte de `Yup` es el nível de expresividad que las validaciones pueden alcanzar, sencillas o complejas.

De acuerdo a la [documentación](https://formik.org/docs/guides/validation#validationschema) de `Formik`, `Yup` es un ciudadano de primera clase en la librería por lo que posee una `prop` especial en el elemento `<Formik>` llamada `validationSchema`.

```shell
$ npm install yup --save
```

Una vez instalamos `Yup`, lo importamos en el archivo `src/App.js`:

```javascript {linenos=inline,hl_lines=[3]}
import React from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup"; // Importando Yup
```

Regresemos al código del componente Formulario en el archivo `src/App.js`. Justo en la propiedades del elemento `<Formik>` vamos a eliminar la propiedad `validate` y en su lugar asignaremos la propiedad `validationSchema`. Así:

```jsx {linenos=inline,hl_lines=["8-12"],linenostart=13}
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
  onSubmit={onSubmit}
>
```

Por último, podemos llenar nuestro formulario y ver que una vez validado, el `callback` en la propiedad `onSubmit` del elemento `<Formik>` es ejecutada.

![Formulario completo](https://imgur.com/wm6iA0l.png)

## Antes de irme

Espero este post te sea de mucha ayuda. En mi experiencia con React, Formik me ha facilitado el validar formularios al proveerme de métodos que me permiten ajustar a cada momento los valores y las validaciones necesarias. La expresividad del código es de gran valor ya que permite escalar y/o mantener de una forma sencilla sin reinventar la rueda para en cada escenario.

## Referencias

- [Formik documentation](https://formik.org/docs/overview)
