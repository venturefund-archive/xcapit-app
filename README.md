### Note: La app ya se encuentra con la rama nueva-arquitectura-estado mergeada a dev.

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

# Instrucciones para correr la App

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
