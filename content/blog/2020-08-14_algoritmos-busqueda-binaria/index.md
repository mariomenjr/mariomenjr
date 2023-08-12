---
slug: 2020/08/14/algoritmos-busqueda-binaria
title: "#Algoritmos: Búsqueda binaria"
date: 2020-08-14T09:47:12.000-07:00
description: "¿Qué es búsqueda binaria?"
summary: "La búsqueda binaria es un algoritmo eficiente para encontrar un elemento en una lista ordenada de elementos. "
coverCaption: Photo by [Delia Giandeini](https://unsplash.com/@dels?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/QndYCQc_a3g?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
tags: ["algoritmos", "computer science", "busqueda binaria"]
---

## Directorio teléfonico

Imagina que tienes en las manos un directorio teléfonico de los años 90 y debes buscar el número de teléfono de un amigo. Es importante tener en cuenta que los contactos están ordenados alfabéticamente. Este será nuestro enfoque en la entrada de hoy.

Suponiendo que buscamos el número teléfonico de **Juan**, ¿Tiene sentido empezar desde las primeras páginas dónde se encuentran Alberto o Alejandra? Claro que no, será muchísimo más fácil identificar en cuál parte el directorio se listan esos contactos cuyos nombres inician con **J**. Sin embargo, siguen siendo muchos y encontrar esta letra específicamente podría tomarnos uno, dos, o *n* intentos.

Una mejor manera de abordarlo sería abrir este directorio justo por la mitad y, ya que los contactos están ordenados, identificar si nuestra letra objetivo está a la izquierda o a la derecha. Suponiendo que a la mitad de este directorio se encuentra la letra *M*, hemos reducido nuestro espacio de búsqueda efectivamente a la mitad. Esta misma idea puede aplicarse una vez encontremos la sección de las **J**s, y así sucesivamente hasta encontrar a *Juan*.

## Quiero ver código

Han pasado años desde la última vez que ví un directorio teléfonico, así que vamos a ver un ejemplo más acorde a lo que sabemos hacer aquí. Para ello, validaremos si un número `X` está incluído dentro de una lista de `N` elementos.

En el ejemplo, mencionamos que el aspecto más importante era que los contactos estén ordenados. Esta es la única forma en la cual podemos reducir nuestro espacio de búsqueda por la mitad, teniendo la certeza de que todos los valores a la derecha y a la izquierda serán mayores y menores, respectivamente, al valor que decidimos usar como referencia.

Esta será nuestra lista de trabajo:

```javascript
const numbers = [2, 3, 5, 9, 15, 17, 55, 69];
```

Para ejecutar de manera efectiva el algoritmo, necesitaremos identificar el mayor y menor número en nuestra lista, para eso usaremos estos *indices*:

```javascript
let maxIndex = numbers.length - 1;
let minIndex = 0;
```

Con este código identificaremos la mitad de nuestra lista:

```javascript
let half = Math.floor((minIndex + maxIndex)/2);
```

Y ahora así, miremos cómo aplicar este algoritmo en código:

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

Es esta dinámica de decidir únicamente entre dos opciones, cada vez que reducimos el área de búsqueda, lo qué le da su nombre al algoritmo.

## Conclusión

Podríamos haber simplemente ejecutado el siguiente código:

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

Comparar cada uno de los `items` en la lista y, cuando lo encontremos, terminar la ejecución. Podrías pensar que este enfoque es muchísimo más fácil y rápido de programar, y tienes razón. Pero, ¿Qué pasa cuando nuestra lista no contenga 8 `items` sino 1,000,000?

La intención de este post es mostrarte que, si bien es cierto en programación hay muchas formas de resolver un problema, nuestro objetivo conforme avanzamos en nuestra carrera es escoger la más óptima. Cada problema es un mundo y es nuestro trabajo encontrar la mejor solución.

## Referencias

- [Binary search algorithm from Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [Grokking Algorithms: An Illustrated Guide For Programmers and Other Curious People](https://www.goodreads.com/book/show/22847284-grokking-algorithms-an-illustrated-guide-for-programmers-and-other-curio)
