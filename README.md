# Blog App

<br>

## To run the application locally on your sytem :

1. Make sure you have downloaded and installed **nodejs** in your system, if not install it from [nodejs](https://nodejs.org/en/download "nodejs.org")
   
2. Install **node_modules** by using the command in the terminal
   ```
   npm i
   ```
   
3. Create **.env** file and make changes
   ```
   MONGO_URL=<YOUR_MONGODB_CLUSTER_URL>
   PORT=8000
   ```
   
4. Run the command
   ```
   npm start
   ```
   
5. To **see** the application running go to <http://localhost:8000>

6. To **close** the running application press `CTRL + C` in terminal

<br>
<br>

## To run the application locally on your system ( **using Docker** ) :

1. Make sure you have downloaded and installed **docker** in your system, if not install it from [docker](https://www.docker.com/products/docker-desktop "docker.com")

2. **Create docker image** using the command
   ```
   docker build -t blog-app .
   ```

3. To **check the docker image is created** use the command
   ```
   docker images
   ```

4. To **run the docker image** use the command
   ```
   docker run --rm -d -p 8000:8000 blog-app
   ```

5. To **see** the application running go to <http://localhost:8000>

6. To **close** the running container use the command
   ```
   docker stop <CONTAINER ID>
   ```
