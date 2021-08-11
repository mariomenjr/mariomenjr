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

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem"; 

Se ha escrito muchísimo acerca de las ventajas (y desventajas) de las bases de datos NoSQL frente a las SQL. Vagamente, podemos describir a cada uno de estos tipos de bases de datos con una palabra. Flexible, para NoSQL, y Fijo, para SQL. Sin embargo, el tiempo nos ha enseñado que ambas son meras herramientas que son preferidas para casos específicos.

En esta entrada, te mostraré como implementar una capa de datos siguiendo el patrón repositorio para consultar y persistir datos a una instalación de MongoDB haciendo uso de C# y el .NET Core Framework.

<!--truncate-->

## MongoDB

Para empezar esta entrada vamos a crear una pequeña base de datos usando MongoDB. Para esto, podemos usar un servicio online llamado `MongoDB Atlas` o una imagen de `Docker` con todo lo necesario para ejecutar nuestra base de datos localmente.

### MongoDB Atlas

// TODO

### Contenedor de Docker

Sin duda, esta opción se te hará más util si lo que quieres es una instalación local. Si haz usado Docker antes, sabrás de lo qué te estoy hablando. Si no, veámoslo.

El primer paso es instalar Docker, eso dependerá de tu sistema.

<Tabs
	groupId="install-docker"
	defaultValue="linux"
	values={[
		{label: 'Linux', value: 'linux'},
		{label: 'macOs', value: 'macos'},
		{label: 'Windows', value: 'windows'}
	]}>

<TabItem value="linux">

Por lo general, hay que completar dos pasos para tener Docker listo en cualquier distro Linux. Así lo haríamos en Manjaro:

1. Instalar el paquete desde los repositorios

```bash
sudo pacman -S docker
```

2. Una vez instalado, debemos `habilitarlo` e `iniciarlo`:

```bash
sudo systemctl start docker
```
```bash
sudo systemctl enable docker
```

Ahora puedes ejecutar Docker como `root`. Opcionalmente, puedes agregar tu usuario al grupo de Docker. De este modo, puedes ejecutar contenedores sin necesidad del comando `sudo`.

```bash
sudo usermod -aG docker $USER
```

And, to make our lives easier, let's install `docker-compose`:

```bash
sudo pacman -S docker-compose
```

</TabItem>
<TabItem value="macos">

```bash
brew install docker
```

</TabItem>
<TabItem value="windows">

Sigue las siguientes [instrucciones](https://docs.docker.com/docker-for-windows/install/#install-docker-desktop-on-windows).

</TabItem>

</Tabs>

Ya que Docker está listo, el siguiente paso es instalar y ejecutar un contenedor que tenga todo lo necesario para alojar una base de datos MongoDB. 

Por suerte para nosotros, existe una [`imagen` oficial](https://hub.docker.com/_/mongo) que cumple con esas características. 

Para hacer uso de ella, siguiendo los pasos en la documentación oficial vamos a crear el siguiente archivo en el directorio que prefieras.

```yml title="~/Samples/docker-mongo/docker-compose.yml"
# Usa root/password como usuario/contraseña
version: '3.1'

services:

  mongo:
    image: mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password

  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: password
      ME_CONFIG_MONGODB_URL: mongodb://root:password@mongo:27017/
```

Una vez creado, es hora de ejecutar Docker. Para eso, nos posicionamos en el directorio.

```bash
cd ~/Samples/docker-mongo
```

Y ejecutamos `docker-compose`:

```bash
docker-compose up
```

Si todo salió bien, deberías ver las siguientes líneas:

> mongo-express_1  | Mongo Express server listening at http://0.0.0.0:8081 <br />
> mongo-express_1  | Server is open to allow connections from anyone (0.0.0.0) <br />
> mongo-express_1  | basicAuth credentials are "admin:pass", it is recommended(...) <br />

## Colecciones

Dependiendo de la opción que hayas elegido arriba, llegaste hasta aquí rápido o muy rápido. De todas formas, sigamos con la diversión.

