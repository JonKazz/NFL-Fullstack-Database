package com.nfldb.season_info;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/season-info")
public class SeasonInfoController {

    private final SeasonInfoService seasonInfoService;

    public SeasonInfoController(SeasonInfoService seasonInfoService) {
        this.seasonInfoService = seasonInfoService;
    }

    @GetMapping("/{seasonYear}")
    public SeasonInfo getSeasonInfo(@PathVariable Integer seasonYear) {
        return seasonInfoService.getSeasonInfoWithPlayerNames(seasonYear).orElse(null);
    }

    @GetMapping("/seasons")
    public List<Integer> getAvailableSeasons() {
        return seasonInfoService.getAvailableSeasons();
    }

    @GetMapping("/all")
    public List<SeasonInfo> getAllSeasons() {
        return seasonInfoService.getAllSeasons();
    }

    @PostMapping
    public SeasonInfo createSeasonInfo(@RequestBody SeasonInfo seasonInfo) {
        return seasonInfoService.saveSeasonInfo(seasonInfo);
    }

    @PutMapping("/{seasonYear}")
    public SeasonInfo updateSeasonInfo(@PathVariable Integer seasonYear, @RequestBody SeasonInfo seasonInfo) {
        seasonInfo.setSeasonYear(seasonYear);
        return seasonInfoService.saveSeasonInfo(seasonInfo);
    }
}
