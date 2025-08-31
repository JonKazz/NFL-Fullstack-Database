package com.nfldb.season_team_info;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class SeasonTeamInfoController {

    private final SeasonTeamInfoService seasonTeamInfoService;

    public SeasonTeamInfoController(SeasonTeamInfoService seasonTeamInfoService) {
        this.seasonTeamInfoService = seasonTeamInfoService;
    }

    @GetMapping("/info")
    public SeasonTeamInfo getTeamInfo(@RequestParam String teamId, @RequestParam Integer year) {
        return seasonTeamInfoService.getTeamInfo(teamId, year).orElse(null);
    }

    @GetMapping("/season/{year}")
    public List<SeasonTeamInfo> getTeamsBySeason(@PathVariable Integer year) {
        return seasonTeamInfoService.getTeamsBySeason(year);
    }

    @GetMapping("/season/{year}/stats")
    public List<SeasonTeamInfo> getTeamsStatsBySeason(@PathVariable Integer year) {
        return seasonTeamInfoService.getTeamsStatsBySeason(year);
    }
}
