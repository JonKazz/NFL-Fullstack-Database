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
    
    @GetMapping("/{playerId}")
    public java.util.Map<String, Object> getPlayerProfileById(@PathVariable String playerId) {
        PlayerProfile profile = playerProfileService.getPlayerProfile(playerId);
        
        if (profile == null) {
            return java.util.Map.of(
                "exists", false,
                "message", "Profile not yet populated in database"
            );
        }
        
        return java.util.Map.of(
            "exists", true,
            "profile", profile
        );
    }
    
    @GetMapping("/count")
    public Long getTotalPlayerProfilesCount() {
        return playerProfileService.getTotalPlayerProfilesCount();
    }
} 