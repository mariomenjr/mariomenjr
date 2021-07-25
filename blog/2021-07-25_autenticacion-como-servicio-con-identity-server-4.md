---
slug: 2021/07/10/autenticacion-como-servicio-con-identity-server-4
title: "Autenticación como servicio con Identity Server 4"
author: Mario Menjívar
author_title: Software Engineer
author_url: https://github.com/mariomenjr
author_image_url: https://avatars3.githubusercontent.com/u/1946936?s=460&v=4
tags: [oauth2.0,openid,csharp,identity server,nodejs]
keywords: [oauth en español,oauth 2.0,identity server,bearer token,credentials,openid,español,como proteger api,como proteger api con identity server,como proteger api oauth,como proteger api nodejs]
date: 2021-07-25T10:21:18.000-07:00
description: "En esta entrada, hablaremos de quizá la más conocida implementación de los protocolos OpenID Connect y OAuth 2.0 para .NET Core: Identity Server 4. En específico cómo proteger tus APIs con en Node.js"
image: "https://images.unsplash.com/photo-1539039374392-54032a683b1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
draft: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Antes de comenzar debemos hacer una distinción muy importante. Autenticar y autorizar son dos aspectos completamente independientes pero centrales a la seguridad. Auténticar se refiere a confirmar que los usuarios son quienes dicen ser. Autorizar, por otro lado, es dar acceso a los recursos a esos usuarios.

En esta entrada, hablaremos de quizá la más conocida implementación de los protocolos OpenID Connect y OAuth 2.0 para .NET Core: Identity Server 4. En específico cómo proteger tus APIs con en Node.js.

<!--truncate-->

## OAuth 2.0 + OpenID

Lo más seguro es que en algún momento hayas visto una página como esta:

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-25/001-google-oauth.png').default} alt="Google OAuth Sample" />
  <figcaption>Este es un ejemplo de una implementación de OAuth y OpenID que tiene como objetivo permitir que Medium pueda utilizar tu cuenta de Google para loguearte. Sin embargo, para lograrlo, Medium debe pedirte permiso para acceder a ciertos datos de tu perfil de Google con los cuáles puede identificar tu cuenta.</figcaption>
</figure>

OAuth 2.0 y OpenID conforman el estándar de la industria para llevar a cabo este importante proceso de auténticar y autorizar usuarios. Más que aplicaciones o servicios que puedan ser instalados, ambos son estándares abiertos de autorización y autenticación que pueden ser implementados por cualquiera.

### Client Credentials

OAuth 2.0 + OpenID nos permite cubrir distintos escenarios de autorización. Estos son conocidas como _Flows_ y son las formas en las que OAuth 2.0 puede proveer un _token_. Por ejemplo, una aplicación pidiendo al usuario confirmación para accesar cierta información, como en la imagen.

En este post, nos enfocaremos en una: _Client Credentials_.

También conocida como autorización server a server, este _Flow_ nos permite autorizar y auténticar un App (mejor conocido como _Client_) en lugar de a un usuario. Para conseguirlo, cada App (o _Client_) utiliza un _Client ID_ y un _Client Secret_ para auténticarse con el servidor y obtener un _Token_.

## Identity Server 4

