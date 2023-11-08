---
slug: 2023/09/03/algorithmes-la-recherche-binaire
title: "#Algorithmes: La recherche binaire"
date: 2023-09-03T01:47:12.000-07:00
description: "Qu’est-ce que la recherche binaire ?"
summary: "La recherche binaire est un algorithme efficace pour rechercher un élément dans une liste ordonnée d'éléments."
coverCaption: Photo par [Delia Giandeini](https://unsplash.com/@dels?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/QndYCQc_a3g?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
tags: ["algorithmes", "informatique", "recherche binaire"]
---

## L'annuaire

Imagine que tu as entre les mains un annuaire des années 90 et que tu dois chercher le numéro de téléphone d'un ami. Garde en tête que les contacts sont ordonnés alphabétiquement. Ce qui est l'objet de notre article aujourd’hui.

Supposant que tu cherches le numéro de **Juan**, est-ce que tu vas commencer par les premières pages où se trouve Alberto ou Alejandra? Clairement pas. Ça serait bien plus facile d'identifier la partie de l'annuaire où ces contacts dont les prénoms débutent avec **J** sont listés. Malgré ça, il reste difficile de trouver cette lettre spécifique. Ça pourrait nous prendre une, deux, ou *n* tentatives.

Une meilleure manière d'aborder la situation serait d’ouvrir le carnet juste au milieu et, sachant que les contacts sont déjà ordonnés, identifier si notre lettre est à gauche ou à droite. Supposant qu'au milieu se trouve la lettre M, on a réduit notre espace de recherche à moitié. Cette même idée peut être appliquée une fois que tu trouves la section des **J**, jusqu'à trouver Juan.

## On veut voir le code

Ça fait longtemps depuis que je n'ai pas vu d'annuaire téléphonique, donc on va voir un exemple plus proche de ce que nous savons faire ici. Pour cela, on valide si un numéro `x` est inclus dans une liste de `n` éléments.

Dans cet exemple, on mentionne que l’aspect le plus important est que les contacts soient  ordonnés. C'est la seule manière avec laquelle on peut réduire notre espace de recherche à moitié, en ayant la certitude que toutes les valeurs à droite et à gauche seront supérieures et inférieures, respectivement, à la valeur que nous avons décidé d’utiliser comme référence.

Ce sera notre liste de travail:

```javascript
const numbers = [2, 3, 5, 9, 15, 17, 55, 69];
```

Pour exécuter l’algorithme de manière effective, nous aurons besoin d' identifier le plus grand et le plus petit nombre dans notre liste. Pour cela, nous utilisons ces *indices*:

```javascript
let maxIndex = numbers.length - 1;
let minIndex = 0;
```

Avec ce code, nous identifions le milieu de notre liste:

```javascript
let half = Math.floor((minIndex + maxIndex)/2);
```

Et maintenant, voyons comment appliquer cet algorithme en code:

```javascript
const find = 17;
const numbers = [2, 3, 5, 9, 15, 17, 55, 69];

function rechercheBinaire(collection, findee) {
  // Initialisant les valeures
  let minIndex = 0;
  let maxIndex = numbers.length - 1;

  while (minIndex <= maxIndex) {
    
    // Calculant la position du centre de la liste
    let half = Math.floor((minIndex + maxIndex) / 2);

    // Sauvegarder la valeur du centre
    let guess = collection[half];

    if (guess === findee) // Comparons si c’est la valeur qu’on cherche
      return half;

    else if (guess > findee) 
      // Si la valeur qu’on cherche est inférieure à la valeur trouvée, on doit réduire notre range de recherche. Maintenant, notre plus grande valeur est au-dessous du centre.
      maxIndex = half - 1; 
    
    else 
      // Si la valeur qu’on cherche est inférieure à la valeur trouvée, on doit réduire notre range de recherche. Maintenant, notre plus petite valeur est au-dessus du centre.
      minIndex = half + 1;
  }
  return -1;
}

const foundIndex = rechercheBinaire(numbers, find);
console.log(
  foundIndex === -1
    ? `Le numéro ${find} n’est pas trouvé.`
    : `Le numéro ${find} se trouve à l'index ${foundIndex}.`
);
```

C’est le fait de décider entre deux options, chaque fois que nous réduisons l’espace de recherche, ce qui donne le nom à cet algorithme “recherche binaire”.

## Conclusion

On pourrait simplement executer le code suivant:

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
    ? `Le numéro ${find} n’est pas trouvé.`
    : `Le numéro ${find} se trouve à l'index ${foundIndex}.`
);
```

Comparer chacun des éléments de la liste et, quand nous trouvons notre élément, nous finissons l'exécution. Vous pouvez penser que cette approche est beaucoup plus facile et rapide à programmer, et vous avez raison. Mais, que-ce qui se passe quand notre liste ne contient pas 8 éléments mais 1,000,000?

L’intention derrière cette publication est de vous montrer que, même si en programmation il y a pas mal de manière pour résoudre un problème, notre objectif à mesure que nous avançons dans notre carrière c’est de choisir la plus optimale. Chaque problème est un monde et c’est à nous de trouver la meilleure solution.

## Remerciements

Je tiens à remercier [Ribel](https://www.instagram.com/chifaabelarbi) de m'avoir aidé à réviser ma traduction initiale et à rendre ma traduction plus naturelle pour le lecteur. Être mon professeur de français et elle-même étudiante en informatique était une excellente combinaison pour rendre ce processus amusant et instructif.

## Références

- [Binary search algorithm from Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [Grokking Algorithms: An Illustrated Guide For Programmers and Other Curious People](https://www.goodreads.com/book/show/22847284-grokking-algorithms-an-illustrated-guide-for-programmers-and-other-curio)
