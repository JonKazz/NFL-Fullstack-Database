package com.nfldb.gamestats;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
}

