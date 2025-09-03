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
    public SeasonTeamInfo getTeam(@RequestParam String teamId, @RequestParam Integer year) {
        return seasonTeamInfoService.getTeam(teamId, year).orElse(null);
    }

    @GetMapping("/season/{year}")
    public List<SeasonTeamInfo> getTeamsBySeason(@PathVariable Integer year) {
        return seasonTeamInfoService.getTeamsBySeason(year);
    }
}
