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

    /**
     * Get team information for a specific team and season
     * @param teamId The team identifier
     * @param year The season year
     * @return SeasonTeamInfo object or null if not found
     */
    @GetMapping("/{teamId}/{year}")
    public SeasonTeamInfo getTeam(@PathVariable String teamId, @PathVariable Integer year) {
        return seasonTeamInfoService.getTeam(teamId, year).orElse(null);
    }

    /**
     * Get all teams for a specific season
     * @param year The season year
     * @return List of SeasonTeamInfo objects for the specified year
     */
    @GetMapping("/season/{year}")
    public List<SeasonTeamInfo> getTeamsBySeason(@PathVariable Integer year) {
        return seasonTeamInfoService.getTeamsBySeason(year);
    }
}
