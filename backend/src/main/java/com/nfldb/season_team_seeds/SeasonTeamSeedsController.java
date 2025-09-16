package com.nfldb.season_team_seeds;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/team-seeds")
public class SeasonTeamSeedsController {

    private final SeasonTeamSeedsService seasonTeamSeedsService;

    public SeasonTeamSeedsController(SeasonTeamSeedsService seasonTeamSeedsService) {
        this.seasonTeamSeedsService = seasonTeamSeedsService;
    }

    /**
     * Get team seeds by ID
     * ID format: {conference}_{seasonYear} (e.g., "AFC_2023", "NFC_2023")
     * @param id The ID of the team seeds record
     * @return SeasonTeamSeeds object or null if not found
     */
    @GetMapping("/{id}")
    public SeasonTeamSeeds getTeamSeedsById(@PathVariable String id) {
        return seasonTeamSeedsService.getTeamSeedsById(id).orElse(null);
    }
}
