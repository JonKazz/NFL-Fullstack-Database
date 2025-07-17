package com.nfldb.team;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/info")
    public Team getTeamInfo(@RequestParam String teamId, @RequestParam Integer year) {
        return teamService.getTeamInfo(teamId, year).orElse(null);
    }
}