_In a nutshell_, Identity Server 4 es un framework de OAuth 2.0 y OpenID para ASP.NET Core. Está certificado por la [OpenID Foundation](https://openid.net/). Es quizá la más conocida implementación de OAuth 2.0 y OpenID para .NET Core, permite las siguientes features:

- Autenticación como servicio
- Single Sign-on/Sign-out
- Control de acceso para APIs
- Federation Gateaway
- Enfoque en personalización
- Código abierto maduro
- Soporte comercial y gratuito

Puedes probar un demo online ahora mismo en [identity.mariomenjr.com](https://identity.mariomenjr.com). Para obtener un `bearer token` basta con ejecutar el siguiente comando en una línea de comandos, por ejemplo.

<Tabs
  groupId="demos-mariomenjr-bearer-token"
  defaultValue="curl"
  values={[
    {label: 'cURL', value: 'curl'},
    {label: 'wget', value: 'wget'},
  ]
}>
<TabItem value="curl">

```bash
curl --location --request POST 'https://identity.mariomenjr.com:443/connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=test.client' \
--data-urlencode 'client_secret=test.secret' \
--data-urlencode 'scope=test.scope' \
--data-urlencode 'grant_type=client_credentials'
```

</TabItem>
<TabItem value="wget">

```bash
wget --no-check-certificate --quiet \
  --method POST \
  --timeout=0 \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --body-data 'client_id=test.client&client_secret=test.secret&scope=test.scope&grant_type=client_credentials' \
   'https://identity.mariomenjr.com:443/connect/token'
```

</TabItem>
</Tabs>

En cualquier caso, obtendrás un JSON como respuesta:

```json
{"access_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IkRCRkM5QUY5QURCMTU2REVDMDI5REQ0MjdFREVDRTNFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2MjY1NzcxNTEsImV4cCI6MTYyNjU4MDc1MSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5tYXJpb21lbmpyLmNvbSIsImF1ZCI6WyJjb250aW51ZWUuYXBpIiwidGVzdC5hcGkiXSwiY2xpZW50X2lkIjoidGVzdC5jbGllbnQiLCJqdGkiOiIwOTRBQjkwNEEyQjQzN0ZDOUEzQjc4Q0ZCRjM2M0UyNCIsImlhdCI6MTYyNjU3NzE1MSwic2NvcGUiOlsidGVzdC5zY29wZSJdfQ.P9Ku7YkVL-SymVYpqUj9xnAK8Y_1msKHqAt42BbNdebLb_QWHGtIpgbgaMZpOh0j5-Kl4iNPeSYI0920LoFj__GymaGvqzFnJ1tuEJ-cafJUenmbIVadx6-UsfR8o91oznuMtmoWXeAWieX5cEt-f3Qr4IKJ2Jr5_-r99haN1m3yuE8aAJncz9O-eLQ0hmS8EjQQ62PYQbThdmzmtlYm5A33IYKxJsN8HjRsYTDC-6XvEKkBfT8CqEEMj06lBpfT67pi0iU7WmVCqaSl60Vk828b74WEj4c7P-6rRP7kCoqkfTzr_2D0OtoOxzCye4GswAaatSAdVDQbJ9xkfc4_kw","expires_in":3600,"token_type":"Bearer","scope":"test.scope"}
```

### Instalación 

Para empezar a trabajar con este framework, debemos instalarlo. Esto lo podemos hacer a través de Visual Studio (Windows o Mac) ó con el comando **dotnet** en la terminal (Linux).

Una forma fácil de empezar es instalando localmente las distintas plantillas provista por sus creadores.

<!-- TODO: Include Tab for Visual Studio -->

<Tabs
  groupId="operating-systems"
  defaultValue="cli"
  values={[
    {label: 'Command Line Interface', value: 'cli'},
  ]
}>
<TabItem value="cli">

```bash 
dotnet new -i IdentityServer4.Templates
```

Verás el siguiente mensaje.


> Welcome to .NET 5.0! <br />
> \--------------------- <br />
> SDK Version: 5.0.204  <br />
> 
> \---------------- <br />
> Installed an ASP.NET Core HTTPS development certificate. <br />
> To trust the certificate run 'dotnet dev-certs https --trust' (Windows and macOS only).  <br />
> Learn about HTTPS: https://aka.ms/dotnet-https <br />
> \---------------- <br />
> Write your first app: https://aka.ms/dotnet-hello-world  <br />
> Find out what's new: https://aka.ms/dotnet-whats-new  <br />
> Explore documentation: https://aka.ms/dotnet-docs  <br />
> Report issues and find source on GitHub: https://github.com/dotnet/core  <br />
> Use 'dotnet --help' to see available commands or visit: https://aka.ms/dotnet-cli  <br />
> \-------------------------------------------------------------------------------------- <br />
> Getting ready...  <br />
>   Determining projects to restore...  <br />
>   Restored /home/mariomenjr/.templateengine/dotnetcli/v5.0.204/scratch/restore.csproj  <br />
> (in 5.32 sec).


</TabItem>
</Tabs>

Una vez instalado, escogemos la plantilla vacía: `is4empty`.

<Tabs
  groupId="operating-systems"
  defaultValue="cli"
  values={[
    {label: 'Command Line Interface', value: 'cli'},
  ]
}>
<TabItem value="cli">

Creamos un nuevo folder para nuestro proyecto.

```bash 
md Identity && cd Identity
```

Creamos un nuevo proyecto apartir de una de la plantilla vacía.

```bash
dotnet new is4empty -n Identity.API
```

El cuál mostrará el siguiente mensaje.

> The template "IdentityServer4 Empty" was created successfully.

</TabItem>
</Tabs>

Finalmente, crearemos una solución para nuestra plantilla. Para eso necesitamos ejecutar los siguientes comandos.

<Tabs
  groupId="operating-systems"
  defaultValue="cli"
  values={[
    {label: 'Command Line Interface', value: 'cli'},
  ]
}>
<TabItem value="cli">

Creamos la solución.

```bash
dotnet new sln -n Identity
```

Para luego añadir nuestro proyecto a esta solución.

```bash
dotnet sln add Identity.API/Identity.API.csproj
```

Así, recibiremos el siguiente mensaje.

> Project `Identity.API/Identity.API.csproj` added to the solution.

Por último, ejecutamos el comando de restauración. Esto instalará cualquier dependencia faltante.

```bash
dotnet restore
```

</TabItem>
</Tabs>

### dotnet --version

Por defecto, la version de .NET Core para la que están configuradas las plantillas es la 3.1. Sin embargo, la última versión de .NET al día de hoy es la 5 y es muy probable que sea la que tengas instalada. Para no tener ningún problema al ejecutar el proyecto, basta con cambiar la versión a la que apunta.

```xml
<!-- Identity.API/Identity.API.csproj -->

<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    // highlight-start
    <!-- <TargetFramework>netcoreapp3.1</TargetFramework> -->
    <TargetFramework>net5.0</TargetFramework>
    // highlight-end
  </PropertyGroup>
  
  <ItemGroup>
    <PackageReference Include="IdentityServer4" Version="4.0.0" />

    <PackageReference Include="Serilog.AspNetCore" Version="3.2.0" />
  </ItemGroup>
</Project>
```

Y ya lo tienes. Si ejecutas el proyecto ya deberías ver el [Discovery Document](https://localhost:5001/.well-known/openid-configuration).

// TODO: ¿Qué es un discovery document?

<Tabs
  groupId="operating-systems"
  defaultValue="cli"
  values={[
    {label: 'Command Line Interface', value: 'cli'},
  ]
}>
<TabItem value="cli">

```bash 
dotnet run --project Identity.API
```

</TabItem>
</Tabs>

### Scopes + Clients

Un `scope` es un recurso en tu sistema que quieres proteger. Con Identity Server 4, podemos definir recursos de varias maneras. Desde código hasta bases de datos. En este ejemplo, los definiremos por código.

```csharp title="Identity.API/Config.cs"

// ...
public static IEnumerable<ApiScope> ApiScopes =>
    new ApiScope[]
    {
        // highlight-start 
        new ApiScope("testApi", "Test API")
        // highlight-end
    };
// ...
```

Lo siguiente en la lista es una aplicación cliente que consuma nuestro servicio de autenticación.

En este aso, el cliente no tendrá un uso interactivo por parte del usuario sino que se autenticará usando el flow _Client Credentials_ con Identity Server.

```csharp title="Identity.API/Config.cs"

// ...
public static IEnumerable<Client> Clients =>
    new Client[] 
    { 
        // highlight-start 
        new Client
        {
            ClientId = "testClient",

            // no interactive user, use the clientid/secret for authentication
            AllowedGrantTypes = GrantTypes.ClientCredentials,

            // secret for authentication
            ClientSecrets =
            {
                new Secret("testSecret".Sha256())
            },

            // scopes that client has access to
            AllowedScopes = { "testApi" }
        }
        // highlight-end 
    };
// ...
```

Con esto, ya podemos conseguir un `bearer token` desde nuestro proyecto.

<Tabs
  groupId="demos-mariomenjr-bearer-token"
  defaultValue="curl"
  values={[
    {label: 'cURL', value: 'curl'},
    {label: 'wget', value: 'wget'},
  ]
}>
<TabItem value="curl">

```
curl --insecure --location --request POST 'https://localhost:5001/connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=testClient' \
--data-urlencode 'client_secret=testSecret' \
--data-urlencode 'scope=testApi' \
--data-urlencode 'grant_type=client_credentials'
```

</TabItem>
<TabItem value="wget">

```bash
wget --no-check-certificate --quiet \
  --method POST \
  --timeout=0 \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --body-data 'client_id=testClient&client_secret=testSecret&scope=testApi&grant_type=client_credentials' \
   'https://localhost:5001/connect/token'
```

</TabItem>
</Tabs>

### Username + Password

// TODO

<!-- ## Cuándo + Porqué

En un mundo dónde existen Amazon Cognito, Okta, Google Cloud Identity, entre otros, ¿Por qué implementaría un Identity Server por mi cuenta? -->

<!-- ## Identity Server 4 License -->

## Preparar un API

Si has llegado hasta aquí, ¡Felicidades! ya tienes un servicio de autenticación funcional. En caso hayas llegado directo hasta aquí, deberías revisar lo de arriba. De todas formas, vamos a empezar lo bueno.

En realidad podríamos usar casi cualquier lenguaje y librería que nos permita construir APIs. En esta entrada, utilizaremos NodeJS y ExpressJS, ya que son parte de los stacks más populares actualmente.

Si no tienes nodejs en tu computadora, puedes descargar el instalador desde aquí: https://nodejs.org/en/download/. Si estás en Linux, y dependiendo del distro, puedes encontrarlo en los repositorios de paquetes como `nodejs`.

### ExpressJS

En las siguientes líneas, te muestro como hacer una instalación de ExpressJS y a levantar una API en menos de 5 minutos.

Creamos el folder del nuevo proyecto.

```bash
md protected-api && cd protected-api
```

Creamos un nuevo proyecto con NPM.

```bash
npm init -y
```

Instalamos ExpressJS.

```bash
npm install express --save
```

Solo nos queda crear un archivo `app.js` y hacer unas pequeñas modificaciones en el existente `package.json`.

```js title="app.js"
const express = require('express');
const app = express();
const port = 3005;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
```

```json title="package.json"
// ...
  // highlight-start 
  // "main": "index.js",
  "main": "app.js",
  // highlight-end
  "scripts": {
    // highlight-start 
    // "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "node app.js"
    // highlight-end
  },
  "keywords": [],
// ...
```

Y ahora podemos arrancar el API.

```bash
npm run dev
```

>  \> protected-api@1.0.0 dev /home/mariomenjr/Samples/protected-api <br />
>  \> node app.js
>
>  App listening at http://localhost:3005

### JWKS

Un JSON Web Key Set (ó Conjunto de llaves JSON Web, en español) es un conjunto de llaves que contienen la llave pública que debe ser usada para verificar cualquier JSON  Web Token (`JWT`, ó `bearer token`) que fue emitido por un servidor de autorización y firmado por uno de los algoritmos RSA o ECDSA.

En palabras más simples, lo anterior nos dice que una de las formas para auténticar que nuestro `bearer token` es legítimo es hacer uso de un `JWKS`. Nuestra instalación de Identity Server ya nos provee un endpoint para conseguir uno: [https://localhost:5001/.well-known/openid-configuration/jwks](https://localhost:5001/.well-known/openid-configuration/jwks).

Para hacer uso de él desde nuestra API en nodejs, vamos a instalar los siguientes paquetes:

```bash
npm install express-jwt jwks-rsa --save
```

Una vez instalados, es hora de crear un middleware para ayudarnos a autenticar nuestra API.

Creamos el archivo `auth.middleware.js` dentro del folder `src/middlewares`.

```bash
md src/middlewares && cd src/middlewares && touch auth.middleware.js
```

En este archivo, configuraremos los paquetes `express-jwt` y `jwks-rsa` para obtener una función que nos permita auténticar rutas específicas.

```js title="src/middlewares/auth.middleware.js"
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// For simplicity, we've hardcoded these values here.
// However, you must keep these values a secret. 
// Do not commit them to Git.
// I highly recommend to use the dot-env package.
const IDENTITY_ISSUER = `https://localhost:5001`;
const IDENTITY_AUDIENCE = `testApi`; // The API Scope at Identity Server

console.info(`[issuer]: ${IDENTITY_ISSUER}`);

const authorize = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${IDENTITY_ISSUER}/.well-known/openid-configuration/jwks`,
  }),
  audience: `${IDENTITY_AUDIENCE}`,
  issuer: `${IDENTITY_ISSUER}`,
  algorithms: [`RS256`],
});

module.exports = authorize;
```

```js title="app.js"
const express = require('express');
const app = express();
const port = 3005;

// highlight-start 
const authorize = require("./src/middlewares/auth.middleware");
// highlight-end

app.get(`/`, (req, res) => {
  res.send(`Hello World!`);
});

// highlight-start 
// To be available by anyone
app.get(`/allow-anonymous`, (req, res) => {
  res.send(`No token needed to see this message!`);
});

// To be available only for those with a bearer token
app.get(`/authorization-needed`, authorize, (req, res) => {
  res.send(`A bearer token was needed to see this message!`);
});
// highlight-end

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
```

¡Genial! Ahora si accedemos a esos endpoints desde el navegador, veremos que únicamente `/allow-anonymous` nos devuelve el mensaje que hemos escrito mientras que `/authorization-needed` nos devuelve un `UnauthorizedError`.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-25/002-api-allow-anonymous.png').default} alt="Allow Anonymous Endpoint" />
  <figcaption>http://localhost:3005/allow-anonymous</figcaption>
</figure>

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-25/003-api-authorization-needed.png').default} alt="Authorization Needed Endpoint" />
  <figcaption>http://localhost:3005/authorization-needed</figcaption>
</figure>

Pero aún nos falta responder a un par de preguntas. Primero, ¿Cómo hago para hacer llegar el `bearer token` al endpoint `authorization-needed`? y segundo, más importante aún, ¿Cómo obtengo un `bearer token`?

### Bearer token

// TODO

## Conclusión

## Referencias

- [Authentication vs. Authorization](https://www.okta.com/identity-101/authentication-vs-authorization/)
- [What is OAuth 2.0?](https://auth0.com/intro-to-iam/what-is-oauth-2/)
- [Authentication and Authorization Flows](https://auth0.com/docs/flows)
- [Identity Server 4: The Big Picture](https://identityserver4.readthedocs.io/en/latest/intro/big_picture.html)
- [JKWS by IBM](https://www.ibm.com/docs/en/sva/10.0.1?topic=applications-jwks)