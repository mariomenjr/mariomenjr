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

## Instalación

Podemos instalar Formik desde:

```bash
$ npm install formik --save
```

ó

```bash
$ yarn add formik 
```

Ahora, creemos nuestro primer formulario.r

## Manos a la obra

```javascript
import React from "react";
import { Formik } from "formik";

/* Handles the validation process for values in the form */
function handleValidation(values) {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  return errors;
}

/* Executes when the form is submitted if validation passed */
function handleSubmit(values, { setSubmitting }) {
  setTimeout(() => {
    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  }, 400);
}

function Basic() {
  return (
    <div>
      <h1>Anywhere in your app!</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={handleValidation}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />

            {errors.email && touched.email && errors.email}

            <input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />

            {errors.password && touched.password && errors.password}

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Basic;
```
