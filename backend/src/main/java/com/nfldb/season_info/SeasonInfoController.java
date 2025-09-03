package com.nfldb.season_info;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/season")
public class SeasonInfoController {

    private final SeasonInfoService seasonInfoService;

    public SeasonInfoController(SeasonInfoService seasonInfoService) {
        this.seasonInfoService = seasonInfoService;
    }

    @GetMapping("/{seasonYear}")
    public SeasonInfo getSeasonInfo(@PathVariable Integer seasonYear) {
        return seasonInfoService.getSeasonInfo(seasonYear).orElse(null);
    }

    @GetMapping("/years-list")
    public List<Integer> getAvailableSeasons() {
        return seasonInfoService.getAvailableSeasons();
    }
}
