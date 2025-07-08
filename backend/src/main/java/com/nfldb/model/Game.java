package com.nfldb.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @Column(name = "game_id")
    private String gameId;

    private String team;
    private Integer year;
    private String opponent;
    private String result;

    @Column(name = "game_number")
    private Integer gameNumber;

    @Column(name = "season_week")
    private Integer seasonWeek;

    @Column(name = "passing_yards")
    private Integer passingYards;

    @Column(name = "passing_touchdowns")
    private Integer passingTouchdowns;

    @Column(name = "rushing_yards")
    private Integer rushingYards;

    @Column(name = "rushing_touchdowns")
    private Integer rushingTouchdowns;

    @Column(name = "field_goals_made")
    private Integer fieldGoalsMade;

    @Column(name = "fumbles_lost")
    private Integer fumblesLost;

    @Column(name = "interceptions_thrown")
    private Integer interceptionsThrown;

    // Getters
    public String getGameId() { return gameId; }
    public String getTeam() { return team; }
    public Integer getYear() { return year; }
    public Integer getGameNumber() { return gameNumber; }
    public Integer getSeasonWeek() { return seasonWeek; }
    public String getOpponent() { return opponent; }
    public String getResult() { return result; }
    public Integer getPassingYards() { return passingYards; }
    public Integer getPassingTouchdowns() { return passingTouchdowns; }
    public Integer getRushingYards() { return rushingYards; }
    public Integer getRushingTouchdowns() { return rushingTouchdowns; }
    public Integer getFieldGoalsMade() { return fieldGoalsMade; }
    public Integer getFumblesLost() { return fumblesLost; }
    public Integer getInterceptionsThrown() { return interceptionsThrown; }

    // Setters
    public void setGameId(String gameId) { this.gameId = gameId; }
    public void setTeam(String team) { this.team = team; }
    public void setYear(Integer year) { this.year = year; }
    public void setGameNumber(Integer gameNumber) { this.gameNumber = gameNumber; }
    public void setSeasonWeek(Integer seasonWeek) { this.seasonWeek = seasonWeek; }
    public void setOpponent(String opponent) { this.opponent = opponent; }
    public void setResult(String result) { this.result = result; }
    public void setPassingYards(Integer passingYards) { this.passingYards = passingYards; }
    public void setPassingTouchdowns(Integer passingTouchdowns) { this.passingTouchdowns = passingTouchdowns; }
    public void setRushingYards(Integer rushingYards) { this.rushingYards = rushingYards; }
    public void setRushingTouchdowns(Integer rushingTouchdowns) { this.rushingTouchdowns = rushingTouchdowns; }
    public void setFieldGoalsMade(Integer fieldGoalsMade) { this.fieldGoalsMade = fieldGoalsMade; }
    public void setFumblesLost(Integer fumblesLost) { this.fumblesLost = fumblesLost; }
    public void setInterceptionsThrown(Integer interceptionsThrown) { this.interceptionsThrown = interceptionsThrown; }
}
