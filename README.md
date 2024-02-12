> [!NOTE]  
> El siguiente proyecto fue desarrollado por:
> * Jilson Narváez
> *  Angelo Olmedo

 # Examen 2 - PICW  https://examen-picw.vercel.app/
Para ejecutar este proyecto se debe:

1. Clonar el repositorio
```bash	
git clone https://github.com/janarvaez11/Examen_PICW.git
```
```bash	
cd Examen_PICW
```
2. Instalar las dependencias

```bash	
npm install
```
```bash	
npm install jspdf
```
```bash	
npm install jspdf-autotable
```
```bash	
npm install bootstrap
```
```bash	
npm install @supabase/supabase-js
```

3. Ejecutar el servidor:
```bash	
npm run dev
```   
# Desarrollo de la Aplicación

## Arquitectura de la Aplicación

La aplicación sigue una arquitectura cliente-servidor basada en la tecnología React para el frontend y Supabase como backend.

- **Frontend:**

  - Desarrollado utilizando React, una biblioteca de JavaScript para construir interfaces de usuario.
  - Utiliza componentes para una estructura modular y mantenible.
  - Implementa funcionalidades de búsqueda, filtrado, ordenamiento y generación de informes en PDF.

- **Backend:**
  - Utiliza Supabase como plataforma de backend, que proporciona una base de datos PostgreSQL y servicios de autenticación en tiempo real.
  - La comunicación entre el frontend y Supabase se realiza mediante solicitudes HTTP y WebSockets.

## Modelos de Datos

La aplicación gestiona datos relacionados con productos, incluyendo nombre, cantidad, precio y categoría. El modelo de datos se representa en la base de datos Supabase en la tabla "products".

## Decisiones de Diseño

- **Interfaz de Usuario:**

  - Se diseñó una interfaz de usuario simple y fácil de usar utilizando React y estilos básicos de CSS.
  - Se implementó un formulario para la creación y edición de productos, junto con funciones de búsqueda, filtrado y ordenamiento para una mejor experiencia del usuario.

- **Funcionalidades Adicionales:**
  - Se agregó la capacidad de generar informes en PDF utilizando las bibliotecas html2canvas y jsPDF.
  - Se incluyó la opción de buscar productos por nombre y filtrar por categoría.

## Problemas y Desafíos

Durante el desarrollo, se enfrentaron a algunos desafíos, entre ellos:

- **Ordenamiento y Filtrado:**

  - Asegurar que las funciones de ordenamiento y filtrado respondan correctamente a los cambios del usuario y a la actualización de datos en tiempo real.

- **Integración con Supabase:**

  - Garantizar una integración suave entre el frontend y el backend, manejando correctamente las operaciones CRUD y la gestión de estado.

- **Diseño Responsivo:**
  - Asegurar que la interfaz de usuario sea receptiva y funcione bien en diferentes tamaños de pantalla y dispositivos.

> [!TIP]
> ## Próximos Pasos

Para futuras mejoras, se pueden considerar:

- Implementar autenticación de usuario para gestionar permisos de edición y eliminación.
- Mejorar la interfaz de usuario con estilos más avanzados y una mejor experiencia de usuario.
- Agregar más funciones, como paginación para manejar grandes conjuntos de datos.

¡Gracias por explorar nuestra aplicación!
