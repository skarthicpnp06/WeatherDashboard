package com.example.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.WeatherEntity;

@Repository
public interface WeatherRepository extends JpaRepository<WeatherEntity, Long> {
    List<WeatherEntity> findByCityOrderByIdDesc(String city);
    WeatherEntity findFirstByCityOrderByIdDesc(String city);
    WeatherEntity findTopByCityOrderByIdDesc(String city);
}