package com.nfldb.game_player_stats;

import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "game_player_stats")
public class GamePlayerStats {

    // 1. Primary Key
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "game_id")
    private String gameId;
    @Column(name = "player_id")
    private String playerId;
    @Column(name = "team_id")
    private String teamId;
    @Column(name = "player_name")
    private String playerName;
    @Column(name = "position")
    private String position;

    // Passing stats
    @Column(name = "pass_completions")
    private Double passCompletions;
    @Column(name = "pass_attempts")
    private Double passAttempts;
    @Column(name = "pass_yards")
    private Double passYards;
    @Column(name = "pass_touchdowns")
    private Double passTouchdowns;
    @Column(name = "pass_interceptions")
    private Double passInterceptions;
    @Column(name = "pass_sacked")
    private Double passSacked;
    @Column(name = "pass_sacked_yards")
    private Double passSackedYards;
    @Column(name = "pass_long")
    private Double passLong;
    @Column(name = "pass_rating")
    private Double passRating;
    @Column(name = "pass_first_downs")
    private Double passFirstDowns;
    @Column(name = "pass_first_down_percentage")
    private Double passFirstDownPercentage;
    @Column(name = "pass_target_yds")
    private Double passTargetYds;
    @Column(name = "pass_target_yards_per_attempt")
    private Double passTargetYardsPerAttempt;
    @Column(name = "pass_air_yards")
    private Double passAirYards;
    @Column(name = "pass_air_yards_per_completion")
    private Double passAirYardsPerCompletion;
    @Column(name = "pass_air_yds_per_att")
    private Double passAirYdsPerAtt;
    @Column(name = "pass_yards_after_catch")
    private Double passYardsAfterCatch;
    @Column(name = "pass_yards_after_catch_per_completion")
    private Double passYardsAfterCatchPerCompletion;
    @Column(name = "pass_drops")
    private Double passDrops;
    @Column(name = "pass_drop_percentage")
    private Double passDropPercentage;
    @Column(name = "pass_poor_throws")
    private Double passPoorThrows;
    @Column(name = "pass_poor_throw_percentage")
    private Double passPoorThrowPercentage;
    @Column(name = "pass_blitzed")
    private Double passBlitzed;
    @Column(name = "pass_hurried")
    private Double passHurried;
    @Column(name = "pass_hits")
    private Double passHits;
    @Column(name = "pass_pressured")
    private Double passPressured;
    @Column(name = "pass_pressured_percentage")
    private Double passPressuredPercentage;

    // Rushing stats
    @Column(name = "rush_attempts")
    private Double rushAttempts;
    @Column(name = "rush_yards")
    private Double rushYards;
    @Column(name = "rush_touchdowns")
    private Double rushTouchdowns;
    @Column(name = "rush_long")
    private Double rushLong;
    @Column(name = "rush_scrambles")
    private Double rushScrambles;
    @Column(name = "rush_scrambles_yards_per_attempt")
    private Double rushScramblesYardsPerAttempt;
    @Column(name = "rush_first_downs")
    private Double rushFirstDowns;
    @Column(name = "rush_yards_before_contact")
    private Double rushYardsBeforeContact;
    @Column(name = "rush_yards_before_contact_per_rush")
    private Double rushYardsBeforeContactPerRush;
    @Column(name = "rush_yards_after_catch")
    private Double rushYardsAfterCatch;
    @Column(name = "rush_yards_after_catch_per_rush")
    private Double rushYardsAfterCatchPerRush;
    @Column(name = "rush_broken_tackles")
    private Double rushBrokenTackles;
    @Column(name = "rush_broken_tackles_per_rush")
    private Double rushBrokenTacklesPerRush;

    // Receiving stats
    @Column(name = "receiving_targets")
    private Double receivingTargets;
    @Column(name = "receiving_receptions")
    private Double receivingReceptions;
    @Column(name = "receiving_yards")
    private Double receivingYards;
    @Column(name = "receiving_touchdowns")
    private Double receivingTouchdowns;
    @Column(name = "receiving_long")
    private Double receivingLong;
    @Column(name = "receiving_first_downs")
    private Double receivingFirstDowns;
    @Column(name = "receiving_air_yards")
    private Double receivingAirYards;
    @Column(name = "receiving_air_yards_per_reception")
    private Double receivingAirYardsPerReception;
    @Column(name = "receiving_yards_after_catch")
    private Double receivingYardsAfterCatch;
    @Column(name = "receiving_yards_after_catch_per_reception")
    private Double receivingYardsAfterCatchPerReception;
    @Column(name = "receiving_average_depth_of_target")
    private Double receivingAverageDepthOfTarget;
    @Column(name = "receiving_broken_tackles")
    private Double receivingBrokenTackles;
    @Column(name = "receiving_broken_tackles_per_reception")
    private Double receivingBrokenTacklesPerReception;
    @Column(name = "receiving_drops")
    private Double receivingDrops;
    @Column(name = "receiving_drop_percentage")
    private Double receivingDropPercentage;
    @Column(name = "receiving_target_interceptions")
    private Double receivingTargetInterceptions;
    @Column(name = "receiving_passer_rating")
    private Double receivingPasserRating;

    // Fumbles
    @Column(name = "fumbles_total")
    private Double fumblesTotal;
    @Column(name = "fumbles_lost")
    private Double fumblesLost;
    @Column(name = "fumbles_recovered")
    private Double fumblesRecovered;
    @Column(name = "fumbles_recovered_yards")
    private Double fumblesRecoveredYards;
    @Column(name = "fumbles_recovered_touchdowns")
    private Double fumblesRecoveredTouchdowns;
    @Column(name = "fumbles_forced")
    private Double fumblesForced;

    // Defensive stats
    @Column(name = "defensive_interceptions")
    private Double defensiveInterceptions;
    @Column(name = "defensive_interception_yards")
    private Double defensiveInterceptionYards;
    @Column(name = "defensive_interception_touchdowns")
    private Double defensiveInterceptionTouchdowns;
    @Column(name = "defensive_interception_long")
    private Double defensiveInterceptionLong;
    @Column(name = "defensive_passes_defended")
    private Double defensivePassesDefended;
    @Column(name = "defensive_sacks")
    private Double defensiveSacks;
    @Column(name = "defensive_tackles_combined")
    private Double defensiveTacklesCombined;
    @Column(name = "defensive_tackles_solo")
    private Double defensiveTacklesSolo;
    @Column(name = "defensive_tackles_assists")
    private Double defensiveTacklesAssists;
    @Column(name = "defensive_tackles_loss")
    private Double defensiveTacklesLoss;
    @Column(name = "defensive_qb_hits")
    private Double defensiveQbHits;
    @Column(name = "defensive_targets")
    private Double defensiveTargets;
    @Column(name = "defensive_completions")
    private Double defensiveCompletions;
    @Column(name = "defensive_completion_percentage")
    private Double defensiveCompletionPercentage;
    @Column(name = "defensive_completion_yards")
    private Double defensiveCompletionYards;
    @Column(name = "defensive_completion_yards_per_completion")
    private Double defensiveCompletionYardsPerCompletion;
    @Column(name = "defensive_completion_yards_per_target")
    private Double defensiveCompletionYardsPerTarget;
    @Column(name = "defensive_completion_touchdowns")
    private Double defensiveCompletionTouchdowns;
    @Column(name = "defensive_pass_rating")
    private Double defensivePassRating;
    @Column(name = "defensive_target_yards_per_attempt")
    private Double defensiveTargetYardsPerAttempt;
    @Column(name = "defensive_air_yds")
    private Double defensiveAirYds;
    @Column(name = "defensive_yards_after_catch")
    private Double defensiveYardsAfterCatch;
    @Column(name = "defensive_blitzes")
    private Double defensiveBlitzes;
    @Column(name = "defensive_qb_hurries")
    private Double defensiveQbHurries;
    @Column(name = "defensive_qb_knockdowns")
    private Double defensiveQbKnockdowns;
    @Column(name = "defensive_pressures")
    private Double defensivePressures;
    @Column(name = "defensive_tackles_missed")
    private Double defensiveTacklesMissed;
    @Column(name = "defensive_tackles_missed_percentage")
    private Double defensiveTacklesMissedPercentage;

    // Kicking stats
    @Column(name = "extra_points_made")
    private Double extraPointsMade;
    @Column(name = "extra_points_attempted")
    private Double extraPointsAttempted;
    @Column(name = "field_goals_made")
    private Double fieldGoalsMade;
    @Column(name = "field_goals_attempted")
    private Double fieldGoalsAttempted;

    // Punting stats
    @Column(name = "punts")
    private Double punts;
    @Column(name = "punt_yards")
    private Double puntYards;
    @Column(name = "punt_yards_per_punt")
    private Double puntYardsPerPunt;
    @Column(name = "punt_long")
    private Double puntLong;

    // Return stats
    @Column(name = "kick_returns")
    private Double kickReturns;
    @Column(name = "kick_return_yards")
    private Double kickReturnYards;
    @Column(name = "kick_return_yards_per_return")
    private Double kickReturnYardsPerReturn;
    @Column(name = "kick_return_touchdowns")
    private Double kickReturnTouchdowns;
    @Column(name = "kick_return_long")
    private Double kickReturnLong;
    @Column(name = "punt_returns")
    private Double puntReturns;
    @Column(name = "punt_return_yards")
    private Double puntReturnYards;
    @Column(name = "punt_return_yards_per_return")
    private Double puntReturnYardsPerReturn;
    @Column(name = "punt_return_touchdowns")
    private Double puntReturnTouchdowns;
    @Column(name = "punt_return_long")
    private Double puntReturnLong;

    // Snap counts
    @Column(name = "snapcounts_offense")
    private Double snapcountsOffense;
    @Column(name = "snapcounts_offense_percentage")
    private Double snapcountsOffensePercentage;
    @Column(name = "snapcounts_defense")
    private Double snapcountsDefense;
    @Column(name = "snapcounts_defense_percentage")
    private Double snapcountsDefensePercentage;
    @Column(name = "snapcounts_special_teams")
    private Double snapcountsSpecialTeams;
    @Column(name = "snapcounts_special_teams_percentage")
    private Double snapcountsSpecialTeamsPercentage;
}
