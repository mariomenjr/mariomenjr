---
slug: 2021/08/18/como-consultar-y-persistir-datos-en-mongodb-con--net
title: "Cómo consultar y persistir datos en MongoDB con .NET"
author: Mario Menjívar
author_title: Software Engineer
author_url: https://github.com/mariomenjr
author_image_url: https://avatars3.githubusercontent.com/u/1946936?s=460&v=4
tags: [csharp, mongodb, repository pattern,patrón de repositorio,dao,data layer]
keywords: [csharp, mongodb, repository pattern,patrón de repositorio,dao,data layer]
date: 2021-08-18T16:31:18.000-07:00
description: "En esta entrada, te mostraré como implementar una capa de datos siguiendo el patrón repositorio para consultar y persistir datos a una instalación de MongoDB haciendo uso de C# y el .NET Core Framework."
image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem"; 

Se ha escrito muchísimo acerca de las ventajas (y desventajas) de las bases de datos NoSQL frente a las SQL. Vagamente, podemos describir a cada uno de estos tipos de bases de datos con una palabra. Flexible, para NoSQL, y Fijo, para SQL. Sin embargo, el tiempo nos ha enseñado que ambas son meras herramientas que son preferidas para casos específicos.

En esta entrada, te mostraré como implementar una capa de datos siguiendo el patrón repositorio para consultar y persistir datos a una instalación de MongoDB haciendo uso de C# y el .NET Core Framework.

<!--truncate-->

## MongoDB

Para empezar esta entrada vamos a crear una pequeña base de datos usando MongoDB. Para esto, podemos usar un servicio online llamado `MongoDB Atlas` o una imagen de `Docker` con todo lo necesario para ejecutar nuestra base de datos localmente. Veamos cómo hacerlo con Docker.

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
brew install docker docker-compose docker-machine xhyve docker-machine-driver-xhyve
```

Más detalles [aquí](https://pilsniak.com/how-to-install-docker-on-mac-os-using-brew).

</TabItem>
<TabItem value="windows">

Sigue las siguientes [instrucciones](https://docs.docker.com/docker-for-windows/install/#install-docker-desktop-on-windows).

</TabItem>

</Tabs>

Ya que Docker está listo, el siguiente paso es instalar y ejecutar un contenedor que tenga todo lo necesario para alojar una base de datos MongoDB. 

Por suerte, existe una [imagen oficial](https://hub.docker.com/_/mongo) que cumple con esas características. 

Para hacer crear un contenedor apartir de esta imagen, seguiremos los pasos en la documentación oficial. Crearemos el siguiente archivo en el directorio que prefieras.

```yml title="~/Samples/docker-mongo/docker-compose.yml"
# Usa root/password como usuario/contraseña
version: '3.1'

services:

  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
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

Una vez creado, es hora de construir nuestro contendor. Para eso, nos posicionamos en el directorio.

```bash
cd ~/Samples/docker-mongo
```

Y ejecutamos `docker-compose up`:

```bash
docker-compose up
```

Si todo salió bien, deberías ver las siguientes líneas:

> mongo-express_1  | Mongo Express server listening at http://0.0.0.0:8081 <br />
> mongo-express_1  | Server is open to allow connections from anyone (0.0.0.0) <br />
> mongo-express_1  | basicAuth credentials are "admin:pass", it is recommended(...) <br />

