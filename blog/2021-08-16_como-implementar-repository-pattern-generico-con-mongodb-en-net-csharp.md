---
slug: 2021/08/16/como-consultar-y-persistir-datos-en-mongodb-con--net
title: "Cómo consultar y persistir datos en MongoDB con .NET"
author: Mario Menjívar
author_title: Software Engineer
author_url: https://github.com/mariomenjr
author_image_url: https://avatars3.githubusercontent.com/u/1946936?s=460&v=4
tags: [csharp, mongodb, repository pattern,patrón de repositorio,dao,data layer]
keywords: [csharp, mongodb, repository pattern,patrón de repositorio,dao,data layer]
date: 2021-08-16T11:31:18.000-07:00
description: "En esta entrada, te mostraré como implementar una capa de datos siguiendo el patrón repositorio para consultar y persistir datos a una instalación de MongoDB haciendo uso de C# y el .NET Core Framework."
image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80"
draft: true
---

Se ha escrito muchísimo acerca de las ventajas (y desventajas) de las bases de datos NoSQL frente a las SQL. Vagamente, podemos describir a cada uno de estos tipos de bases de datos con una palabra. Flexible, para NoSQL, y Fijo, para SQL. Sin embargo, el tiempo nos ha enseñado que ambas son meras herramientas que son preferidas para casos específicos.

En esta entrada, te mostraré como implementar una capa de datos siguiendo el patrón repositorio para consultar y persistir datos a una instalación de MongoDB haciendo uso de C# y el .NET Core Framework.

<!--truncate-->
