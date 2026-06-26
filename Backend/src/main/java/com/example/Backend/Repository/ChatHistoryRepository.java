package com.example.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Backend.Model.Chathistoryentity;

@Repository
public interface ChatHistoryRepository extends JpaRepository<Chathistoryentity, Long> {
    List<Chathistoryentity> findTop10ByOrderByTimestampDesc();
    long count();

    @Query("SELECT COUNT(c) FROM Chathistoryentity c")
    long countAllChats();
}