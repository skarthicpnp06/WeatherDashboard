package com.example.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.AlertEntity;

@Repository
public interface AlertRepository extends JpaRepository<AlertEntity, Long> {
    long count();
}