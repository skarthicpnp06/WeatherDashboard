package com.example.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.WeatherEntity;

@Repository
public interface WeatherRepository extends JpaRepository<WeatherEntity, Long> {

    List<WeatherEntity> findByCityOrderByIdDesc(String city);

    WeatherEntity findFirstByCityOrderByIdDesc(String city);

    WeatherEntity findTopByCityOrderByIdDesc(String city);

    @Query("SELECT DISTINCT w.city FROM WeatherEntity w WHERE w.city LIKE CONCAT(:prefix, '%') ORDER BY w.city ASC")
    List<String> findDistinctCitiesByPrefix(@Param("prefix") String prefix);

    @Query("SELECT COUNT(w) FROM WeatherEntity w")
    long countAllSearches();

    @Query("SELECT w.city, COUNT(w) as cnt FROM WeatherEntity w GROUP BY w.city ORDER BY cnt DESC")
    List<Object[]> findTopSearchedCities();

    @Query("SELECT COUNT(DISTINCT w.city) FROM WeatherEntity w")
    long countDistinctCities();
}