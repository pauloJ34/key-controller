package com.core.infra.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.core.domain.dto.JWTObject;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service 
public class JWT {
    
    @Value("${security.config.key}")
    private String secret;

    @Value("${security.config.prefix}")
    private String prefix;

    @Value("${security.config.expiration}")
    private int timeExpiration;

    public JWTObject generateToken(String subject) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); // não mecha nisso

        String jwtToken = Jwts.builder()
                .setSubject(subject)
                .setIssuer("Key-Controller")
                .setIssuedAt(new Date())
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(new Date( (System.currentTimeMillis() + timeExpiration * 1000L) ) )
                .compact();

        return new JWTObject(jwtToken);
    }

    public String authorize(String tokenEncoded){
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        Jws<Claims> decoded = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(tokenEncoded.substring(prefix.length()).trim());

        return decoded.getBody().getSubject();
    }
}