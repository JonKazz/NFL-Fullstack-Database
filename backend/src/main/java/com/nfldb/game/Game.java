package com.nfldb.game;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "game_info")
public class Game {

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

    // 3. Date Info
    @Column(name = "date")
    private String date;
    @Column(name = "season_year")
    private Integer seasonYear;
    @Column(name = "season_week")
    private Integer seasonWeek;


    // --- Getters and Setters ---

    
    // 1. GameId
    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    // 2. TeamIds
    public String getAwayTeamId() { return awayTeamId; }
    public void setAwayTeamId(String awayTeamId) { this.awayTeamId = awayTeamId; }
    public String getHomeTeamId() { return homeTeamId; }
    public void setHomeTeamId(String homeTeamId) { this.homeTeamId = homeTeamId; }
    public String getWinningTeamId() { return winningTeamId; }
    public void setWinningTeamId(String winningTeamId) { this.winningTeamId = winningTeamId; }

    // 3. Date Info
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Integer getSeasonYear() { return seasonYear; }
    public void setSeasonYear(Integer seasonYear) { this.seasonYear = seasonYear; }
    public Integer getSeasonWeek() { return seasonWeek; }
    public void setSeasonWeek(Integer seasonWeek) { this.seasonWeek = seasonWeek; }
}
