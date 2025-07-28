package com.nfldb.gamestats;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Table;

@Entity
@Table(name = "game_stats")
public class GameStats {

    // 1. Composite Key (game_id, team_id)
    @EmbeddedId
    private GameStatsId id;

    // 2. Points
    @Column(name = "points_q1")
    private Integer pointsQ1;
    @Column(name = "points_q2")
    private Integer pointsQ2;
    @Column(name = "points_q3")
    private Integer pointsQ3;
    @Column(name = "points_q4")
    private Integer pointsQ4;
    @Column(name = "points_overtime")
    private Integer pointsOvertime;
    @Column(name = "points_total")
    private Integer pointsTotal;

    // 3. Total Yards
    @Column(name = "total_yards")
    private Integer totalYards;

    // 4. Rushing
    @Column(name = "rushing_attempts")
    private Integer rushingAttempts;
    @Column(name = "rushing_yards")
    private Integer rushingYards;
    @Column(name = "rushing_touchdowns")
    private Integer rushingTouchdowns;

    // 5. Passing
    @Column(name = "passing_attempts")
    private Integer passingAttempts;
    @Column(name = "passing_completions")
    private Integer passingCompletions;
    @Column(name = "passing_yards")
    private Integer passingYards;
    @Column(name = "passing_touchdowns")
    private Integer passingTouchdowns;
    @Column(name = "passing_interceptions")
    private Integer passingInterceptions;

    // 6. Sacks
    @Column(name = "sacks_total")
    private Integer sacksTotal;
    @Column(name = "sack_yards")
    private Integer sackYards;

    // 7. Fumbles
    @Column(name = "fumbles_total")
    private Integer fumblesTotal;
    @Column(name = "fumbles_lost")
    private Integer fumblesLost;

    // 8. Penalties
    @Column(name = "penalties_total")
    private Integer penaltiesTotal;
    @Column(name = "penalty_yards")
    private Integer penaltyYards;

    // 9. Conversions and First Downs
    @Column(name = "third_down_attempts")
    private Integer thirdDownAttempts;
    @Column(name = "third_down_conversions")
    private Integer thirdDownConversions;
    @Column(name = "fourth_down_attempts")
    private Integer fourthDownAttempts;
    @Column(name = "fourth_down_conversions")
    private Integer fourthDownConversions;
    @Column(name = "first_downs_total")
    private Integer firstDownsTotal;

    
    // --- Getters and Setters ---


    // 1. Composite Key
    public GameStatsId getId() { return id; }
    public void setId(GameStatsId id) { this.id = id; }

    // 2. Points
    public Integer getPointsQ1() { return pointsQ1; }
    public void setPointsQ1(Integer pointsQ1) { this.pointsQ1 = pointsQ1; }
    public Integer getPointsQ2() { return pointsQ2; }
    public void setPointsQ2(Integer pointsQ2) { this.pointsQ2 = pointsQ2; }
    public Integer getPointsQ3() { return pointsQ3; }
    public void setPointsQ3(Integer pointsQ3) { this.pointsQ3 = pointsQ3; }
    public Integer getPointsQ4() { return pointsQ4; }
    public void setPointsQ4(Integer pointsQ4) { this.pointsQ4 = pointsQ4; }
    public Integer getPointsOvertime() { return pointsOvertime; }
    public void setPointsOvertime(Integer pointsOvertime) { this.pointsOvertime = pointsOvertime; }
    public Integer getPointsTotal() { return pointsTotal; }
    public void setPointsTotal(Integer pointsTotal) { this.pointsTotal = pointsTotal; }

    // 3. Total Yards
    public Integer getTotalYards() { return totalYards; }
    public void setTotalYards(Integer totalYards) { this.totalYards = totalYards; }

    // 4. Rushing
    public Integer getRushingAttempts() { return rushingAttempts; }
    public void setRushingAttempts(Integer rushingAttempts) { this.rushingAttempts = rushingAttempts; }
    public Integer getRushingYards() { return rushingYards; }
    public void setRushingYards(Integer rushingYards) { this.rushingYards = rushingYards; }
    public Integer getRushingTouchdowns() { return rushingTouchdowns; }
    public void setRushingTouchdowns(Integer rushingTouchdowns) { this.rushingTouchdowns = rushingTouchdowns; }

    // 5. Passing
    public Integer getPassingAttempts() { return passingAttempts; }
    public void setPassingAttempts(Integer passingAttempts) { this.passingAttempts = passingAttempts; }
    public Integer getPassingCompletions() { return passingCompletions; }
    public void setPassingCompletions(Integer passingCompletions) { this.passingCompletions = passingCompletions; }
    public Integer getPassingYards() { return passingYards; }
    public void setPassingYards(Integer passingYards) { this.passingYards = passingYards; }
    public Integer getPassingTouchdowns() { return passingTouchdowns; }
    public void setPassingTouchdowns(Integer passingTouchdowns) { this.passingTouchdowns = passingTouchdowns; }
    public Integer getPassingInterceptions() { return passingInterceptions; }
    public void setPassingInterceptions(Integer passingInterceptions) { this.passingInterceptions = passingInterceptions; }

    // 6. Sacks
    public Integer getSacksTotal() { return sacksTotal; }
    public void setSacksTotal(Integer sacksTotal) { this.sacksTotal = sacksTotal; }
    public Integer getSackYards() { return sackYards; }
    public void setSackYards(Integer sackYards) { this.sackYards = sackYards; }

    // 7. Fumbles
    public Integer getFumblesTotal() { return fumblesTotal; }
    public void setFumblesTotal(Integer fumblesTotal) { this.fumblesTotal = fumblesTotal; }
    public Integer getFumblesLost() { return fumblesLost; }
    public void setFumblesLost(Integer fumblesLost) { this.fumblesLost = fumblesLost; }

    // 8. Penalties
    public Integer getPenaltiesTotal() { return penaltiesTotal; }
    public void setPenaltiesTotal(Integer penaltiesTotal) { this.penaltiesTotal = penaltiesTotal; }
    public Integer getPenaltyYards() { return penaltyYards; }
    public void setPenaltyYards(Integer penaltyYards) { this.penaltyYards = penaltyYards; }

    // 9. Conversions and First Downs
    public Integer getThirdDownAttempts() { return thirdDownAttempts; }
    public void setThirdDownAttempts(Integer thirdDownAttempts) { this.thirdDownAttempts = thirdDownAttempts; }
    public Integer getThirdDownConversions() { return thirdDownConversions; }
    public void setThirdDownConversions(Integer thirdDownConversions) { this.thirdDownConversions = thirdDownConversions; }
    public Integer getFourthDownAttempts() { return fourthDownAttempts; }
    public void setFourthDownAttempts(Integer fourthDownAttempts) { this.fourthDownAttempts = fourthDownAttempts; }
    public Integer getFourthDownConversions() { return fourthDownConversions; }
    public void setFourthDownConversions(Integer fourthDownConversions) { this.fourthDownConversions = fourthDownConversions; }
    public Integer getFirstDownsTotal() { return firstDownsTotal; }
    public void setFirstDownsTotal(Integer firstDownsTotal) { this.firstDownsTotal = firstDownsTotal; }
}

