package com.core.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.core.domain.models.User;

public interface UserRepository extends JpaRepository<User, String>{
     
     User findByRegistry(String registry);
}
