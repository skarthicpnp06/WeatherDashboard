package com.example.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.DisasterHistoryEntity;

@Repository
public interface DisasterHistoryRepository extends JpaRepository<DisasterHistoryEntity, Long> {
    List<DisasterHistoryEntity> findByCityOrderByDateDesc(String city);
    long count();
}
