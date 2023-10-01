---
slug: 2023/10/01/como-empezar-un-project-en-go
title: "Cómo empezar un proyecto en Go"
date: 2023-10-01T10:57:02.000-07:00
description: "Empecemos un proyecto en Go."
coverCaption: Del [The Go Blog](https://go.dev/blog/go-brand).
keywords: ["golang","español","gopath","cómo empezar un proyecto en go","google go","package go","go.mod","go mod init","go get","mariomenjr handlr","dependencias"]
tags: ["go","golang"]
---

{{< param "description" >}}

## ¿Espera, Go?

Go, o Golang, es un lenguaje de programación introducido por Google en Noviembre de 2009. Su característica distintiva es su enfoque a la concurrencia de procesos. Es utilizado principalmente en el desarrollo de la nube, herramientas de terminal, desarrollo web y devops.

Como nos comentan nuestros amigos de JetBrains, Go está dentro de los 10 primeros lenguages por uso profesional, con un porcentaje del 7%, y se posiciona como un jugador importante en la industria financiera y la nube. Muchas de las herramientas de infraestructura de software como Docker, Kubernetes y Vault, por nombrar algunas de las más importantes, están escritas en Go.

## Instalar Go

Para continuar, debes instalar Go si aún no lo haz hecho. El cómo hacerlo dependerá de la plataforma desde dónde nos lees. 

### Linux

Dependerá de tu distro. Googlea "*instalar golang {tu distro}*". Si usas Fedora, como yo, ejecuta el siguiente comando:

```bash
$ sudo dnf install golang
```

Una vez completado, verifica la instalación.

```bash
$ go version
go version go1.20.8 linux/amd64
```

### Mac & Windows

Puedes encontrar los binarios aquí: [https://go.dev/dl/](https://go.dev/dl/).

## Organización de archivos

En Go, organizamos el código en *paquetes* que a su vez se agrupan en *módulos*. Estos *paquetes* específican sus propias dependencias y la versión de Go con la cuál funcionan.

### go mod init

Creemos nuestro primer módulo en Go. Hagamos una bonita calculadora.

En el directorio de tu elección, en mi caso `~/Source/go-calculator`, ejecuta el siguiente comando.

```bash
$ go mod init {path}/go-calculator
```

Lo qué escribimos después de `init` debe ser el path desde dónde *Go tools* descargará nuestro módulo cuando este sea declarado como dependencia en otro módulo. Por lo general, un repositorio en línea. En mi caso: `github.com/mariomenjr`.

```bash
$ go mod init github.com/mariomenjr/go-calculator
go: creating new go.mod: module github.com/mariomenjr/greetings
```

Verás que un archivo `go.mod` ha sido creado en la raíz de tu proyecto. La función de este archivo es manejar las dependencias de tu proyecto. Conforme añades dependencias, este archivo registrará las versiones de los módulos en los cuáles depende tu aplicación.

### main.go

El punto de entrada un ejecutable escrito en Go es el paquete `main`, específicamente la función `main`. Crea un archivo `main.go` en la raíz de tu proyecto con el siguiente contenido, el nombre del archivo es opcional.

```go {linenos=inline}
package main // nombre del paquete

import "fmt" // importar dependencias

func sum(a int, b int) int {
	return a + b
}

func main() { // función inicio requerida

	a := 1
	b := 2

	rs := sum(a, b)
	fmt.Printf("%v + %v = %v\n", a, b, r)
}

```

Lo ejecutamos.

```bash
$ go run main.go
1 + 2 = 3
```

### Instalar una dependencia

Ya que hemos creado nuestra primera aplicación, es hora de mejorarla. Para ello, instalaremos un módulo externo.

```bash
$ go get github.com/mariomenjr/handlr
go: downloading github.com/mariomenjr/handlr v0.1.0-alpha.9
go: added github.com/mariomenjr/handlr v0.1.0-alpha.9
```

Después de ejecutar el comando anterior, verás cómo el archivo `go.mod` ahora lista la nueva dependencia.

```mod {hl_lines=[5]}
module github.com/mariomenjr/go-calculator

go 1.20

require github.com/mariomenjr/handlr v0.1.0-alpha.9 // indirect

```

El módulo que acabamos de instalar nos permitirá llevar nuestra calculadora a la web.

Para continuar, cambia el contenido de `main.go` por el siguiente.

```go {linenos=inline,hl_lines=["5-8", "11-21", "25-28"]}
package main // nombre del paquete

import ( // importar dependencias
	"fmt"
	"net/http"
	"strconv"

	"github.com/mariomenjr/handlr"
)

func sumHandler(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()

	a, _ := strconv.Atoi(q.Get("a"))
	b, _ := strconv.Atoi(q.Get("b"))

    rs := a + b

	s := fmt.Sprint("<html><title>go-calculator</title><body>", a, " + ", b, " = ", rs, "</body></html>")

	w.Write([]byte(s))
}

func main() { // función inicio requerida
	h := handlr.New()

	h.HandleFunc("/sum", sumHandler)
	h.Start(1993)
}

```

Otra vez ejecutamos el siguiente comando.

```bash
$ go run main.go
> Server started on port :1993
```

A diferencia de la vez anterior, no verás el resultado en la línea de comandos sino que debes abrir el siguiente enlace en tu navegador: [http://localhost:1993/sum?a=1&b=2](http://localhost:1993/sum?a=1&b=2).

{{< figure src="Screenshot_20230930_174257.png" title="github.com/mariomenjr/handlr" caption="Ahora podemos modificar los valores de `a` y `b` en la URL.">}}

### Multiples paquetes

El paquete `main` es el único paquete que existe en nuestro proyecto hasta ahora. A medida que tu base de código crece, lo más probable es que quieras organizar tu código acorde a su funcionalidad. Para conseguirlo, podemos crear multiples paquetes dentro de nuestro módulo.

Cada directorio puede contener un paquete, como ya existe uno en la raíz de nuestro proyecto debemos crear sub-directorios por cada nuevo paquete a implementar.

Tomando en cuenta lo anterior, creemos un paquete exclusivamente para los cálculos matemáticos y otro que nos permita construir la presentación de los resultados en el navegador. Todo esto vive actualmente en el archivo `main.go`.

```txt {hl_lines=["5-8"]}
~/Sources/go-calculator/
    main.go
    go.mod
    go.sum
    math/
        sum.go
    html/
        index.go
```

En el archivo `math/sum.go`, pega el siguiente contenido.

```go {linenos=inline}
package math

func Sum(a int, b int) int {
	return a + b
}

```

Seguido del contenido para el archivo `html/index.go`.

```go {linenos=inline}
package html

import (
	"fmt"
	"net/http"
)

func htmlEngine(content string) []byte {
    s := fmt.Sprint("<html><title>go-calculator</title><body>", content, "</body></html>")
    return []byte(s)
}

func RenderResult(w http.ResponseWriter, content string) {

	s := fmt.Sprint("<html><title>go-calculator</title><body>", content, "</body></html>")
	w.Write(htmlEngine(content))
}

```

Nota la diferencia en el "casing" del nombre de las funciones. Mientras que la función `htmlEngine` inicia en minúscula, `RenderResult` lo hace en mayúscula. Esto le dice a Go que la segunda función debe ser accesible desde otros paquetes dónde se importe este; mientras que la primera, en minúscula, solamente es accesible desde el paquete `html`.

Finalmente, hagamos los ajustes necesarios en el archivo `main.go`.

```go {linenos=inline,hl_lines=["8-9", 19, 21]}
package main // package name

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/mariomenjr/go-calculator/html"
	"github.com/mariomenjr/go-calculator/math"
	"github.com/mariomenjr/handlr"
)

func sumHandler(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()

	a, _ := strconv.Atoi(q.Get("a"))
	b, _ := strconv.Atoi(q.Get("b"))

	rs := math.Sum(a, b)

	html.RenderResult(w, fmt.Sprint(a, " + ", b, " = ", rs))
}

func main() {
	h := handlr.New()

	h.HandleFunc("/sum", sumHandler)
	h.Start(1993)
}

```

### ./internal/

Nuestro proyecto es una aplicación web que nos permite sumar dos números y nos muestra el resultado en el navegador. Sin embargo, podríamos crear un módulo separado que se encargue exclusivamente de los cálculos e importarlo desde esta aplicación cómo una dependencia. 

En ese caso, es muy probable que queramos limitar los paquetes a los cuales tenemos acceso. No es una buena idea exponer métodos o paquetes que solo nos ayudan con tareas internas. Al limitar este acceso, somos libres de refactorizar cualquier paquete o método interno sin miedo a afectar a los usuarios del módulo.

Basta simplemente con mover esos paquetes que no queramos exponer a otros módulos al directorio `internal`. Por ejemplo, en nuestra aplicación web, los directorios quedarían así.

```txt {hl_lines=[5]}
~/Sources/go-calculator/
    main.go
    go.mod
    go.sum
    internal/
        math/
            sum.go
        html/
            index.go
```

Ahora cambiamos la forma en la cuál esta dependencia interna es importada por el módulo en el archivo `main.go`.

```go {linenostart=6,linenos=inline,hl_lines=["3-4"]}
	"strconv"

	"github.com/mariomenjr/go-calculator/internal/html"
	"github.com/mariomenjr/go-calculator/internal/math"
	"github.com/mariomenjr/handlr"
)

func sumHandler(w http.ResponseWriter, r *http.Request) {
```

## Hay mucho más

Con lo anterior, te mostré los pasos básicos para empezar tu proyecto en Go. Este lenguaje tiene muchas características interesantes que descubrirás a medida que profundices en él. Te animo a leer la documentación oficial para obtener más detalles. En algún momento escribiré más acerca de mi aprendizaje de Go. 

À bientôt.

## Referencias

- [Using Go at Google](https://go.dev/solutions/google/)
- [The state of Go](https://blog.jetbrains.com/go/2021/02/03/the-state-of-go/)
- [Tutorial: Create a Go module](https://go.dev/doc/tutorial/create-module)
- [Organizing a Go module](https://go.dev/doc/modules/layout)
