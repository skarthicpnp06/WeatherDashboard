package com.example.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.DisasterAlertEntity;

@Repository
public interface DisasterAlertRepository extends JpaRepository<DisasterAlertEntity, Long> {
    List<DisasterAlertEntity> findByCityOrderByCreatedAtDesc(String city);
    List<DisasterAlertEntity> findTop10ByOrderByCreatedAtDesc();
    long count();

    @Query("SELECT d.alertType, COUNT(d) FROM DisasterAlertEntity d GROUP BY d.alertType ORDER BY COUNT(d) DESC")
    List<Object[]> findAlertTypeFrequency();
}