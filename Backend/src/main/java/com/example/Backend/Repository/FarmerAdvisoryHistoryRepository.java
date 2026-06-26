package com.example.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.Farmeradvisoryhistoryentity;

@Repository
public interface FarmerAdvisoryHistoryRepository extends JpaRepository<Farmeradvisoryhistoryentity, Long> {
    List<Farmeradvisoryhistoryentity> findTop10ByOrderByGeneratedAtDesc();
    long count();
}