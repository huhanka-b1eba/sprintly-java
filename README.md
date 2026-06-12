# Sprintly

Sprintly — веб-приложение для управления проектами и задачами команды.
Система объединяет модуль задач, Kanban-доску и ролевую модель доступа в рамках единой архитектуры.

---

## Архитектура

Система разделена на frontend и backend с независимыми зонами ответственности.

### Frontend

* Next.js (App Router)
* TypeScript
* TanStack Query (server state)
* Redux Toolkit (глобальное состояние и auth)
* Shadcn UI (компоненты)
* Feature-Sliced Design (FSD)
* dnd-kit (drag & drop)

Ключевые принципы:

* Разделение server state и client state
* Изоляция бизнес-логики на уровне features
* Минимизация проп-дриллинга
* Управление доступом на уровне UI через role-based rendering

---

### Backend

* Spring Boot
* Spring MVC
* Spring Security
* Spring Data JPA
* PostgreSQL
* REST API
* OpenAPI
* DTO + валидация данных
* Soft delete

Ключевые принципы:

* Multi-tenant изоляция через organizationId
* Разделение логики по слоям Controller -> Service -> Repository
* Проверка прав доступа через Spring Security
* Валидация входных данных на уровне DTO
* Явная доменная модель и работа через JPA

---

## Запуск через Docker Compose

Docker Compose конфигурация находится в директории `java-backend` и поднимает backend, PostgreSQL и Redis.

1. Перейдите в директорию backend:

```bash
cd java-backend
```

2. Создайте `.env` на основе примера и заполните значения секретов:

```bash
cp .env.example .env
```

3. Соберите и запустите контейнеры:

```bash
docker compose up --build
```

После запуска backend будет доступен на `http://localhost:8080`.

Полезные команды:

```bash
# Запуск в фоне
docker compose up --build -d

# Просмотр логов backend
docker compose logs -f app

# Остановка контейнеров
docker compose down

# Остановка с удалением volume PostgreSQL и Redis
docker compose down -v
```

По умолчанию сервисы доступны на следующих портах:

* Backend: `8080`
* PostgreSQL: `5432`
* Redis: `6379`

---

## Модули системы

### Организации

* Создание и управление рабочим пространством команды
* Изоляция данных между организациями
* Привязка пользователей, проектов и задач к организации

---

### Проекты

* Создание и редактирование проектов
* Группировка задач внутри проекта
* Разделение рабочих процессов по отдельным проектам

---

### Задачи

* Просмотр списка задач
* Создание / редактирование / soft delete
* Kanban-доска с drag & drop
* Назначение исполнителя
* Приоритеты и дедлайны
* Rich-text описание
* Фильтрация по статусу и исполнителю
* Поиск по названию
* Сортировка по приоритету и дате
* Массовое обновление статусов
* Комментарии к задачам
* Таймлайн изменений задачи

---

## Авторизация и безопасность

Реализован production-подход к аутентификации:

* Access token хранится в памяти
* Refresh token хранится в httpOnly cookie
* Реализована ротация refresh токенов
* Автоматический refresh при 401
* Защита API через Guards
* Проверка ролей на backend
* Защита маршрутов на frontend
* Изоляция данных по organizationId

---

## Доменная модель

Основные сущности:

* Organization
* User
* Project
* Task
* Board
* Column
* Comment

Каждая сущность привязана к организации. Данные между организациями полностью изолированы.

---

## Архитектурные решения

* Multi-tenant модель через organizationId вместо отдельных БД
* Разделение server/client state через TanStack Query + RTK
* Soft delete вместо физического удаления для сохранения истории
