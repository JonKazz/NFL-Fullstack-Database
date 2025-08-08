package com.nfldb.regular_season_player_stats;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "regular_season_player_stats")
public class RegSeasonPlayerStats {

    @EmbeddedId
    private RegSeasonPlayerStatsId id;

    @Column(name = "team_id")
    private String teamId;

    @Column(name = "games_played")
    private Integer gamesPlayed;

    // Passing stats
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

    // Rushing stats
    @Column(name = "rushing_attempts")
    private Integer rushingAttempts;
    @Column(name = "rushing_yards")
    private Integer rushingYards;
    @Column(name = "rushing_yards_per_attempt")
    private Double rushingYardsPerAttempt;
    @Column(name = "rushing_touchdowns")
    private Integer rushingTouchdowns;

    // Fumbles
    @Column(name = "fumbles_lost")
    private Integer fumblesLost;

    // Receiving stats
    @Column(name = "receiving_targets")
    private Integer receivingTargets;
    @Column(name = "receiving_receptions")
    private Integer receivingReceptions;
    @Column(name = "receiving_yards")
    private Integer receivingYards;
    @Column(name = "receiving_touchdowns")
    private Integer receivingTouchdowns;
    @Column(name = "receiving_yards_per_reception")
    private Double receivingYardsPerReception;

    // Defensive stats
    @Column(name = "defensive_interceptions")
    private Integer defensiveInterceptions;
    @Column(name = "defensive_passes_defended")
    private Integer defensivePassesDefended;
    @Column(name = "defensive_sacks")
    private Integer defensiveSacks;
    @Column(name = "defensive_tackles_combined")
    private Integer defensiveTacklesCombined;
    @Column(name = "defensive_qb_hits")
    private Integer defensiveQbHits;
    @Column(name = "defensive_pressures")
    private Integer defensivePressures;

    // Kicking stats
    @Column(name = "extra_points_made")
    private Integer extraPointsMade;
    @Column(name = "extra_points_attempted")
    private Integer extraPointsAttempted;
    @Column(name = "field_goals_made")
    private Integer fieldGoalsMade;
    @Column(name = "field_goals_attempted")
    private Integer fieldGoalsAttempted;

    // Punting stats
    @Column(name = "punts")
    private Integer punts;
    @Column(name = "punt_yards")
    private Integer puntYards;
    @Column(name = "punt_yards_per_punt")
    private Double puntYardsPerPunt;
}
