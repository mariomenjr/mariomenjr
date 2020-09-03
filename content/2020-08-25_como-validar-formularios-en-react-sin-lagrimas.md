---
author: "Mario Menjívar"
slug: "como-validar-formularios-en-react-sin-lagrimas"
title: "Cómo validar formularios en React, sin lágrimas"
timestamp: "2020-08-25T10:08:02.000-07:00"
brief: "Históricamente, validar un formulario en React requiere de una cantidad impresionante de boilerplate que añade complejidad innecesaria. Veamos cómo librarnos de eso."
keywords: "formik,español,react,cómo,validar formularios react,binaria,blog"
cover: "https://imgur.com/ROMkMdN.png"
---

# Cómo validar formularios en React, sin lágrimas

Todos los desarrolladores de software que trabajan con React, absolutamente todos, hemos tenido ese tedioso ticket para crear y/o validar un formulario. Afortunadamente para ti, hoy te mostraré la forma más sencilla de cerrar ese ticke: Formik.

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
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";

function Formulario() {
  return (
    <Container>
      <Row>
        <Col className="p-5">
          <Card>
            <CardHeader></CardHeader>
            <CardBody>
              <Form>
                <h1>Form</h1>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Woody Allen"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="contoso@domain.com"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Provide a password"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="selectMulti">Select Multiple</Label>
                  <Input
                    type="select"
                    name="selectMulti"
                    id="selectMulti"
                    multiple
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="bio">Text Area</Label>
                  <Input type="textarea" name="bio" id="bio" />
                </FormGroup>

                <Button>Submit</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Formulario;
```

También, añade está línea en el archivo `src/index.js`:

```javascript
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'; // Importa bootstrap a la React App
...
```

Deberías ver un formulario similar al de la imagen:

![Form built with reactstrap](https://imgur.com/Vyv5sl0.png)

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
...
```

Este componente debe encapsular a nuestro formulario, de la siguiente forma:

```javascript
// src/App.js

...
function Formulario() {
  return (
    <Container>
      <Row>
        <Col className="p-5">
          <Card>
            <CardHeader></CardHeader>
            <CardBody>
              <Formik>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  <Form>
                    <h1>Form</h1>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Woody Allen"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="contoso@domain.com"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Provide a password"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="selectMulti">Select Multiple</Label>
                      <Input
                        type="select"
                        name="selectMulti"
                        id="selectMulti"
                        multiple
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="bio">Text Area</Label>
                      <Input type="textarea" name="bio" id="bio" />
                    </FormGroup>

                    <Button>Submit</Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
...
```