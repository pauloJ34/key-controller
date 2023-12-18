package com.core.infra.security.interceptors;
import com.core.infra.security.JWT;
import com.core.infra.security.annotations.JwtAuthentication;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;

@Slf4j
@Component
public class JwtAuthenticationInterceptor implements HandlerInterceptor {
    private final JWT jwt;

    public JwtAuthenticationInterceptor(JWT jwt) {
        this.jwt = jwt;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        Method method = handlerMethod.getMethod();

        if (!method.isAnnotationPresent(JwtAuthentication.class)) {
            return true;
        }

        String authorization = request.getHeader("Authorization");

        if (authorization == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorized is required");
            return false;
        }

        try {
            String registration = jwt.authorize(authorization);
            request.setAttribute("registry", registration);
            return true;
        } catch (JwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
            return false;
        }
    }
}
