package com.nfldb.team;

import com.nfldb.team.Team;
import com.nfldb.team.TeamService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/info")
    public Team getTeamInfo(@RequestParam String team, @RequestParam Integer year) {
        return teamService.getTeamInfo(team, year).orElse(null);
    }
}
