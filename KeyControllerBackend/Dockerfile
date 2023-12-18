FROM openjdk:17-alpine

ENV APP_NAME key-controller*

COPY ./target/${APP_NAME}.jar /app/${APP_NAME}.jar

WORKDIR /app

CMD java -jar ${APP_NAME}.jar

EXPOSE 8080
# FROM openjdk:17-alpine

# ENV APP_NAME key-controller

# WORKDIR /app
 
# COPY .mvn/ .mvn

# COPY mvnw pom.xml ./

# RUN ./mvnw dependency:go-offline

# EXPOSE 8080
# COPY src ./src
 
# CMD ["./mvnw", "spring-boot:run"]

# FROM nginx:alpine

# RUN rm /etc/nginx/conf.d/default.conf

# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # COPY nginx/cert.crt /etc/nginx/conf.d

# # COPY nginx/ssl.key /etc/nginx/conf.d

# EXPOSE 80

# EXPOSE 443

# ENTRYPOINT ["nginx", "-g", "daemon off;"]