package com.core.infra.suap;

import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.core.domain.dto.authentication.UserAuthentication;
import com.core.domain.dto.suap.SuapTokens;
import com.core.domain.dto.suap.SuapUser;

@Service
public class SuapAPI {
    @Value("${url.suap}")
    private String url;

    public SuapTokens login(UserAuthentication request){
        RestTemplate requestPost= new RestTemplate();
        SuapTokens userToken = requestPost.postForObject( url+"/api/v2/autenticacao/token/", request, SuapTokens.class);
        return userToken;
    }
    
    public SuapUser getUserData(String authToken) throws RestClientException, URISyntaxException{
        RestTemplate requestPost= new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(authToken);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<SuapUser> user = requestPost.exchange( url+"/api/v2/minhas-informacoes/meus-dados/", HttpMethod.GET, requestEntity, SuapUser.class);

        return user.getBody();
    }
}