Si llevas tiempo desarrollando software, seguro recordarás a PhpMyAdmin. La imagen oficial de _MongoDB_ provee un servicio muy parecido llamado `Mongo Express`, dirígete a [http://localhost:8081](http://localhost:8081) para acceder.

## Preparando el ejemplo

### Base de datos

Al acceder a _Mongo Express_, lo primero que haremos será crear una base de datos.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-mongo-express.png').default} alt="Mongo Express" />
  <figcaption>Instancia local de Mongo Express.</figcaption>
</figure>

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-db-created.png').default} alt="DB Created" />
  <figcaption>Base de datos creada.</figcaption>
</figure>

En el siguiente paso crearemos una collección.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-collection-created.png').default} alt="Collection Created" />
  <figcaption>Creating Collection.</figcaption>
</figure>

Y por último el primer documento, siguiendo un esquema sencillo. Únicamente una propiedad: `username`.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-new-document.png').default} alt="Document Created" />
  <figcaption>Nuevo documento creado.</figcaption>
</figure>

> En este ejemplo, tenemos que crear un usuario distinto a `root` para poder consultar y persistir datos desde la aplicación a través MongoDB.Driver para .NET. La forma más sencilla de logralo es a través de [Robo 3T](https://robomongo.org/).

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-create-user.png').default} alt="Sample->Users" />
  <figcaption>Click derecho en Sample->Users.</figcaption>
</figure>

### API en .NET

Lo siguiente que haremos será crear una API en .NET para poder consumir la base de datos a través de endpoints. En realidad podría ser un proyecto de consola, una librería, o lo qué tu quieras.

<Tabs
	groupId="dotnet-webapi"
	defaultValue="cli"
	values={[
		{label: '.NET CLI', value: 'cli'},
	]}>

<TabItem value="cli">

Primero creamos el directorio de la solución.

```bash
mkdir ~/Samples/dotnet-webapi/Sample.API && cd ~/Samples/dotnet-webapi/Sample.API
```

Una vez ahí, creamos el proyecto API de `dotnet`.

```bash
dotnet new webapi
```

Ahora creamos una solución, para que nuestro proyecto sea amigable con un IDE (en mi caso, Rider).

```bash
cd .. & dotnet new sln -n Sample
```

> The template "Solution File" was created successfully.

Y añadimos nuestro recién creado proyecto `Sample.API` a la solución.

```bash
dotnet sln add Sample.API/Sample.API.csproj
```
> The template "Solution File" was created successfully.

Ejecutamos nuestro proyecto para asegurarnos que hicimos todo bien.

```bash
dotnet run --project Sample.API
```

Deberías ver una lista JSON en ese enlace: [https://localhost:5001/WeatherForecast](https://localhost:5001/WeatherForecast).

</TabItem>

</Tabs>

### MongoDB.Driver

Por último, instalaremos el driver oficial de MongoDB para .NET con el cuál podremos consultar e insertar datos. Haz click en el siguiente [link](https://www.nuget.org/packages/MongoDB.Driver/) para determinar la última versión estable y poder ejecutar el comando de abajo.

```bash
dotnet add Sample.API/Sample.API.csproj package MongoDB.Driver -v {VERSION}
```

Una vez instalado, crearemos un nuevo endpoint para conectarnos a MongoDB y validar la instalación.

El primer paso es crear un controlador llamado `ApiController`.

```bash
touch Sample.API/Controllers/ApiController.cs
```

Con el siguiente contenido:

```csharp title="Sample.API/Controllers/ApiController.cs"
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Sample.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        [HttpGet, Route("[action]")]
        public JsonResult GetUsers()
        {
            var client = new MongoClient("mongodb://mariomenjr:mariomenjr@localhost:27017/sample");
            var database = client.GetDatabase("sample");

            var users = database.GetCollection<object>("users");
            var datos = users.AsQueryable().Select(s => s);

            return new JsonResult(datos);
        }
    }
}
```

Al dirigirnos al nuevo endpoint, veremos que nuestro único usuario registrado es devuelto en formato JSON.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-ApiGetUsers.png').default} alt="Consulta Users MongoDB" />
  <figcaption>Consultando colección Users de MongoDB.</figcaption>
</figure>

## Repository Pattern

Con nuestra base de datos y API listas, el siguiente paso para consumir nuestra base de datos es crear nuestro repositorio.

El _Repository Pattern_ (o, Patrón de Repositorio en español) es una estrategia en desarrollo de software para abstraer el acceso de datos en nuestra aplicación. En palabras más simples, es el código que tiene como responsabilidad exclusiva el consultar y guardar datos en una aplicación.

Sin capa de abstracción, podríamos encontrarnos que el código de interacción con la base de datos es parte de la lógica de negocio de tu aplicación.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-non-repository-diagram.png').default} alt="Non Repository Diagram" />
  <figcaption>Diagrama de acceso a datos sin una capa de abstracción.</figcaption>
</figure>

Algo similar a esto:

```csharp title="Sample.API/Controllers/ApiController.cs"
// ... Método GetUsers  

// highlight-start 
// Código para conectarnos a la base de datos
var client = new MongoClient("mongodb://mariomenjr:mariomenjr@localhost:27017/sample");
var database = client.GetDatabase("sample");
// highlight-end

// highlight-start 
// Código de consulta de datos
var users = database.GetCollection<object>("users");
var datos = users.AsQueryable().Select(s => s);
// highlight-end

// Código de aplicación que devuelve datos como JSON
return new JsonResult(datos);

// ...
```

Podrías argumentar que esta pieza de código _hace el trabajo_, ¿Por qué querríamos abstraerlo? Claro, es una pregunta válida. Hay muchas razones por las qué nos conviene más tener una capa dedicada al acceso a datos que repetir código por todos lados.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-repository-diagram.png').default} alt="Repository Diagram" />
  <figcaption>Diagrama de acceso a datos con el Patrón de Repositorio</figcaption>
</figure>

En primera, las aplicaciones nunca están terminadas. Siempre habrá una actualización por hacer. Por ejemplo, ¿Qué pasa si agregas un nuevo campo a la tabla `Users`? Tendrías que reescribir cada parte de tu aplicación dónde accedas a estos datos. Esto implica no solo la reescritura, pero una revalidación de toda la aplicación. Nada bonito, créeme.

## Sample.DAL

Si has trabajado con .NET antes, seguro habrás escuchado la palabra DAL. Aunque no es propia de este lenguaje de programación, es muy común ver esta abstracción en proyectos con esta tecnología. No es raro ver soluciones con más de un proyecto, y uno de los cuáles lleve en su nombre el sufijo `.DAL` o `Data Access Layer` (o _capa de acceso a datos_ en español).

Por lo general, las soluciones de .NET que implementan un proyecto .DAL consumen datos de una base de datos en Microsoft SQL Server. En nuestro caso, haremos algo muy parecido pero con MongoDB. Let's have fun.

### Cortana, crea un segundo proyecto

Vamos a crear un segundo proyecto dentro de nuestra solución, será nuestra `DAL`.

```bash
mkdir Sample.DAL && dotnet new classlib
```

Y ahora lo añadimos a nuestra solución.

```bash
cd .. && dotnet sln add Sample.DAL/Sample.DAL.csproj
```

### Instalamos MongoDB.Driver, de nuevo

Esta vez en nuestro proyecto DAL. Para mayor detalle, [MongoDB.Driver](#mongodbdriver).

```bash
dotnet add Sample.DAL/Sample.DAL.csproj package MongoDB.Driver -v {VERSION}
```

### Referencia DAL en API

Nuestra API debe ser capaz de consumir nuestro proyecto DAL.

```bash
dotnet add Sample.API/Sample.API.csproj reference Sample.DAL/Sample.DAL.csproj
```

### Estructura del paquete DAL

Nuestro paquete _DAL_ tendrá la siguiente estructura. En el directorio `Mongo`, escribiremos código necesario para conectarnos a la base de datos y para proveer un ancla en nuestro proyecto, el API. Por otro lado, el directorio `Repository` albergará código necesario por consumir datos de cada colección.

```
├ Sample.DAL
│ ├ Mongo
| | ├ Extensions
| | ├ Connection
│ ├ Repository
| | ├ Managers
| | ├ IServices
| ├ Entidades // Podríamos crear un tercer proyecto apartir de este directorio, por simplicidad lo dejaremos aquí.
```

Empecemos por crear los dos directorios con mayor jerarquía en este proyecto.

```bash
mkdir Sample.DAL/Mongo && mkdir Sample.DAL/Repository && mkdir Sample.DAL/Entidades
```

Y luego todos los demás.

```bash
mkdir Sample.DAL/Mongo/Extensions && mkdir Sample.DAL/Mongo/Connections \
&& mkdir Sample.DAL/Repository/Managers && mkdir Sample.DAL/Repository/IServices
```

### MongoDB, Connección e Interfaz

Empezamos por la configuración, el par de archivos `IMongoSettings.cs` y `MongoSettings.cs` nos ayudará a contener el nombre de la base de datos y la cadena de conección.

```csharp title="Sample.DAL/Mongo/Connections/IMongoSettings.cs"
namespace Sample.DAL.Mongo.Connections
{
    public interface IMongoSettings
    {
        public string DatabaseName { get; set; }
        public string ConnectionString { get; set; }
    }
}
```

```csharp title="Sample.DAL/Mongo/Connections/MongoSettings.cs"
namespace Sample.DAL.Mongo.Connections
{
    public class MongoSettings : IMongoSettings
    {
        public string DatabaseName { get; set; }
        public string ConnectionString { get; set; }
    }
}
```

Conforme la base de datos crezca, cada colección estará formada de propiedades con un significado específico. Es muy importante mantener un modelo de cada colección en la base datos. En C#, esto lo lograremos creando una clase que refleje los miembros de cada colección y nos permita manipular estos datos de manera sencilla.

A pesar de que estos modelos pueden variar muchísimo uno del otro, con MongoDB tenemos la certeza de que siempre existirá una propiedad `_id` en cada colección. Propia de cómo MongoDB organiza los datos. Es por esto que el siguiente paso en el desarrollo de la DAL es crear un _tipo de dato_ que asuma la existencia de esta propiedad y nos de la pauta de identificar un modelo de cualquier otro tipo de dato.

```csharp title="Sample.DAL/Entidades/IDocument.cs"
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Sample.DAL.Entidades
{
    public interface IDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public ObjectId Id { get; set; }

        public DateTimeOffset CreatedOn { get; }
    }
}
```

```csharp title="Sample.DAL/Entidades/Document.cs"
using System;
using MongoDB.Bson;

namespace Sample.DAL.Entidades
{
    public abstract class Document : IDocument 
    {
        public ObjectId Id { get; set; }

        public DateTimeOffset CreatedOn => Id.CreationTime.ToLocalTime();
    }
}
```

Una pieza crítica del patrón de repositorio es el poder definir una plantilla de los métodos y propiedades que serán necesarios para poder consultar o persistir datos en cada colección de MongoDB. Para eso, definimos la interfaz `IMongoRepository<TDocument>`. En ella, daremos forma a nuestro repositorio de datos.

```csharp title="Sample.DAL/Mongo/Connections/IMongoRepository.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using Sample.DAL.Entidades;

namespace Sample.DAL.Mongo.Connections
{
    public interface IMongoRepository<TDocument> where TDocument : IDocument
    {
        // highlight-start
        IQueryable<TDocument> AsQueryable();

        IEnumerable<TDocument> FilterBy(
            Expression<Func<TDocument, bool>> filterExpression);

        IEnumerable<TProjected> FilterBy<TProjected>(
            Expression<Func<TDocument, bool>> filterExpression,
            Expression<Func<TDocument, TProjected>> projectionExpression);

        TDocument FindOne(Expression<Func<TDocument, bool>> filterExpression);

        Task<TDocument> FindOneAsync(Expression<Func<TDocument, bool>> filterExpression);

        TDocument FindById(string id);

        Task<TDocument> FindByIdAsync(string id);
        
        IEnumerable<TDocument> Find();

        Task<IEnumerable<TDocument>> FindAsync();

        void InsertOne(TDocument document);

        Task InsertOneAsync(TDocument document);

        void InsertMany(ICollection<TDocument> documents);

        Task InsertManyAsync(ICollection<TDocument> documents);

        void ReplaceOne(TDocument document);

        Task ReplaceOneAsync(TDocument document);

        void DeleteOne(Expression<Func<TDocument, bool>> filterExpression);

        Task DeleteOneAsync(Expression<Func<TDocument, bool>> filterExpression);

        void DeleteById(string id);

        Task DeleteByIdAsync(string id);

        void DeleteMany(Expression<Func<TDocument, bool>> filterExpression);

        Task DeleteManyAsync(Expression<Func<TDocument, bool>> filterExpression);
        // highlight-end
    }
}
```

Antes de implementar la plantilla, crearemos un atributo que nos permitirá definir el nombre de la colección para nuestro repositorio.

```csharp
using System;

namespace Sample.DAL.Mongo.Connections
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false)]
    public class BsonCollectionAttribute : Attribute
    {
        public string CollectionName { get; }

        public BsonCollectionAttribute(string collectionName)
        {
            this.CollectionName = collectionName;
        }
    }
}
```

Ya que tenemos este atributo y la plantilla, es hora de implementarla. Vamos a empezar por el `constructor` que es dónde configuraremos la conexión a la base de datos.

```csharp title="Sample.DAL/Mongo/Connections/MongoRepository.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Sample.DAL.Mongo.Settings;

using Identity.Entities.Utils.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Sample.DAL.Mongo.Connections
{
    public class MongoRepository<TDocument> : IMongoRepository<TDocument> where TDocument : IDocument
    {
        // highlight-start
        private readonly IMongoCollection<TDocument> _collection;

        /* 
         * Setups connection to MongoDB
         *
         **/
        public MongoRepository(IMongoSettings settings)
        {
            // Aplica la nomenclatura `camelCase` al momento de parsear el Modelo
            ConventionRegistry.Register("camelCase", new ConventionPack {new CamelCaseElementNameConvention()}, t => true);
            
            // Configura un MongoClient y la conección a la base de datos
            var client = new MongoClient(settings.ConnectionString);  // mongodb://mariomenjr:mariomenjr@localhost:27017/sample
            var database = client.GetDatabase(settings.DatabaseName); // sample
            
            // Configura el manejador de la colección
            var collectionName = this.GetCollectionName(typeof(TDocument));
            this._collection = database.GetCollection<TDocument>(collectionName);
        }

        /* 
         * Gets the collection name from a Model
         *
         **/
        private protected string GetCollectionName(Type documentType)
        {
            return ((BsonCollectionAttribute) documentType.GetCustomAttributes(
                    typeof(BsonCollectionAttribute),
                    true)
                .FirstOrDefault())?.CollectionName;
        }
        // highlight-end
        // ...
    }
}
```

Una vez tenemos la conexión configurada, es hora de cubrir los métodos de interacción con la base de datos. Nos referimos al CRUD. Crear, leer, actualizar y eliminar, por sus siglas en inglés.

```csharp title="Sample.DAL/Mongo/Connections/MongoRepository.cs"
        // ...
        // highlight-start
        public virtual IQueryable<TDocument> AsQueryable()
        {
            return _collection.AsQueryable();
        }

        public virtual IEnumerable<TDocument> FilterBy(
            Expression<Func<TDocument, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).ToEnumerable();
        }

        public virtual IEnumerable<TProjected> FilterBy<TProjected>(
            Expression<Func<TDocument, bool>> filterExpression,
            Expression<Func<TDocument, TProjected>> projectionExpression)
        {
            return _collection.Find(filterExpression).Project(projectionExpression).ToEnumerable();
        }

        public virtual TDocument FindOne(Expression<Func<TDocument, bool>> filterExpression)
        {
            return _collection.Find(filterExpression).FirstOrDefault();
        }

        public virtual Task<TDocument> FindOneAsync(Expression<Func<TDocument, bool>> filterExpression)
        {
            return Task.Run(() => _collection.Find(filterExpression).FirstOrDefaultAsync());
        }

        public virtual TDocument FindById(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
            return _collection.Find(filter).SingleOrDefault();
        }

        public virtual Task<TDocument> FindByIdAsync(string id)
        {
            return Task.Run(() =>
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
                return _collection.Find(filter).SingleOrDefaultAsync();
            });
        }

        public virtual IEnumerable<TDocument> Find()
        {
            return _collection.Find(Builders<TDocument>.Filter.Empty).ToList();
        }

        public virtual Task<IEnumerable<TDocument>> FindAsync()
        {
            return Task.Run(() =>
            {
                return _collection.Find(Builders<TDocument>.Filter.Empty).ToListAsync().ContinueWith(task => task.Result.AsEnumerable());
            });
        }

        public virtual void InsertOne(TDocument document)
        {
            _collection.InsertOne(document);
        }

        public virtual Task InsertOneAsync(TDocument document)
        {
            return Task.Run(() => _collection.InsertOneAsync(document));
        }

        public void InsertMany(ICollection<TDocument> documents)
        {
            _collection.InsertMany(documents);
        }

        public virtual async Task InsertManyAsync(ICollection<TDocument> documents)
        {
            await _collection.InsertManyAsync(documents);
        }

        public void ReplaceOne(TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, document.Id);
            _collection.FindOneAndReplace(filter, document);
        }

        public virtual async Task ReplaceOneAsync(TDocument document)
        {
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, document.Id);
            await _collection.FindOneAndReplaceAsync(filter, document);
        }

        public void DeleteOne(Expression<Func<TDocument, bool>> filterExpression)
        {
            _collection.FindOneAndDelete(filterExpression);
        }

        public Task DeleteOneAsync(Expression<Func<TDocument, bool>> filterExpression)
        {
            return Task.Run(() => _collection.FindOneAndDeleteAsync(filterExpression));
        }

        public void DeleteById(string id)
        {
            var objectId = new ObjectId(id);
            var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
            _collection.FindOneAndDelete(filter);
        }

        public Task DeleteByIdAsync(string id)
        {
            return Task.Run(() =>
            {
                var objectId = new ObjectId(id);
                var filter = Builders<TDocument>.Filter.Eq(doc => doc.Id, objectId);
                _collection.FindOneAndDeleteAsync(filter);
            });
        }

        public void DeleteMany(Expression<Func<TDocument, bool>> filterExpression)
        {
            _collection.DeleteMany(filterExpression);
        }

        public Task DeleteManyAsync(Expression<Func<TDocument, bool>> filterExpression)
        {
            return Task.Run(() => _collection.DeleteManyAsync(filterExpression));
        }
        // highlight-end
    }
}
```

Con esto, tenemos listo el esqueleto de nuestro repositorio de datos. El siguiente paso es aplicarlo a cada colección.

### Entidades

Para poder crear un repositorio, necesitamos los modelos. En nuestro caso, solo tenemos una colección por lo qué solo crearemos un modelo.

```csharp title="Sample.DAL/Entidades/User.cs"
using Sample.DAL.Mongo.Connections;

namespace Sample.DAL.Entidades
{
    [BsonCollection("users")]
    public partial class User : Document
    {
        public string Username { get; set; }
    }
}
```

### IService y Manager

Para terminar de configurar nuestro repositorio basta con aplicar lo qué ya escribimos en el archivo `Sample.DAL/Mongo/Connections/MongoRepository.cs` a cada colección. Es aquí dónde definiremos el cómo accederemos o modificaremos la base de datos. Cómo buena práctica, crearemos para cada colección una plantilla y una implementación, o en otras palabras un `IService` y un `Manager`.

En nuestra base de datos de MongoDB solo tenemos una colección, por lo qué será muy sencillo implementar este par.

```csharp title="Sample.DAL/Repository/IServices/IUserService.cs"
using Sample.DAL.Entidades;
using Sample.DAL.Mongo.Connections;

namespace Sample.DAL.Repository.IServices
{
    public interface IUserService : IMongoRepository<User>
    {}
}
```

```csharp title="Sample.DAL/Repository/Managers/UsersManager.cs"
using Sample.DAL.Entidades;
using Sample.DAL.Mongo.Connections;
using Sample.DAL.Repository.IServices;

namespace Sample.DAL.Repository.Managers
{
    public class UserManager : MongoRepository<User>, IUserService
    {
        public UserManager(IMongoSettings settings) : base(settings)
        {}
    }
}
```

## Dependency Injection

Antes de configurar la inyección de dependencias tenemos que instalar un paquete de extensiones para la configuración. El paquete se encuentra en el repositorio de NuGet. Revisa cuál es la última versión disponible en este [enlace](https://www.nuget.org/packages/Microsoft.Extensions.Options.ConfigurationExtensions/) y ejecuta el siguiente comando. 

```bash
dotnet add Sample.DAL/Sample.DAL.csproj package Microsoft.Extensions.Options.ConfigurationExtensions --version {VERSION}
```

Llegó la hora de crear una extensión propia de nuestro paquete. Dejaremos toda la complejidad aquí, y en nuestra API simplemente llamaremos a un método.

```csharp title="Sample.DAL/Mongo/Extensions/MongoExtension.cs"
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Sample.DAL.Mongo.Connections;
using Sample.DAL.Repository.IServices;
using Sample.DAL.Repository.Managers;

namespace Sample.DAL.Mongo.Extensions
{
    public static class MongoExtension
    {
        public static IServiceCollection AddMongoDb(this IServiceCollection services, IConfigurationSection mongoSettings)
        {
            services.Configure<MongoSettings>(mongoSettings);
            
            services.AddSingleton<IMongoSettings>(srvProvider =>
                srvProvider.GetRequiredService<IOptions<MongoSettings>>().Value);
            
            services.AddTransient<IUserService, UserManager>();

            return services;
        }
    }
}
```

Y en nuestra API, configuramos lo siguiente:

```csharp title="Sample.API/Startup.cs"
    // ...
    public void ConfigureServices(IServiceCollection services)
    {
        // highlight-start
        services.AddMongoDb(Configuration.GetSection("MongoSettings"));
        // highlight-end
        // ...
```

Para que lo anterior tenga sentido, agregamos esto al archivo `appsettings.json`.

```json
  // ...
  // highlight-start
  "MongoSettings": {
    "ConnectionString": "mongodb://mariomenjr:mariomenjr@localhost:27017/sample",
    "DatabaseName": "sample"
  }
  // highlight-end
```

> Por ningún motivo debemos compartir estas credenciales en algún controlador de version público. Para un proyecto, recomiendo leer sobre [`secrets.json`](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-5.0)

Por último, inyectamos la dependencia en el API.

```csharp title="Sample.API/Controllers/ApiController.cs"
// ...
namespace Sample.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        // highlight-start
        private readonly IUserService _userService;
        
        public ApiController(IUserService userService)
        {
            this._userService = userService;
        }
        // highlight-end
        // ...
```

## CRUD

Una vez hemos implementado el patrón de repositorio para acceder y persistir datos, un CRUD es tan sencillo como lo siguiente.

```csharp
        // ...
        // highlight-start
        [HttpGet, Route("[action]")]
        public JsonResult GetUsers()
        {
            return new JsonResult(this._userService.Find());
            // highlight-end

            // Este es el código que nos permitió consultar la lista de usuario al inicio del Post.
            // Ya no lo necesitamos y podemos borrarlo.

            var client = new MongoClient("mongodb://mariomenjr:mariomenjr@localhost:27017/sample");
            var database = client.GetDatabase("sample");
            
            var users = database.GetCollection<object>("users");
            
            return new JsonResult(users.AsQueryable().Select(s => s));
            // highlight-start
        }

        [HttpPost, Route("[action]")]
        public JsonResult AddUser(string username)
        {
            var newUser = new User {Username = username};
            this._userService.InsertOne(newUser);
            
            return new JsonResult(newUser);
        }
        
        [HttpPut, Route("[action]")]
        public JsonResult UpdateUser(string oldUsername, string newUsername)
        {
            var user = this._userService.FindOne(x => x.Username == oldUsername);
            user.Username = newUsername;
            
            this._userService.ReplaceOne(user);
            
            return new JsonResult(user);
        }
        
        [HttpDelete, Route("[action]")]
        public JsonResult DeleteUser(string username)
        {
            this._userService.DeleteOne(x => x.Username == username);
            
            return new JsonResult(username);
        }
        // highlight-end
        //...
```

Listo, ya tenemos una interfaz para consultar y persistir datos en la colección _Users_.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/007/007-crud.png').default} alt="CRUD" />
  <figcaption>CRUD para colección Users</figcaption>
</figure>

## Conclusión

Espero que este post te haya sido de mucha ayuda. Después de implementar el patrón de repositorio, es muy sencillo escalar cualquier consulta a la base de datos. No necesitamos conocer ningún detalle de conección, ya que eso es manejado propiamente por esta nueva capa.

La ventaja de esto es que si la base de datos sufre algún cambio, no debemos ir a cada parte de la aplicación para implementarlos. Únicamente nuestro paquete DAL sufrirá los cambios. Reduciendo ambos el tiempo de programación y pruebas.

## Referencias

- [MongoDB C#/.NET Driver](https://docs.mongodb.com/drivers/csharp/)
- [The WHY Series: Why should you use the repository pattern?](https://makingloops.com/why-should-you-use-the-repository-pattern/)
- [Quick Start: C# and MongoDB - Read Operations](https://www.mongodb.com/blog/post/quick-start-c-and-mongodb--read-operations)
- [Tutorial: Create a .NET class library using Visual Studio Code](https://docs.microsoft.com/en-us/dotnet/core/tutorials/library-with-visual-studio-code)