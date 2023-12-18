package com.core.application.controllers;

import com.core.domain.models.UserType;
import com.core.infra.security.annotations.EnsureUserType;
import com.core.infra.security.annotations.JwtAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.core.domain.models.Sector;
import com.core.domain.repository.SectorRepository;
import com.core.application.errors.GlobalExceptionHandler;

@RestController
public class SectorController { // extends GlobalExceptionHandler
    @Autowired
    SectorRepository sectorRepository;

    @PostMapping("/sector")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    @ResponseStatus(HttpStatus.CREATED)
    public Object save(@RequestBody Sector sector) {
        if(sector.getName() == null) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inconsistent Data");
        }

        return sectorRepository.save(sector);
    }

    @GetMapping("/sector")
    public Page<Sector> list(
        @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
        @RequestParam(value = "currentPage", required = false, defaultValue = "0") int currentPage,
        @RequestParam(value = "search", required = false) String search
    ) {
        Specification<Sector> spec = Specification.where(null);
        Pageable pageable = PageRequest.of(currentPage, pageSize, Sort.by("id").ascending());

        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + search.toLowerCase() + "%")
            );
        }

        return sectorRepository.findAll(spec, pageable);
    }

    @GetMapping("/sector/{id}")
    public Object listUnique(@PathVariable(value = "id") Integer id) {
        boolean sectorExists = sectorRepository.existsById(id);

        if (!sectorExists) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Sector Not Found");
        }

        return sectorRepository.findById(id).get();
    }

    @PutMapping("/sector")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    public Object update(@RequestBody Sector sector) {
        boolean sectorExists = sectorRepository.existsById(sector.getId());

        if (!sectorExists) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Sector Not Found");
        }

        if(sector.getName() == null){
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inconsistent Data");
        }

        Sector update = sectorRepository.findById(sector.getId()).get();

        update.setName(sector.getName());
        sectorRepository.save(update);

        return update;
    }

    @PatchMapping("/sector/{id}/delete")
    @JwtAuthentication
    @EnsureUserType(UserType.ADMIN)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseStatusException delete(@PathVariable(value = "id") Integer id) {
        if (!sectorRepository.existsById(id)) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Sector Not Found");
        }

        sectorRepository.deleteById(id);
        return null;
    }
}
