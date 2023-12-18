package com.core.application.controllers;

import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import com.core.application.errors.GlobalExceptionHandler;
import com.core.domain.dto.JWTObject;
import com.core.domain.dto.authentication.UserAuthentication;
import com.core.domain.dto.suap.SuapTokens;
import com.core.domain.dto.suap.SuapUser;
import com.core.domain.models.User;
import com.core.domain.models.UserType;
import com.core.domain.repository.UserRepository;
import com.core.infra.security.JWT;
import com.core.infra.security.annotations.JwtAuthentication;
import com.core.infra.suap.SuapAPI;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class UserController { // extends GlobalExceptionHandler
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    JWT jwt;

    @Autowired
    SuapAPI suapApi;

    @PostMapping("/user/login")
    public JWTObject auth(@RequestBody UserAuthentication authorization) throws RestClientException, URISyntaxException {
        try{
            SuapTokens suapTokens = suapApi.login(authorization);
            SuapUser user = suapApi.getUserData(suapTokens.getAccess());

            User userExists = this.userRepository.findByRegistry(user.getMatricula());

            // User userExists = this.userRepository.findByRegistry(authorization.getRegistry());
            if (userExists == null) {
                // UserType type = authorization.getType().equals("Aluno") ? UserType.STUDENT : UserType.SERVER;
                // User newUser = new User(authorization.getRegistry(), authorization.getUsername() , type);
                // this.userRepository.save(newUser);

                UserType userType = user.getMatricula().length() == 14 ? UserType.STUDENT : UserType.SERVER;
                User newUser = new User(user.getMatricula(),user.getNome_usual() , userType);

                this.userRepository.save(newUser);

            }

            // return jwt.generateToken(authorization.getRegistry());
            return jwt.generateToken(user.getMatricula());
        }catch(Exception e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Credential");
        }

    }

    @GetMapping("/user/data")
    @JwtAuthentication
    public User getData(HttpServletRequest request) {
    // public User getData(@RequestAttribute("registry") String registry) {
        //  return userRepository.findByRegistry(registry);
        return userRepository.findByRegistry(request.getAttribute("registry").toString());

    }
}
