---
slug: 2021/07/29/autenticacion-como-servicio-con-identity-server-4
title: "Autenticación como servicio con Identity Server 4"
author: Mario Menjívar
author_title: Software Engineer
author_url: https://github.com/mariomenjr
author_image_url: https://avatars3.githubusercontent.com/u/1946936?s=460&v=4
tags: [oauth2.0,openid,csharp,identity server,nodejs]
keywords: [oauth 2.0,validar bearer token nodejs,openid,español,que es identity server,como proteger api con identity server,como proteger api jwt,como proteger api nodejs,implementar autenticacion jwt react,que es bearer token,autenticando api rest con nodejS y jwt,implementar JSON web token,como implementar autenticacion basada en token,autenticacion y autorizacion,que es jwks]
date: 2021-07-29T23:31:18.000-07:00
description: "En esta entrada, hablaremos de quizá la más conocida implementación de los protocolos OpenID Connect y OAuth 2.0 para .NET Core: Identity Server 4. Te mostraré cómo implementarlo y consumir sus servicios de autorización/autenticación para asegurar una SPA junto con una API en NodeJS."
image: "https://images.unsplash.com/photo-1532604146921-0e8bd9ab0891?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"
draft: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Antes de comenzar debemos hacer una distinción muy importante. Autenticar y autorizar son dos aspectos completamente independientes pero centrales a la seguridad. Auténticar se refiere a confirmar que los usuarios son quienes dicen ser. Autorizar, por otro lado, es dar acceso a los recursos a esos usuarios.

En esta entrada, hablaremos de quizá la más conocida implementación de los protocolos OpenID Connect y OAuth 2.0 para .NET Core: Identity Server 4. Te mostraré cómo implementarlo y consumir sus servicios de autorización/autenticación para asegurar una SPA junto con una API en NodeJS.

<!--truncate-->

## OAuth 2.0 + OpenID

Lo más seguro es que en algún momento hayas visto una página como esta:

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-29/001-google-oauth.png').default} alt="Google OAuth Sample" />
  <figcaption>Este es un ejemplo de una implementación de OAuth y OpenID que tiene como objetivo permitir que Medium pueda utilizar tu cuenta de Google para loguearte. Sin embargo, para lograrlo, Medium debe pedirte permiso para acceder a ciertos datos de tu perfil de Google con los cuáles puede identificar tu cuenta.</figcaption>
</figure>

OAuth 2.0 y OpenID conforman el estándar de la industria para llevar a cabo este importante proceso de auténticar y autorizar usuarios. Más que aplicaciones o servicios que puedan ser instalados, ambos son estándares abiertos de autorización y autenticación que pueden ser implementados por cualquiera.

## Identity Server 4

