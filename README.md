### Note: La app ya se encuentra con la rama nueva-arquitectura-estado mergeada a dev.

# Instrucciones para correr la App y setear assets según brand (wcs/xcapit), si no se desea setear una brand se ejecuta con los scripts mencionados [aquí](#instrucciones).

Nota: para generar los iconos y las splash  correspondientes a la PWA se utilizó [pwa-asset-generator](https://github.com/onderceylan/pwa-asset-generator). Para las nativas (android, ios) [cordova-res](https://github.com/ionic-team/cordova-res) (aunque todavía no se automatizó el seteo de estas últimas).

Para correr la App ejecutar

```bash
npm run start:wcs
```
```bash
npm run start:xcapit
```

o

```bash
yarn start:wcs
```
```bash
yarn start:xcapit
```

Para crear un build para producción

```bash
npm run build:prod:wcs
```
```bash
npm run build:prod:xcapit
```

o

```bash
yarn build:prod:wcs
```
```bash
yarn build:prod:xcapit
```

Para crear un build de una PWA para producción

```bash
npm run build:prod:pwa:wcs
```
```bash
npm run build:prod:pwa:xcapit
```

o

```bash
yarn build:prod:pwa:wcs
```
```bash
yarn build:prod:pwa:xcapit
```

# Instrucciones para update de dependencias

Para hacer update de dependencias, bajar lo último del repo (branch dev) y en el directorio de la App ejecutar:

```bash
rm -rf node_modules
```

por último ejecutar:

```bash
npm i
```

o

```bash
yarn install
```

# <a id="instrucciones"></a> Instrucciones para correr la App

* Versión de node: v11.6.0
* Versión de npm: 6.5.0-next.0
* Versión de yarn: 1.16.0 (no es estrictamente necesario)
* Versión de ionic/cli: v5.0.0

Si ya estan instalados los paquetes listados arriba se procede a instalar las dependencias de la App.

Para instalar las dependencias, en el directorio de la App ejecutar:

```bash
npm i
```

o

```bash
yarn install
```

Para correr la App ejecutar

```bash
npm start
```

o

```bash
yarn start
```

Una vez que la App esta corriendo se debería abrir una pestaña en el navegador por defecto con la url localhost:8100/users/login

Se debe modificar la url a localhost:8100/users/register esto es porque la App tiene como ruta de inicio predeterminada el login, después se puede definir de manera dinámica la ruta de inicio, si es login o registro, de acuerdo a que acciones tome el usuario (si ya se registro, etc.).

# Instrucciones generar una PWA para producción

```bash
npm build --prod --serviceWorker=true
```

o

```bash
yarn build --prod --serviceWorker=true
```

# Instrucciones para generar docker para preproducción
Pararse en rama release/vx.x.x 

Hacer merge de dev

Buildear el docker

```bash
docker build -t app_user:vx.x.x .
```

Levantar el docker

```bash
docker run --restart always --name app_user -d -p 4200:4200 app_user:vx.x.x
```

Nota: Para hacer el run con el nombre app_user hay que renombrar/eliminar el docker anterior