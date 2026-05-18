# 🎰 Ecosistema de Microservicios Backend - Casino BlackJack

Este repositorio contiene la arquitectura distribuida del backend para la plataforma de Casino y Microservicios autónomos relacionados.

---

## 🚀 Tecnologías y Dependencias Comunes
Todos los componentes del ecosistema comparten el mismo arquetipo tecnológico base para asegurar una integración limpia:
* **Lenguaje:** Java 21 
* **Framework:**
* **Gestor de Dependencias:** Maven
* **Base de Datos:** MySQL
* **Dependencias Core (pom.xml):**
  * `Spring Web` (Construcción de endpoints REST)
  * `Spring Data JPA` (Persistencia y mapeo ORM)
  * `Validation` (Restricciones y seguridad de datos)
  * `MySQL Driver` (Conector de base de datos)
  * `Lombok` (Optimización de código mediante anotaciones)
  * `Spring Boot DevTools` (Recarga rápida en desarrollo)

---

## 📌 Configuración del Entorno de Desarrollo
Para compilar, ejecutar y conectar correctamente los microservicios con sus respectivas bases de datos, es mandatorio contar con las siguientes herramientas en el IDE (WebStorm / VS Code):
1. **Extension Pack for Java** (Soporte completo del ciclo de vida de Java).
2. **Spring Boot Extension Pack** (Orquestación, ejecución y autocompletado de properties).

---

## 🛠️ Catálogo de Microservicios y Puertos Exposiciones
Cada microservicio opera de forma aislada en su lógica de negocio y esquemas de base de datos, pero se exponen centralizadamente de cara al Frontend a través de la arquitectura BFF en la ruta raíz `http://localhost:7575`.

### 1. Microservicio de Juegos (`juegos-microservicio`)
* **Puerto Base:** `localhost:7575/juegos`
* **Misión:** Automatización de los catálogos de juegos disponibles en el casino.

### 2. Microservicio de Billeteras (`wallet-microservicio`)
* **Puerto Base:** `localhost:7575/wallet`
* **Misión:** Control transaccional de saldos disponibles, saldos bloqueados, auditoría de cuentas y soporte multimoneda (USD, CLP, EUR).

### 3. Microservicio de Apuestas (`apuestas-services`)
* **Puerto Base:** `localhost:7575/apuestas`
* **Misión:** Gestión integral del ciclo de vida de los tickets de apuestas, cuotas, estados de resolución y comunicación síncrona vía REST para la validación de fondos en tiempo real.

### 4. Microservicio de Usuarios (`usuarios-microservicios`)
* **Puerto Base:** `localhost:7575/usuario`
* **Misión:** Mejorar la gestión, autenticación, perfiles e información operacional de los usuarios del Casino.

### 5. Microservicio de Límites Responsables (`LimitesResponsables-Microservicios`)
* **Puerto Base:** `localhost:7575/limites`
* **Misión:** Manejar los límites de saldo, restricciones preventivas y topes financieros de cada usuario del casino para la promoción del juego responsable.

### 6. Microservicio de Eventos (`eventos-microservicios`)
* **Puerto Base:** `localhost:7575/eventos`
* **Misión:** Administración de los partidos deportivos, ligas asociadas y actualización del estado del partido en tiempo real.

---

# - REPOSITORIOS ORIGINALES

* Repositorio del microservicio de juegos -> https://github.com/javierC1712/juegos-microservicio.git
* Repositorio del microservicio de Usuario -> https://github.com/javierC1712/usuarios-microservicios.git
* Repositorio del microservicio de Limites Responsables -> https://github.com/javierC1712/LimitesResponsables-Microservicios.git
* Repositorio del microservicio de Eventos -> https://github.com/javierC1712/eventos-microserevicios.git
* Repositorio del microservicio de Billetera-> https://github.com/ElMaVio/wallet-microservicio.git
* Repositorio del microservicio de Apuestas -> https://github.com/ElMaVio/apuestas-services.git