_In a nutshell_, Identity Server 4 es un framework de OAuth 2.0 y OpenID para ASP.NET Core. Está certificado por la [OpenID Foundation](https://openid.net/). Es quizá la más conocida implementación de OAuth 2.0 y OpenID para .NET Core, permite las siguientes features:

- Autenticación como servicio
- Single Sign-on/Sign-out
- Control de acceso para APIs
- Federation Gateaway
- Enfoque en personalización
- Código abierto maduro
- Soporte comercial y gratuito

Puedes probar un demo online ahora mismo en [identity.mariomenjr.com](https://identity.mariomenjr.com) (soporta únicamente el client-credentials grant, por el momento). Para obtener un `bearer token` basta con ejecutar el siguiente comando en una línea de comandos, por ejemplo.

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

</TabItem>
</Tabs>

Una vez instaladas, escogeremos la plantilla con `stores` en memoria y usuarios de prueba: `is4inmem`. 

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

Creamos un nuevo proyecto apartir de una de la plantilla con `stores` en memoria y usuarios de prueba.

```bash
dotnet new is4inmem -n Identity.API
```

El cuál mostrará el siguiente mensaje.

> The template "IdentityServer4 with In-Memory Stores and Test Users" was created successfully.

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

### Discovery Document

El _Discovery Document_ (o documento de descubrimiento, en español) no es más que un documento JSON que contiene la información sobre los _endpoints_, material clave y características de tu Identity Server.

También es conocido como el _well-known document_. Est documento permite a los clientes del servicio configurarse a sí mismos para poder autorizar/auténticar usuarios.

### Scopes + Clients

Un `scope` es un recurso en tu sistema que quieres proteger. Con Identity Server 4, podemos definir recursos de varias maneras. Desde código hasta bases de datos. En este ejemplo, los definiremos por código.

```csharp title="Identity.API/Config.cs"
// ...
public static IEnumerable<ApiScope> ApiScopes =>
    new ApiScope[]
    {
        // highlight-start 
        new ApiScope("test-scope", "Test Scope")
        // highlight-end
    };
// ...
```

Lo siguiente en la lista es registrar una aplicación cliente que consuma nuestro servicio de autenticación.

Hasta este momento, nuestro cliente no necesita ser interactivo para el usuario. Se autenticará usando el _Client Credentials Flow_ con Identity Server.

```csharp title="Identity.API/Config.cs"
// ...
public static IEnumerable<Client> Clients =>
    new Client[] 
    { 
        // highlight-start 
        new Client
        {
            ClientId = "api-client",

            // no interactive user, use the clientid/secret for authentication
            AllowedGrantTypes = GrantTypes.ClientCredentials,

            // secret for authentication
            ClientSecrets =
            {
                new Secret("api-secret".Sha256())
            },

            // scopes that client has access to
            AllowedScopes = { "test-scope" }
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
--data-urlencode 'client_id=api-client' \
--data-urlencode 'client_secret=api-secret' \
--data-urlencode 'scope=test-scope' \
--data-urlencode 'grant_type=client_credentials'
```

</TabItem>
<TabItem value="wget">

```bash
wget --no-check-certificate --quiet \
  --method POST \
  --timeout=0 \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --body-data 'client_id=api-client&client_secret=api-secret&scope=test-scope&grant_type=client_credentials' \
   'https://localhost:5001/connect/token'
```

</TabItem>
</Tabs>

## Asegura el API

Si has llegado hasta aquí, ¡Felicidades! ya tienes un servicio de autenticación funcional. En caso hayas llegado directo hasta aquí, deberías revisar lo de arriba. De todas formas, vamos a empezar lo bueno.

En realidad podríamos usar casi cualquier lenguaje y librería que nos permita construir APIs. En esta entrada, utilizaremos NodeJS y ExpressJS, ya que son parte de los stacks más populares actualmente.

Si no tienes nodejs en tu computadora, puedes descargar el instalador desde aquí: https://nodejs.org/en/download/. Si estás en Linux, y dependiendo del distro, puedes encontrarlo en los repositorios de paquetes como `nodejs`.

### ExpressJS

En las siguientes líneas, te muestro como hacer una instalación de ExpressJS y a levantar una API en menos de 5 minutos.

Creamos el folder del nuevo proyecto.

```bash
md api-sample && cd api-sample
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

>  \> api-sample@1.0.0 dev /home/mariomenjr/Samples/api-sample <br />
>  \> node app.js
>
>  App listening at http://localhost:3005

### JWKS

Un JSON Web Key Set (ó Conjunto de llaves JSON Web, en español) es un conjunto de llaves que contiene a la llave pública que debe ser usada para verificar cualquier JSON  Web Token (`JWT`, ó `bearer token`) que fue emitido por un servidor de autorización y firmado por uno de los algoritmos RSA o ECDSA.

En palabras más simples, lo anterior nos dice que una de las formas para verificar que nuestro `bearer token` es legítimo, y podemos usarlo para autorizar al usuario, es hacer uso de un `JWKS`. Nuestra instalación de Identity Server ya nos provee un endpoint para conseguir uno: [https://localhost:5001/.well-known/openid-configuration/jwks](https://localhost:5001/.well-known/openid-configuration/jwks).

Para hacer uso de él desde nuestra API en nodejs, vamos a instalar los siguientes paquetes:

```bash
npm install express-jwt jwks-rsa --save
```

Una vez instalados, es hora de crear un middleware para ayudarnos a asegurar nuestra API.

Creamos el archivo `auth.middleware.js` dentro del folder `src/middlewares`.

```bash
md src/middlewares && cd src/middlewares && touch auth.middleware.js
```

En este archivo, configuraremos los paquetes `express-jwt` y `jwks-rsa` para obtener una función que nos permita asegurar rutas específicas.

```js title="src/middlewares/auth.middleware.js"
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// For simplicity, we've hardcoded these values here.
// However, you must keep these values a secret. 
// Do not commit them to Git.
// I highly recommend to use the dot-env package.
const IDENTITY_ISSUER = `https://localhost:5001`;

console.info(`[issuer]: ${IDENTITY_ISSUER}`);

const authorize = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${IDENTITY_ISSUER}/.well-known/openid-configuration/jwks`,
  }),
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

¡Genial! Al ejecutar el proyecto de nuevo y acceder a esos endpoints desde el navegador, veremos que únicamente `/allow-anonymous` nos devuelve el mensaje que hemos escrito mientras que `/authorization-needed` nos devuelve un `UnauthorizedError`.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-29/002-api-allow-anonymous.png').default} alt="Allow Anonymous Endpoint" />
  <figcaption>http://localhost:3005/allow-anonymous</figcaption>
</figure>

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-29/003-api-authorization-needed.png').default} alt="Authorization Needed Endpoint" />
  <figcaption>http://localhost:3005/authorization-needed</figcaption>
</figure>

Aunque hayamos llegado tan lejos, aún nos falta responder a un par de preguntas. Primero, ¿Cómo hago para hacer llegar el `bearer token` al endpoint `authorization-needed`? y segundo, más importante aún, ¿Cómo obtengo un `bearer token`?

## Bearer token

En la sección [_Scopes + Clients_](#scopes--clients), te mostré como obtener un `bearer token` haciendo uso del _grant_type_ `client_credential`.

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

El _grant_type_ `client_credential` está diseñado para permitir la comunicación de máquina a máquina. Es usado cuando aplicaciones requieren de un `access token` pero no hay ninguna intervención del usuario. Por ejemplo, un _cron job_ que ejecuta una API para hacer backups de información.

Sin embargo, si quisieramos utilizar nuestro recién creado servicio de autorización con en una aplicación web, tenemos que ponernos creativos. Para esto existe el _Authorization Code Flow con PKCE_.

### React App + Authorization Code Flow

Vamos a crear una Single Page Application usando el famosisímo `creat-react-app`.

```bash
npx create-react-app my-app
```

Ya que estamos en la línea de comando, vamos a instalar un paquete que nos permitirá hacer uso del Identity Server.

```bash
npm install oidc-client --save
```

Ahora crearemos dos archivos, un `callback.html` dentro del folder `public` y un `oidcUtils.js` en el folder `src`.

```html title="public/callback.html"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/oidc-client/1.11.5/oidc-client.min.js"></script>
    <script>
        new Oidc.UserManager({response_mode:"query"}).signinRedirectCallback().then(function() {
            window.location = "index.html";
        }).catch(function(e) {
            console.error(e);
        });
    </script>
</body>
</html>
```

```js title="src/oidcUtils.js"
import Oidc from "oidc-client";

export const oidcManager = new Oidc.UserManager({
  authority: "http://localhost:5000",
  client_id: "js",
  redirect_uri: "http://localhost:3001/callback.html",
  response_type: "code",
  scope: "openid profile test-scope",
  post_logout_redirect_uri: "http://localhost:3001/index.html",
});

// Redirecciona a la aplicación una vez auténticado
export function signinRedirectCallback() {
  new Oidc.UserManager({ response_mode: "query" })
    .signinRedirectCallback()
    .then(function () {
      window.location.reload();
    })
    .catch(function (e) {
      console.error(e);
    });
}

// Redirecciona al IdentityServer para autenticarnos
export function login() {
  oidcManager.signinRedirect();
}

export function callApi() {
  oidcManager.getUser().then(function (user) {
    var url = "http://localhost:3005/authorization-needed";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      console.debug({ xhr });
      log(xhr.status, xhr.responseText);
    };
    xhr.setRequestHeader(
      "Authorization",
      !!user ? "Bearer " + user.access_token : ``
    );
    xhr.send();
  });
}

// Invalida nuestro token
export function logout() {
  oidcManager.signoutRedirect();
}

export function log() {
  document.getElementById("results").innerText = "";

  Array.prototype.forEach.call(arguments, function (msg) {
    if (msg instanceof Error) {
      msg = "Error: " + msg.message;
    } else if (typeof msg !== "string") {
      msg = JSON.stringify(msg, null, 2);
    }
    document.getElementById("results").innerHTML += msg + "\r\n";
  });
}
```

Con esto, reemplaza el contenido de `App.js` por lo siguiente.

```jsx title="App.js"
import React from "react";
import './App.css';

import { oidcManager, signinRedirectCallback, log, login, logout } from "./oidcUtils";

function App() {
  const [isLogged, isLoggedSet] = React.useState(false);

  React.useEffect(() => {
    if (window.location.pathname === `/callback.html`) signinRedirectCallback();
    else
      oidcManager.getUser().then((u) => {
        isLoggedSet(!!u);
        
        if (!!u) log("User logged in", u.profile);
        else log("User not logged in");
      });
  }, []);

  return <div style={{padding: 5}}>
    {!isLogged && <button onClick={login}>Login</button>}
    <button>Call API</button>
    {isLogged && <button onClick={logout}>Logout</button>}

    <div id="results"></div>
  </div>;
}

export default App;

```

Seguro notaste que configuramos el `authority` con la dirección _http://localhost:5000_, pero nuestro Identity Server corre sobre `https` y el puerto `5001`. 

Bien, debemos hacer ciertos cambios y adiciones en el Identity Server.

### Identity Server + Authorization Code Flow

Para evitar problemas con Chrome, y mientras estamos en el ambiente de desarrollo, vamos a cambiar esta configuración en el Identity Server.

```csharp title="Identity/Identity.API/Properties/launchSettings.json"
{
  "profiles": {
    "SelfHost": {
      "commandName": "Project",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      // highlight-start
      // "applicationUrl": "https://localhost:5001"
      "applicationUrl": "http://localhost:5000"
      // highlight-end
    }
  }
}
```

Esto no es suficiente. Al googlear un rato, me topé con esta [respuesta](https://stackoverflow.com/a/61302188/3135446) en _StackOverflow_ y funcionó de maravilla. Primero creamos una extensión al `IServiceCollection`.

```csharp title="Identity.API/SameSiteCookiesServiceCollectionExtensions.cs"
using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
 
namespace Microsoft.Extensions.DependencyInjection
{
   public static class SameSiteCookiesServiceCollectionExtensions
   {
      private const SameSiteMode Unspecified = (SameSiteMode) (-1);
 
      public static IServiceCollection ConfigureNonBreakingSameSiteCookies(this IServiceCollection services)
      {
         services.Configure<CookiePolicyOptions>(options =>
         {
            options.MinimumSameSitePolicy = Unspecified;
            options.OnAppendCookie = cookieContext =>
               CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
            options.OnDeleteCookie = cookieContext =>
               CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
         });
 
         return services;
      }

      private static void CheckSameSite(HttpContext httpContext, CookieOptions options)
      {
         if (options.SameSite == SameSiteMode.None)
         {
            var userAgent = httpContext.Request.Headers["User-Agent"].ToString();

            if (DisallowsSameSiteNone(userAgent))
            {
               options.SameSite = Unspecified;
            }
         }
      }
 
      private static bool DisallowsSameSiteNone(string userAgent)
      {
         if (userAgent.Contains("CPU iPhone OS 12")
            || userAgent.Contains("iPad; CPU OS 12"))
         {
            return true;
         }

         if (userAgent.Contains("Safari")
            && userAgent.Contains("Macintosh; Intel Mac OS X 10_14")
            && userAgent.Contains("Version/"))
         {
            return true;
         }

         if (userAgent.Contains("Chrome/5") || userAgent.Contains("Chrome/6"))
         {
            return true;
         }

         var chromeVersion = GetChromeVersion(userAgent);
         if (chromeVersion >= 80)
         {
            return true;
         }

         return false;
      }

      private static int GetChromeVersion(string userAgent)
      {
         try
         {
            var subStr = Convert.ToInt32(userAgent.Split("Chrome/")[1].Split('.')[0]);
            return subStr;
         }
         catch (Exception)
         {
            return 0;
         }
      }
   }
}
```

Y luego la implementamos en las configuraciones del `Startup.cs`.

```csharp title="Identity.API/Startup.cs"
public void ConfigureServices(IServiceCollection services)
{
   // ...
   // highlight-start
   services.ConfigureNonBreakingSameSiteCookies();
   // highlight-end
}
 // ...
public void Configure(IApplicationBuilder app)
{
   // ...
   // Añade esta línea antes de cualquier `middleware` que pueda escribir `cookies`
   // highlight-start
   app.UseCookiePolicy();
   // highlight-end
   // ...
   // Esto escribirá `cookies`, asegúrate que se añada después de la política de `cookies`
   app.UseAuthentication();
   // ...
}
```

También debemos configurar CORS.

```csharp title="Identity.API/Startup.cs"
public void ConfigureServices(IServiceCollection services)
{
    // ...
    // highlight-start
    services.AddCors(options =>
    {
        // Esto define una política de CORS llamada "default"
        options.AddPolicy("default", policy =>
        {
           // El puerto de la React App
            policy.WithOrigins("http://localhost:3001")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });
    // highlight-end
}
// ...
public void Configure(IApplicationBuilder app)
{
    // ...
    app.UseRouting();
    // ...
    // highlight-start
    app.UseCors("default");
    // highlight-end
    // ...
}
```

Al ejecutar el project de nuevo, verás que ahora corre en la nueva dirección.

> [21:48:29 Debug] IdentityServer4.Startup <br />
> Using idsrv as default ASP.NET Core scheme for forbid <br />
> 
> [21:48:29 Information] Microsoft.Hosting.Lifetime <br />
> Now listening on: http://localhost:5000

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

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-29/001-authorization-code-flow.gif').default} alt="Authorization Code Flow" />
  <figcaption>Authorization Code Flow con PKCE en acción.</figcaption>
</figure>

### API + Bearer Token

Finalmente, consumiremos nuestra API desde la React App haciendo uso del `access token` que acabamos de obtener desde el Identity Server.

```jsx title="src/App.js"
import React from "react";
import './App.css';

// highlight-start
import { oidcManager, signinRedirectCallback, log, login, logout, callApi } from "./oidcUtils";
// highlight-end

function App() {
  const [isLogged, isLoggedSet] = React.useState(false);

  React.useEffect(() => {
    if (window.location.pathname === `/callback.html`) signinRedirectCallback();
    else
      oidcManager.getUser().then((u) => {
        isLoggedSet(!!u);
        
        if (!!u) log("User logged in", u.profile);
        else log("User not logged in");
      });
  }, []);

  return <div style={{padding: 5}}>
    {!isLogged && <button onClick={login}>Login</button>}
    // highlight-start
    <button onClick={callApi}>Call API</button>
    // highlight-end
    {isLogged && <button onClick={logout}>Logout</button>}

    <div id="results"></div>
  </div>;
}

export default App;
```

Haz click sobre el botón _Call API_ antes de loguearte, notarás que recibes un `UnauthorizedError`. Una vez nos logueamos a través del Identity Server, nuestro _/authorization-needed_ endpoint nos devuelve el mensaje escrito sin problemas.

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-29/002-consume-api-bearer.gif').default} alt="Consumiendo un API protegida desde una SPA" />
  <figcaption>Consumiendo un API protegida desde una SPA.</figcaption>
</figure>

## Autenticación, ó cómo saber quién está siendo autorizado

Hasta este momento, hemos visto cómo Identity Server nos ha permitido asegurar APIs con un `access token`. Sin embargo, aún no conocemos quién es ese usuario del cuál recibimos el `token`. Recuerda, autorizar no es lo mismo que auténticar.

Vamos a instalar un paquete, crear un nuevo archivo y hacer unas pequeñas modificaciones en nuestra _ExpressJS API_ para lograr identificar a nuestro usuario.

El paquete a instalar es:

```bash
npm install jwt-decode --save
```

El nuevo archivo se llamará `identity.middleware` dentro del folder `middlewares`.

```js title="src/middlewares/identity.middleware"
const jwt_decode = require("jwt-decode");

function identify() {
  return function(req, res, next) {
    req.user = jwt_decode(req.headers.authorization.split(` `)[1]);
    console.debug({ user: req.user, accessToken: req.headers.authorization.split(` `)[1] });
    next();
  }
}

module.exports = identify;
```

Y ahora configuramos este middleware en nuestra API. El middleware se encargará de decodificar el `access token` para obtener información del acceso, incluyendo un `user identifier`.

```js title="src/App.js"
// ...
const authorize = require("./src/middlewares/auth.middleware");
// highlight-start
const identify = require("./src/middlewares/identity.middleware");
// highlight-end

app.use(cors());
// highlight-start
app.use(identify());
// highlight-end
// ...
```

Una vez volvemos a ejecutar nuestra API y loguearnos en nuestra ReactApp, al hacer click en el botón _Call API_

<figure class="md-captioned-image">
  <img src={require('../static/img/blog/2021-07-29/004-sub-in-token.png').default} alt="Consumiendo un API protegida desde una SPA" />
  <figcaption>En el access token usado para autorizar el uso del API, hay una propiedad llamada sub. Es está propiedad la que identifica al usuario. Es un user ID.</figcaption>
</figure>

Al imprimir el `access token` en la consola de JavaScript, podemos copiar y pegarlo en el comando cURL de abajo, reemplazando el `<accessToken>`, y al ejecutarlo obtener la información de usuario. Con esta información, podríamos realizar condicionante en nuestra lógica de negocio que estén basadas en los _claims_ o roles que definamos en nuestros _clientes_ del Identity Server.

```bash
curl --location --request GET 'http://localhost:5000/connect/userinfo' \
--header 'Authorization: Bearer <accessToken>'
```

> { <br />
>   "name": "Bob Smith", <br />
>   "given_name": "Bob", <br />
>   "family_name": "Smith", <br />
>   "website": "http://bob.com", <br />
>   "sub": "88421113" <br />
> } <br />

Podríamos incorporar esta información en nuestro ciclo de vida del request, pero dejaremos eso para otro post.

## Conclusión

Una de las principales ventajas al delegar la autorización y auténticación de tus aplicaciones a una implementación del OAuth 2.0 y OpenID es la seguridad. Al ser un estándar avalado por grandes compañías y consorcios podemos estar seguros de su efectividad y fiabilidad.

Desde un punto de vista más enfocado a la arquitectura de nuestra aplicación, es interesante cómo ninguna de las Apps aquí mostradas (piensa el API de Express JS y la SPA de React) tuvo la necesidad de manejar ni el usuario ni la contraseña del usuario. Esto es poderoso. Permite que Apps de terceros trabajen juntas sin necesidad de preocuparse en los mecanismos de autenticación y autorización.

Sin embargo, ningún software es perfecto. Como vimos, OAuth va por su segunda versión y es del otod probable que en el futuro haya una tercera. Lo qué nos queda es nunca para de aprender.

Espero este post te haya servido, si es así, compártelo con tus colegas. Happy coding!

## Referencias

- [Authentication vs. Authorization](https://www.okta.com/identity-101/authentication-vs-authorization/)
- [What is OAuth 2.0?](https://auth0.com/intro-to-iam/what-is-oauth-2/)
- [Authentication and Authorization Flows](https://auth0.com/docs/flows)
- [Identity Server 4: The Big Picture](https://identityserver4.readthedocs.io/en/latest/intro/big_picture.html)
- [JKWS by IBM](https://www.ibm.com/docs/en/sva/10.0.1?topic=applications-jwks)
- [Adding a JavaScript client](https://identityserver4.readthedocs.io/en/latest/quickstarts/4_javascript_client.html)
- [How to prepare your IdentityServer for Chrome's SameSite cookie changes - and how to deal with Safari, nevertheless](https://www.thinktecture.com/en/identity/samesite/prepare-your-identityserver/)