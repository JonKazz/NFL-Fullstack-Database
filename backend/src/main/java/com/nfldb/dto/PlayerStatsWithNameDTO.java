package com.nfldb.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlayerStatsWithNameDTO {
    // Player identification and basic info
    private String playerId;
    private String playerName;  // From player_profiles.name
    private String position;
    private String teamId;
    private Integer seasonYear;
    private Integer gamesPlayed;

    // Passing stats
    private Integer passingAttempts;
    private Integer passingCompletions;
    private Integer passingYards;
    private Integer passingTouchdowns;
    private Integer passingInterceptions;

    // Rushing stats
    private Integer rushingAttempts;
    private Integer rushingYards;
    private Double rushingYardsPerAttempt;
    private Integer rushingTouchdowns;

    // Fumbles
    private Integer fumblesLost;

    // Receiving stats
    private Integer receivingTargets;
    private Integer receivingReceptions;
    private Integer receivingYards;
    private Integer receivingTouchdowns;
    private Double receivingYardsPerReception;

    // Defensive stats
    private Integer defensiveInterceptions;
    private Integer defensivePassesDefended;
    private Integer defensiveSacks;
    private Integer defensiveTacklesCombined;
    private Integer defensiveTacklesLoss;
    private Integer defensiveQbHits;
    private Integer defensivePressures;

    // Kicking stats
    private Integer extraPointsMade;
    private Integer extraPointsAttempted;
    private Integer fieldGoalsMade;
    private Integer fieldGoalsAttempted;

    // Punting stats
    private Integer punts;
    private Integer puntYards;
    private Double puntYardsPerPunt;
}
