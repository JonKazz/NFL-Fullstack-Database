package com.nfldb.player_profiles;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerProfileRepository extends JpaRepository<PlayerProfile, String> {
        PlayerProfile findByPlayerId(String playerId);
} 