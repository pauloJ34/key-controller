package com.core.infra.security.interceptors;

import com.core.domain.models.User;
import com.core.domain.models.UserType;
import com.core.domain.repository.UserRepository;
import com.core.infra.security.annotations.EnsureUserType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;
import java.util.Objects;

@Slf4j
@Component
public class EnsureUserTypeInterceptor implements HandlerInterceptor {
    private final UserRepository userRepository;

    public EnsureUserTypeInterceptor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        Method method = handlerMethod.getMethod();

        if (!method.isAnnotationPresent(EnsureUserType.class)) {
            return true;
        }
        Object registry = request.getAttribute("registry");

        if (registry == null) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Route not authenticated");
            return false;
        }

        EnsureUserType annotation = method.getAnnotation(EnsureUserType.class);
        UserType userType = annotation.value();

        User user = this.userRepository.findByRegistry(registry.toString());

        if (user == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return false;
        }

        if (!Objects.equals(user.getType(), userType)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Not authorized");
            return false;
        }

        return true;
    }
}
