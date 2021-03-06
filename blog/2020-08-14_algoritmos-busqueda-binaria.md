---
slug: 2020/08/14/algoritmos-busqueda-binaria
title: "#Algoritmos: Búsqueda binaria"
author: Mario Menjívar
author_title: Software Engineer
author_url: https://github.com/mariomenjr
author_image_url: https://avatars3.githubusercontent.com/u/1946936?s=460&v=4
tags: [algoritmos,computer science,busqueda binaria]
keywords: [algoritmos,computer,science,busqueda,binaria,blog,ciencias,computacion]
date: 2020-08-14T09:47:12.000-07:00
description: "A qué alguna vez te toco buscar un número de teléfono en aquellos gigantescos directorios teléfonicos, ¿Cómo le hacías, página por página o te tratabas de ahorrar tiempo saltándote páginas?"
image: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Binary_search_into_array.png"
---

A qué alguna vez te toco buscar un número de teléfono en aquellos gigantescos directorios teléfonicos, ¿Cómo le hacías, página por página o tratabas de ahorrar tiempo saltándote páginas?

<!--truncate-->

## La idea

Retomando el gigantesco directorio teléfonico, podemos estar seguros de una cosa: los números de teléfono se presentan en orden alfabético por el nombre del propietario. Esto es es imprecindible para el algoritmo de búsqueda binaria. 

Suponiendo que buscamos el número teléfonico de Juan, ¿Tiene sentido empezar desde las primeras páginas dónde estarán los números de personas cómo Alberto o Alejandra? Si tu respuesta es no, estás en lo correcto, será muchísimo más fácil identificar en cuál página empiezan a listarse los nombres que inician con J, y empezar nuestra búsqueda desde ahí. Una vez en esta página, podríamos incluso tratar de idéntificar en cuál página empiezan a listarse los nombres que empiezan con Ju, y así sucesivamente hasta encontrar a Juan.

## En código

Pero en este blog nosotros ya no usamos esos gigantescos directorios teléfonicos, así que vamos a ver un ejemplo más acorde a lo que sabemos hacer aquí: código. Por lo qué para nuestro ejemplo práctico, vamos a validar si un número `X` está incluído dentro de una lista de `N` elementos.

Como mencionamos antes en el ejemplo del directorio, podíamos estar seguros de una cosa: sus datos están ordenados. Esto se mantiene a la hora de utilizar código. Nuestro arreglo de datos debe estar ordenado. Sino lo está, debemos ordenarlo. Eso lo dejaremos para futuros posts.

Esta será nuestra lista de trabajo:

```javascript
const numbers = [2, 3, 5, 9, 15, 17, 55, 69];
```

Para ejecutar de manera efectiva el algoritmo, necesitaremos tener la noción del mayor y menor número en nuestra lista, y ya qué no hay mejor manera de localizar valores en una lista que usar su indice, guardaremos eso, los indices:

```javascript
let maxIndex = numbers.length - 1;
let minIndex = 0;
```

¿Recuerdas como en el ejemplo del directorio, tratabamos de identificar la página en la cuál los nombres que inician con J empezaban a listarse? Al aplicar el algoritmo de búsqueda binaria tomamos un enfoque más general. Esto significa que nosotros siempre dividiremos la lista por la mitad y, partiendo de una comparación, definiremos a cuál de las dos mitades pertence el valor que deseamos encontrar. Una vez conozcamos la mitad a la qué pertenece, repetimos el proceso y así sucesivamente hasta que nuestra área de búsqueda se reduce a uno, o simplemente no encontramos el valor.

> ![Búsqueda binaria](https://upload.wikimedia.org/wikipedia/commons/f/f7/Binary_search_into_array.png)
> Este es el esquema del funcionamiento del algoritmo de [Wikipedia](https://es.wikipedia.org/wiki/B%C3%BAsqueda_binaria)

Antes de ejemplificar lo anterior, nos queda mostrar cómo identificaremos la mitad de nuestra lista:

```javascript
let half = Math.floor((minIndex + maxIndex)/2);
```

Ahora sí, armemos el algoritmo:

```javascript
const find = 17;
const numbers = [2, 3, 5, 9, 15, 17, 55, 69];

function busquedaBinaria(collection, findee) {
  // Asignando los valores del rango inicial
  let minIndex = 0;
  let maxIndex = numbers.length - 1;

  while (minIndex <= maxIndex) {
    
    // Calculando la posición en el medio de la lista
    let half = Math.floor((minIndex + maxIndex) / 2);

    // Recoger el valor del medio
    let guess = collection[half];

    if (guess === findee) // Comparamos si es el valor que buscamos
      return half;

    else if (guess > findee) 
      // Si el valor que buscamos es menor al valor supuesto
      // debemos reducir nuestro rango de búsqueda.
      // Ahora nuestro mayor valor está justo debajo de la mitad calculada.
      maxIndex = half - 1; 
    
    else 
      // Si el valor que buscamos es mayor al valor supuesto
      // debemos reducir nuestro rango de búsqueda.
      // Ahora nuestro menor valor está justo arriba de la mitad calculada.
      minIndex = half + 1;
  }
  return -1;
}

const foundIndex = busquedaBinaria(numbers, find);
console.log(
  foundIndex === -1
    ? `El número ${find} no fue encontrado.`
    : `El número ${find} está en el índice ${foundIndex}.`
);
```

Es esta dinámica de decidir únicamente entre dos opciones, cada vez que reducimos el área de búsqueda, lo qué le da el nombre algoritmo.

## Conclusión

Pudimos simplemente ejecutar el siguiente código:

```javascript
const find = 17;
const numbers = [2, 3, 5, 9, 15, 17, 55, 69];

let foundIndex = -1;

for (let index = 0; index < numbers.length; index++) {
  if (find === numbers[index]) {
    foundIndex = index;
    break;
  }
}

console.log(
  foundIndex === -1
    ? `El número ${find} no fue encontrado.`
    : `El número ${find} está en el índice ${foundIndex}.`
);
```

Comparar cada uno de los `items` en la lista y, cuando lo encontramos, listo. Podrías pensar que es enfoque es muchísimo más fácil y rápido de programar, y tienes razón. Pero, ¿Qué pasa cuando nuestra lista no contiene 8 `items` sino 1,000,000?

La intención de este post es mostrarte que, si bien es cierto en programación hay muchas formas de resolver un problema, nuestro objetivo conforme avanzamos en nuestra carrera es escogar la más óptima. Cada problema es un mundo y es nuestro trabajo encontrar la mejor solución.

## Referencias

- [Binary search algorithm from Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [Grokking Algorithms: An Illustrated Guide For Programmers and Other Curious People](https://www.goodreads.com/book/show/22847284-grokking-algorithms-an-illustrated-guide-for-programmers-and-other-curio)