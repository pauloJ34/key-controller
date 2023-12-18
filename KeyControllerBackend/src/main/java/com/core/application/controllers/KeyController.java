package com.core.application.controllers;

import com.core.domain.dto.key.EditKeyDTO;
import com.core.domain.dto.key.ListKeyResultDTO;
import com.core.domain.models.UserType;
import com.core.infra.security.annotations.EnsureUserType;
import com.core.infra.security.annotations.JwtAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.core.domain.dto.authentication.KeyAuthentication;
import com.core.domain.models.Key;
import com.core.domain.models.Sector;
import com.core.domain.repository.KeyRepository;
import com.core.domain.repository.SectorRepository;
import com.core.application.errors.GlobalExceptionHandler;
import com.core.infra.security.JWT;

import java.util.List;


@RestController
public class KeyController { // extends GlobalExceptionHandler
    @Autowired
    KeyRepository keyRepository;

    @Autowired
    SectorRepository sectorRepository;

    @Autowired
    JWT jwtToken;

    @PostMapping("/key")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    @ResponseStatus(HttpStatus.CREATED)
    public Object save(@RequestBody KeyAuthentication key) {
        if (key.getSectorId() == null || key.getNumber() == null) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inconsistent Data");
        }

        boolean sectorExists = sectorRepository.existsById(key.getSectorId());

        if (!sectorExists) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Sector Not Found");
        }

        Sector sector = sectorRepository.findById(key.getSectorId()).get();
        Key dataKey = new Key(sector, key.getNumber());

        dataKey.setSector(sector);
        return keyRepository.save(dataKey);
    }

    @GetMapping("/key")
    public Page<ListKeyResultDTO> list(
        @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
        @RequestParam(value = "currentPage", required = false, defaultValue = "0") int currentPage,
        @RequestParam(value = "search", required = false) String search,
        @RequestParam(value = "sectorId", required = false) String sectorId,
        @RequestParam(value = "busy", required = false) String busy
    ) {
        Pageable pageable = PageRequest.of(currentPage, pageSize, Sort.by("id").ascending());
        return keyRepository.findAll(
            pageable,
            search,
            sectorId != null ? Integer.parseInt(sectorId) : null,
            busy != null ? "true".contentEquals(busy) : null
        );
    }

    @GetMapping("/key/{id}")
    public Object get(@PathVariable(value = "id") Integer id) {
        boolean keyExists = keyRepository.existsById(id);

        if (!keyExists) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Key Not Found");
        }

        return keyRepository.findById(id).get();
    }

    @GetMapping("/key/sector/{id}")
    public List<ListKeyResultDTO> listBySector(@PathVariable(value = "id") Integer id) {
        return keyRepository.findAllBySectorId(id);
    }

    @PutMapping("/key")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    public Object update(@RequestBody EditKeyDTO data) {
        if (data.getId() == null || data.getNumber() == null || data.getSectorId() == null) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inconsistent Data");
        }

        boolean keyExists = keyRepository.existsById(data.getId());
        boolean existsSector = sectorRepository.existsById(data.getSectorId());

        if (!keyExists) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Key Not Found");
        }

        if (!existsSector) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Sector Not Found");
        }

        Key key = keyRepository.findById(data.getId()).get();
        Sector sector = sectorRepository.findById(data.getSectorId()).get();

        key.setNumber(data.getNumber());
        key.setSector(sector);

        keyRepository.save(key);

        return key;
    }

    @PatchMapping("/key/{id}/delete")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseStatusException delete(@PathVariable(value = "id") Integer id) {
        if (!keyRepository.existsById(id)) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Key Not Found");
        }

        keyRepository.deleteById(id);
        return null;
    }
}
