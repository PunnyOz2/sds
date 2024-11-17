# **DeepGI Web Demo Backend with Django**

---

## **Build image**

Using command

```sh
docker-compose build
```

## **Start app**

Using command

```sh
docker-compose up -d
```

> You should run `docker-compose build` at least once because local machine doesn't have docker image name `deepgi/backend`, and then you can use `docker-compose up --build -d` for rebuild image and start at the same time

## **Stop app**

Using command

```sh
docker-compose down
```

## **Setup database (Only First time)**

-   Start app
-   Run django migration by command

```sh
docker-compose run app python3.9 manage.py migrate
```

-   Stop app
-   Database is already created for this app. You can use `docker-compose up -d` command for using this app.

---

> List of APIs is in **`Capstone-peerapon` Postman workspace** and **`Capstone-Backend` Postman Collection**
