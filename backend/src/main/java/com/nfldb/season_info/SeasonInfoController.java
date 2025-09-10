package com.nfldb.season_info;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/season")
public class SeasonInfoController {

    private final SeasonInfoService seasonInfoService;

    /**
     * Constructor for SeasonInfoController
     * @param seasonInfoService The SeasonInfoService dependency
     */
    public SeasonInfoController(SeasonInfoService seasonInfoService) {
        this.seasonInfoService = seasonInfoService;
    }

    /**
     * Get season information for a specific year
     * @param seasonYear The year to get season info for
     * @return SeasonInfo object or null if not found
     */
    @GetMapping("/{seasonYear}")
    public SeasonInfo getSeasonInfo(@PathVariable Integer seasonYear) {
        return seasonInfoService.getSeasonInfo(seasonYear).orElse(null);
    }

    /**
     * Get all available seasons
     * @return List of season years in descending order
     */
    @GetMapping("/years-list")
    public List<Integer> getAvailableSeasons() {
        return seasonInfoService.getAvailableSeasons();
    }

    /**
     * Check if a season exists in the database
     * @param seasonYear The year to check
     * @return true if season exists, false otherwise
     */
    @GetMapping("/exists/{seasonYear}")
    public boolean checkSeasonExists(@PathVariable Integer seasonYear) {
        return seasonInfoService.checkSeasonExists(seasonYear);
    }
}
