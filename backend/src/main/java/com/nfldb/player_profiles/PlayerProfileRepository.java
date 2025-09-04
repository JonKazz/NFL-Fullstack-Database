package com.nfldb.player_profiles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PlayerProfileRepository extends JpaRepository<PlayerProfile, String> {
        PlayerProfile findByPlayerId(String playerId);
        
        @Query("SELECT COUNT(p) FROM PlayerProfile p")
        Long countAllPlayerProfiles();
} 