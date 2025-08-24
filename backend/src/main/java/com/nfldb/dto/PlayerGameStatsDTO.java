package com.nfldb.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlayerGameStatsDTO {
    // Game info
    private String gameId;
    private String date;
    private String opponent;
    private Integer homeScore;
    private Integer awayScore;
    private String homeTeamId;
    private String winningTeamId;
    private Integer seasonYear;
    private Integer seasonWeek;
    
    // Player stats (only the key ones for display)
    private String teamId;
    private String position;
    
    // Passing stats
    private Double passCompletions;
    private Double passAttempts;
    private Double passYards;
    private Double passTouchdowns;
    private Double passInterceptions;
    private Double passRating;
    
    // Rushing stats
    private Double rushAttempts;
    private Double rushYards;
    private Double rushTouchdowns;
    
    // Receiving stats
    private Double receivingTargets;
    private Double receivingReceptions;
    private Double receivingYards;
    private Double receivingTouchdowns;
    
    // Defensive stats
    private Double defensiveInterceptions;
    private Double defensivePassesDefended;
    private Double defensiveSacks;
    private Double defensiveTacklesCombined;
    private Double defensiveTacklesSolo;
    private Double defensiveTacklesAssists;
    
    // Kicking stats
    private Double extraPointsMade;
    private Double extraPointsAttempted;
    private Double fieldGoalsMade;
    private Double fieldGoalsAttempted;
    
    // Punting stats
    private Double punts;
    private Double puntYards;
    
    // Return stats
    private Double kickReturns;
    private Double kickReturnYards;
    private Double kickReturnTouchdowns;
    private Double puntReturns;
    private Double puntReturnYards;
    private Double puntReturnTouchdowns;
    
    // Fumbles
    private Double fumblesTotal;
    private Double fumblesLost;
}
