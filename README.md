# Dream Academy

[![Dream Academy](https://img.shields.io/badge/Dream_Academy-Vis%C3%ADtanos-blue)](https://dream-academy.vercel.app/)
[![Dream Academy](https://img.shields.io/badge/Versión-Alpha-red)](https://dream-academy.vercel.app/)

Este es el repositorio principal de Dream Academy. Contiene el código de frontend, el código de backend, documentación de uso y documentación técnica

<details>
<summary>Tabla de contenidos</summary>

- [Introducción](#introducción)
- [Dependencias](#dependencias)
- [Manual para desarrolladores](#manual-para-desarrolladores)

</details>

## Introducción

Dream Academy es un proyecto construído con NodeJS usando principalmente TypeScript haciendo uso de una plataforma BaaS llamada Supabase con postgreSQL como base de datos.

## Dependencias

Verifica que tienes instaladas estas dependencias:

* \>= `nodejs 18`
* \>= `npm 10`

## Manual para desarrolladores

### Configura Supabase

1. Crea un proyecto de Supabase con el nombre que desees, asegúrate de tener hechas las plantillas para el envío de emails

2. En la consola SQL que podrás ver en el apartado "sql editor" en el menú contextual de la página, copia y pega el código SQL del archivo `/db.example.sql` presente en el directorio raíz del repositorio. [Más informacion sobre la db de supabase aquí.](https://supabase.com/docs/guides/database/overview)

3. Para no tener problemas con autorización y permisos de Supabase en cuanto a la edición de tablas, desde la página de Supabase desactiva "row level security" (RLS), para más información acerca de RLS [visita este link.](https://supabase.com/docs/guides/auth/row-level-security)

### Pasos de instalación:

1. Para correr el programa en tu máquina asegúrate de instalar las dependencias abriendo la terminal en el directorio del proyecto y ejecuta:

  ```sh
  # Usa el distribuidor de paquetes nodejs que mas se acomode a tus gustos (pnpm o yarn)

  # Si usas pnpm ejecuta < pnpm install >

  # Si usas yarn ejecuta < yarn install >
  npm install
  ```

2. En el directorio raíz del proyecto crea un archivo `/.env` siguiendo las indicaciones escritas en el archivo `/.env.example`

3. Ejecuta el programa en tu servidor local con el siguiente comando de terminal

```sh
# Si usas pnpm corre < pnpm dev > 
# o si usas yarn corre < yarn run dev >
npm run dev
```