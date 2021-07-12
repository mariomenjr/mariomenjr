---
slug: 2021/07/10/metodos-de-extension-javascript-typescript
title: "Métodos de extensión en JavaScript/TypeScript"
author: Mario Menjívar
author_title: Software Engineer
author_url: https://github.com/mariomenjr
author_image_url: https://avatars3.githubusercontent.com/u/1946936?s=460&v=4
tags: [javascript, typescript, design patterns]
keywords: [extension methods en javascript,extension methods en js,extension metods en javascript,metodos de extension en javascript,extension methods en typescript,metodos de extension en typescript,añadir metodo a prototipo javascript]
date: 2021-07-14T20:21:18.000-07:00
description: "Seguro estás familiarizado con algunos de los métodos para manipular un Array: map, join ó reduce, por mencionar unos pocos. Sin embargo, no tenemos ningún método para barajear los ítems de un Array de forma aleatoria. Podríamos simplemente crearnos una función shuffleArray que reciba como parámetro el Array a barajear, y nos devuelva un nuevo Array con sus ítems en un orden diferente. ¿Qué pasa si te digo que hay una manera más elegante y expresiva de lograr esto? En este post te hablaré sobre los extension methods o métodos de extensión."
image: "https://images.unsplash.com/photo-1616812757122-a6b613cf617c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
draft: true
---

Seguro estás familiarizado con algunos de los métodos para manipular un Array: map, join ó reduce, por mencionar unos pocos. Sin embargo, no tenemos ningún método para barajear los ítems de un Array de forma aleatoria. Podríamos simplemente crearnos una función shuffleArray que reciba como parámetro el Array a barajear, y nos devuelva un nuevo Array con sus ítems en un orden diferente. ¿Qué pasa si te digo que hay una manera más elegante y expresiva de lograr esto? En este post te hablaré sobre los extension methods o métodos de extensión.

<!--truncate-->

## Métodos de extensión

Estos métodos como su nombre sugiere son extensiones a tipos existentes para añadir nuevas funcionalidad sin necesidad de crear tipos nuevos o funciones de `utils`.


## Prototype

<!-- Trabajo a diario con el .NET Core, y puedo decir que los métodos de extensión son una de mis herramientas favoritas a la hora de organizar mi código y encapsular lógica a tipo propios y de terceros. -->

JavaScript es un lenguaje orientado a objetos pero a diferencia de lenguajes como C# o Java, está característica se basa en prototipos en lugar de clases.

Pero, Mario, ¿Qué es un Prototipo?

_In a nutshell_, un prototipo es un objeto que sirve de plantilla a otro. En ese sentido, esta plantilla se convierte en el tipo Padre y el objeto que se está basando en él, el tipo Hijo.
 
Si este objeto Hijo es usado como plantilla de un tercer tipo, supongamos un objeto Nieto, se convertirá en su prototipo. Cualquier prototipo puede ser extendido para añadir propiedades y, lo importante para el post, métodos.

### Porqué

### Cuándo

## En JavaScript

## En TypeScript

