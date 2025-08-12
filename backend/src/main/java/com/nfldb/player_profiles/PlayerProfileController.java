package com.nfldb.player_profiles;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player-profiles")
public class PlayerProfileController {
    
    private final PlayerProfileService playerProfileService;

    public PlayerProfileController(PlayerProfileService playerProfileService) {
        this.playerProfileService = playerProfileService;
    }

    @GetMapping("/player")
    public PlayerProfile getPlayerProfile(@RequestParam String playerId) {
        return playerProfileService.getPlayerProfile(playerId);
    }
} 