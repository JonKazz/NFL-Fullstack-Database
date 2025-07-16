package com.nfldb.game;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class Game {

    @EmbeddedId
    private GameId id;

    private Integer year;
    private String opponent;
    private String result;

    @Column(name = "date")
    private String date;

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
    public GameId getId() {
        return id;
    }

    public Integer getYear() {
        return year;
    }

    public String getOpponent() {
        return opponent;
    }

    public String getResult() {
        return result;
    }

    public String getDate() {
        return date;
    }

    public Integer getGameNumber() {
        return gameNumber;
    }

    public Integer getSeasonWeek() {
        return seasonWeek;
    }

    public Integer getPassingYards() {
        return passingYards;
    }

    public Integer getPassingTouchdowns() {
        return passingTouchdowns;
    }

    public Integer getRushingYards() {
        return rushingYards;
    }

    public Integer getRushingTouchdowns() {
        return rushingTouchdowns;
    }

    public Integer getFieldGoalsMade() {
        return fieldGoalsMade;
    }

    public Integer getFumblesLost() {
        return fumblesLost;
    }

    public Integer getInterceptionsThrown() {
        return interceptionsThrown;
    }

    // Setters
    public void setId(GameId id) {
        this.id = id;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setOpponent(String opponent) {
        this.opponent = opponent;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setGameNumber(Integer gameNumber) {
        this.gameNumber = gameNumber;
    }

    public void setSeasonWeek(Integer seasonWeek) {
        this.seasonWeek = seasonWeek;
    }

    public void setPassingYards(Integer passingYards) {
        this.passingYards = passingYards;
    }

    public void setPassingTouchdowns(Integer passingTouchdowns) {
        this.passingTouchdowns = passingTouchdowns;
    }

    public void setRushingYards(Integer rushingYards) {
        this.rushingYards = rushingYards;
    }

    public void setRushingTouchdowns(Integer rushingTouchdowns) {
        this.rushingTouchdowns = rushingTouchdowns;
    }

    public void setFieldGoalsMade(Integer fieldGoalsMade) {
        this.fieldGoalsMade = fieldGoalsMade;
    }

    public void setFumblesLost(Integer fumblesLost) {
        this.fumblesLost = fumblesLost;
    }

    public void setInterceptionsThrown(Integer interceptionsThrown) {
        this.interceptionsThrown = interceptionsThrown;
    }
}
