package com.nfldb.gameinfo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "game_info")
public class GameInfo {

    // 1. GameId
    @Id
    @Column(name = "game_id")
    private String gameId;

    // 2. TeamIds
    @Column(name = "away_team_id")
    private String awayTeamId;
    @Column(name = "home_team_id")
    private String homeTeamId;
    @Column(name = "winning_team_id")
    private String winningTeamId;

    // 3. Score Info
    @Column(name = "away_points")
    private Integer awayPoints;
    @Column(name = "home_points")
    private Integer homePoints;

    // 3. Date Info
    @Column(name = "date")
    private String date;
    @Column(name = "season_year")
    private Integer seasonYear;
    @Column(name = "season_week")
    private Integer seasonWeek;

    // 4. OverTime
    @Column(name = "overtime")
    private Boolean overtime;
}
