---
slug: 2023/12/02/como-respaldar-tus-archivos-incrementalmente-en-linux
title: "Cómo respaldar tus archivos offline"
date: 2023-12-02T10:12:02.000-08:00
description: "Fácil y rápido."
coverCaption: Photo by [Maksym Kaharlytskyi](https://unsplash.com/photos/file-cabinet-Q9y3LRuuxmg).
keywords: ["repaldo","rsync","offline","cómo respaldar tus archivos offline", "sincronizar"]
tags: ["rsync","sync"]
---

{{< alert >}} Atención: Esta entrada sobre respaldos con `rsync` se proporciona con fines informativos. Ten precaución, comprende los comandos y verifica las rutas para evitar pérdida de datos. El autor no se hace responsable de posibles problemas. Realiza pruebas en datos sin importancia primero. Tú eres responsable de la seguridad e integridad de tus datos. {{< /alert >}}

## Rsync

`rsync` es una herramienta de sincronización y transferencia de archivos eficiente comúnmente utilizada en sistema operativos Unix. Su característica principal es el algorithmo de diferenciación, mejor descrito en inglés como *delta encoding algorithm*, que tiene por objetivo obtener únicamente las partes del archivo que han sido modificados desde su última versión. 

## Respaldos offline

Con el auge de la nube, respaldar tus datos en algún servicio de los gigantes de la tecnología y poder accederlos desde cualquier dispositivo conectado a internet no había sido más fácil. Basta con instalar una aplicación, seleccionar los directorios a sincronizar y dar un par de clicks más al botón siguiente. La mayoría de estos servicios incluso ofrecen una opción gratuita con cierto límite de almacenamiento el cuál puede incrementarse al pagar una suscripción.

Por otro lado, los respaldos offline tienen también sus propias ventajas. Aunque los costos iniciales por lo general son mayores, estos son más predecibles y no están vinculados a suscripciones mensuales. La privacidad es otro aspecto importante que muchos usuarios valoramos.

No quiero iniciar una guerra sin sentido entre aquellos fieles usuarios de estos servicios, que nos brindan tantas facilidades, y quienes también buscamos tener más control de nuestros datos o simplemente expandir nuestras opciones. 

## Let's script

Hasta el día de hoy había hecho mis respaldos offline manualmente. Un proceso delicado y que lleva mucho tiempo. Siendo un usuario de Linux, y después de googlear un rato, me topé con la herramienta protagonista de este *post*. 

A continuación, escribiremos paso a paso un *script* de `bash` que nos permitirá sincronizar nuestro directorio de inicio a un dispositivo externo. Cada vez que ejecutemos el *script*, `rsync` se encargará de copiar o eliminar cualquier archivo nuevo o inexistente del directorio principal en el dispositivo externo.

### Origen y destino

Las dos variables más importantes de nuestro *script* son la ruta origen y la de destino. En otras palabras, el directorio que queremos respaldar y el directorio donde guardaremos el respaldo.

```bash {linenos=inline}
#!/bin/bash

# Como habíamos mencionado, respaldaremos nuestro directorio de inicio.
source_dir="$HOME"

# Necesitamos correr el archivo con `sudo`
if ! [ $(id -u) = 0 ]; then
  echo "The script need to be run as root."
  exit 1
elif [ -n "$SUDO_USER" ]; then
  source_dir="/home/$SUDO_USER"
fi

# Recibiremos el directorio destino como un parametro en la línea de comando.
if [ $# -ne 1 ]; then
    echo "La ruta del directorio de destino no ha sido específicada."
    exit 1
fi
destination_dir="$1"

# Nos aseguramos que dicho directory existe.
if [ ! -d "$destination_dir" ]; then
    echo "El directorio de destino específicado no existe. Asegúrate que tu disco externo este montado."
    exit 1
fi

# Let's test it
echo "$destination_dir and $source_dir"
```

Vamos a probarlo.

```bash
$ ./Script/sync/sync.bash /this/is/a/test
/this/is/a/test and /home/mariomenjr
```

### Registrar progreso

Es importante tener en cuenta que las cosas pueden no salir bien a la primera. Por esta razón el siguiente paso es indicar un nombre de archivo para registrar el progreso de `rsync`. Para ello, generaremos un identificador único que usaremos para nombrar el archivo de registros según el *script* sea ejecutado.

```bash {linenos=inline,linenostart=26}

# Generamos un identificador único para nuestro archivo de registro.
timestamp=$(date +"%Y%m%d_%H%M%S")

# Obtenemos el directorio desde el cuál nuestro script se ejecuta.
script_dir=$(dirname "$0")

# Por último, concatenamos el directorio, el nombre del archivo y el identificador único.
log_file="$script_dir/rsync.$timestamp.log"
```

### Es hora de *rsync*

Haciendo uso de los diferentes *flags*, `rsync` realizará los respaldos acumulativos de nuestro directorio de inicio.

```bash {linenos=inline,linenostart=35}

# Configuramos `rsync`
rsync \
    -av \
    --delete \
    --exclude="/.*" \
    --exclude="/.*/" \
    --exclude="/go/" \
    --exclude="/Documents/Docker/" \
    --exclude="rsync.*.log" \
    --delete-excluded \
    --progress \ 
    "$source_dir/" "$destination_dir" \
    >> "$log_file" 2>&1
```

Cada opción cumple una función que se explica a continuación:

1. ***-av***: tando ***a*** como ***v*** cumplen una función independiente. El primero le dice a `rsync` que se ejecute en modo archivo; esto garantiza la preservación de atributos y propiedades. El segundo le dice que muestre información detalla sobre la ejecución; capturaremos esta información en un *.log*.

2. ***-delete***: nuestra expectativa de un respaldo acumulativo incluye la eliminación de archivos en el destino que no exístan más en el origen, con el fin de mantener la carpeta destino como una réplica del origen.

3. ***-exclude***: estas opciones indican patrones de exclusión para archivos y directorios que no deben ser sincronizados.

4. ***-delete-excluded***: elimina archivos que hayan sido excluídos pero previamente replicados.

5. ***-progress***: nos muestra el progreso de la sincronización, indicando cuál archivo está siendo transferidos y su porcentaje de replicación.

6. Como última opción, debemos específicar las rutas del directorio a replicar ó `$source_dir` y del directorio destino ó *$destination_dir*. 

7. Al final, y sin ser estricamente parte de las opciones de `rsync`, redirigimos la salida estándar y de error al archivo de registro especificado por la variable `$log_file`.

## TL;DR

El `script` resultante.

```bash {linenos=inline}
#!/bin/bash

# Como habíamos mencionado, respaldaremos nuestro directorio de inicio.
source_dir="$HOME"

# Necesitamos correr el archivo con `sudo`
if ! [ $(id -u) = 0 ]; then
  echo "The script need to be run as root."
  exit 1
elif [ -n "$SUDO_USER" ]; then
  source_dir="/home/$SUDO_USER"
fi

# Recibiremos el directorio destino como un parametro en la línea de comando.
if [ $# -ne 1 ]; then
    echo "La ruta del directorio de destino no ha sido específicada."
    exit 1
fi
destination_dir="$1"

# Nos aseguramos que dicho directory existe.
if [ ! -d "$destination_dir" ]; then
    echo "El directorio de destino específicado no existe. Asegúrate que tu disco externo este montado."
    exit 1
fi

# Generamos un identificador único para nuestro archivo de registro.
timestamp=$(date +"%Y%m%d_%H%M%S")

# Obtenemos el directorio desde el cuál nuestro script se ejecuta.
script_dir=$(dirname "$0")

# Por último, concatenamos el directorio, el nombre del archivo y el identificador único.
log_file="$script_dir/rsync.$timestamp.log"

# Configuramos `rsync`
rsync \
    -av \
    --delete \
    --exclude="/.*" \
    --exclude="/.*/" \
    --exclude="/go/" \
    --exclude="/Documents/Docker/" \
    --exclude="rsync.*.log" \
    --delete-excluded \
    --progress \ 
    "$source_dir/" "$destination_dir" \
    >> "$log_file" 2>&1

echo "Syncronización completada existosamente. Revisa $log_file para más detalles."
```

## Referencias

- [Wayne/rsync](https://github.com/WayneD/rsync)
- [Delta encoding](https://es.wikipedia.org/wiki/Delta_encoding)