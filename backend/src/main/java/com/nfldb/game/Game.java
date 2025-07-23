package com.nfldb.game;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class Game {

    // 1. Identifiers
    @EmbeddedId
    private GameId id;
    private Integer year;

    // 2. Opponent & Result
    @Column(name = "opponent_id")
    private String opponentId;
    @Column(name = "home_game")
    private Boolean homeGame;
    private String result;

    // 3. Scoring
    @Column(name = "points_for")
    private Integer pointsFor;
    @Column(name = "points_against")
    private Integer pointsAgainst;

    // 4. Game Info
    @Column(name = "game_number")
    private Integer gameNumber;
    @Column(name = "season_week")
    private Integer seasonWeek;
    private String date;

    // 5. Offensive Stats
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

    // 6. Turnovers
    @Column(name = "fumbles_lost")
    private Integer fumblesLost;
    @Column(name = "interceptions_thrown")
    private Integer interceptionsThrown;

    // --- Getters and Setters ---

    // 1. Identifiers
    public GameId getId() { return id; }
    public void setId(GameId id) { this.id = id; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    // 2. Opponent & Result
    public String getOpponentId() { return opponentId; }
    public void setOpponentId(String opponentId) { this.opponentId = opponentId; }
    public Boolean getHomeGame() { return homeGame; }
    public void setHomeGame(Boolean homeGame) { this.homeGame = homeGame; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    // 3. Scoring
    public Integer getPointsFor() { return pointsFor; }
    public void setPointsFor(Integer pointsFor) { this.pointsFor = pointsFor; }
    public Integer getPointsAgainst() { return pointsAgainst; }
    public void setPointsAgainst(Integer pointsAgainst) { this.pointsAgainst = pointsAgainst; }

    // 4. Game Info
    public Integer getGameNumber() { return gameNumber; }
    public void setGameNumber(Integer gameNumber) { this.gameNumber = gameNumber; }
    public Integer getSeasonWeek() { return seasonWeek; }
    public void setSeasonWeek(Integer seasonWeek) { this.seasonWeek = seasonWeek; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    // 5. Offensive Stats
    public Integer getPassingYards() { return passingYards; }
    public void setPassingYards(Integer passingYards) { this.passingYards = passingYards; }
    public Integer getPassingTouchdowns() { return passingTouchdowns; }
    public void setPassingTouchdowns(Integer passingTouchdowns) { this.passingTouchdowns = passingTouchdowns; }
    public Integer getRushingYards() { return rushingYards; }
    public void setRushingYards(Integer rushingYards) { this.rushingYards = rushingYards; }
    public Integer getRushingTouchdowns() { return rushingTouchdowns; }
    public void setRushingTouchdowns(Integer rushingTouchdowns) { this.rushingTouchdowns = rushingTouchdowns; }
    public Integer getFieldGoalsMade() { return fieldGoalsMade; }
    public void setFieldGoalsMade(Integer fieldGoalsMade) { this.fieldGoalsMade = fieldGoalsMade; }

    // 6. Turnovers
    public Integer getFumblesLost() { return fumblesLost; }
    public void setFumblesLost(Integer fumblesLost) { this.fumblesLost = fumblesLost; }
    public Integer getInterceptionsThrown() { return interceptionsThrown; }
    public void setInterceptionsThrown(Integer interceptionsThrown) { this.interceptionsThrown = interceptionsThrown; }
}
