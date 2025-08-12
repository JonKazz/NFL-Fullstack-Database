package com.nfldb.player_profiles;

import org.springframework.stereotype.Service;

@Service
public class PlayerProfileService {
    
    private final PlayerProfileRepository repository;

    public PlayerProfileService(PlayerProfileRepository repository) {
        this.repository = repository;
    }

    public PlayerProfile getPlayerProfile(String playerId) {
        return repository.findByPlayerId(playerId);
    }

    public PlayerProfile savePlayerProfile(PlayerProfile playerProfile) {
        return repository.save(playerProfile);
    }
} 