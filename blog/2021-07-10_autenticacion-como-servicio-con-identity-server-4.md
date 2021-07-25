---
slug: 2021/07/10/autenticacion-como-servicio-con-identity-server-4
title: "Autenticación como servicio con Identity Server 4"
author: Mario Menjívar
author_title: Software Engineer
author_url: https://github.com/mariomenjr
author_image_url: https://avatars3.githubusercontent.com/u/1946936?s=460&v=4
tags: [oauth2.0,openid,csharp,identity server,nodejs]
keywords: [oauth en español,oauth 2.0,identity server,bearer token,credentials,openid,español,como proteger api,como proteger api con identity server,como proteger api oauth,como proteger api nodejs]
date: 2021-07-10T10:21:18.000-07:00
description: "En esta entrada, hablaremos de quizá la más prominente implementación de los protocolos OpenID Connect y OAuth 2.0 para NETCore: Identity Server 4. En específico cómo proteger tus APIs con en Node.js."
image: "https://images.unsplash.com/photo-1539039374392-54032a683b1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
draft: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Antes de comenzar debemos hacer una distinción muy importante. Autenticar y autorizar son dos aspectos completamente independientes pero centrales a la seguridad. Auténticar se refiere a confirmar que los usuarios son quienes dicen ser. Autorizar, por otro lado, es dar acceso a los recursos a esos usuarios.

En esta entrada, hablaremos de quizá la más prominente implementación de los protocolos OpenID Connect y OAuth 2.0 para .NET Core: Identity Server 4. En específico cómo proteger tus APIs con en Node.js.

<!--truncate-->

## OAuth 2.0 + OpenID

Lo más seguro es que en algún momento hayas visto una página como esta:

![Google OAuth Sample](../static/img/blog/2021-07-10/001-google-oauth.png)

Este es un ejemplo de una implementación de OAuth y OpenID que tiene como objetivo permitir que Medium pueda utilizar tu cuenta de Google para loguearte. Sin embargo, para lograrlo, Medium debe pedirte permiso para acceder _a ciertos datos_ de tu perfil de Google con los cuáles puede identificar tu cuenta.

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
    {label: 'dotnet', value: 'cli'},
  ]
}>
<TabItem value="cli">

```bash 
dotnet new -i IdentityServer4.Templates
```

Verás el siguiente mensaje.

```bash
Welcome to .NET 5.0!
---------------------
SDK Version: 5.0.204

----------------
Installed an ASP.NET Core HTTPS development certificate.
To trust the certificate run 'dotnet dev-certs https --trust' (Windows and macOS only).
Learn about HTTPS: https://aka.ms/dotnet-https
----------------
Write your first app: https://aka.ms/dotnet-hello-world
Find out what's new: https://aka.ms/dotnet-whats-new
Explore documentation: https://aka.ms/dotnet-docs
Report issues and find source on GitHub: https://github.com/dotnet/core
Use 'dotnet --help' to see available commands or visit: https://aka.ms/dotnet-cli
--------------------------------------------------------------------------------------
Getting ready...
  Determining projects to restore...
  Restored /home/mariomenjr/.templateengine/dotnetcli/v5.0.204/scratch/restore.csproj (in 5.32 sec).
```

</TabItem>
</Tabs>

Una vez instalado, escogemos la plantilla vacía: `is4empty`.

<Tabs
  groupId="operating-systems"
  defaultValue="cli"
  values={[
    {label: 'dotnet', value: 'cli'},
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

```bash
The template "IdentityServer4 Empty" was created successfully.
```

</TabItem>
</Tabs>

Finalmente, crearemos una solución para nuestra plantilla. Para eso necesitamos ejecutar los siguientes comandos.

<Tabs
  groupId="operating-systems"
  defaultValue="cli"
  values={[
    {label: 'dotnet', value: 'cli'},
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

```bash
Project `Identity.API/Identity.API.csproj` added to the solution.
```

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
    {label: 'dotnet', value: 'cli'},
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

```csharp
// Identity.API/Config.cs

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

```csharp
// Identity.API/Config.cs

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

<!-- ## Cuándo + Porqué

En un mundo dónde existen Amazon Cognito, Okta, Google Cloud Identity, entre otros, ¿Por qué implementaría un Identity Server por mi cuenta? -->

<!-- ## Identity Server 4 License -->

## Proteger un API

## Conclusión

## Referencias

- [Authentication vs. Authorization](https://www.okta.com/identity-101/authentication-vs-authorization/)
- [What is OAuth 2.0?](https://auth0.com/intro-to-iam/what-is-oauth-2/)
- [Authentication and Authorization Flows](https://auth0.com/docs/flows)
- [Identity Server 4: The Big Picture](https://identityserver4.readthedocs.io/en/latest/intro/big_picture.html)