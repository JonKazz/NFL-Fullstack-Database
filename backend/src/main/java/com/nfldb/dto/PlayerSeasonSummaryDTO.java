package com.nfldb.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlayerSeasonSummaryDTO {
    private String playerId;
    private Integer seasonYear;
    private Integer gamesPlayed;
    
    // Passing totals
    private Double totalPassCompletions;
    private Double totalPassAttempts;
    private Double totalPassYards;
    private Double totalPassTouchdowns;
    private Double totalPassInterceptions;
    private Double avgPassRating;
    
    // Rushing totals
    private Double totalRushAttempts;
    private Double totalRushYards;
    private Double totalRushTouchdowns;
    private Double avgRushYardsPerAttempt;
    
    // Receiving totals
    private Double totalReceivingTargets;
    private Double totalReceivingReceptions;
    private Double totalReceivingYards;
    private Double totalReceivingTouchdowns;
    private Double avgReceivingYardsPerReception;
    
    // Defensive totals
    private Double totalDefensiveInterceptions;
    private Double totalDefensivePassesDefended;
    private Double totalDefensiveSacks;
    private Double totalDefensiveTacklesCombined;
    private Double totalDefensiveTacklesSolo;
    private Double totalDefensiveTacklesAssists;
    
    // Kicking totals
    private Double totalExtraPointsMade;
    private Double totalExtraPointsAttempted;
    private Double totalFieldGoalsMade;
    private Double totalFieldGoalsAttempted;
    
    // Punting totals
    private Double totalPunts;
    private Double totalPuntYards;
    private Double avgPuntYardsPerPunt;
    
    // Return totals
    private Double totalKickReturns;
    private Double totalKickReturnYards;
    private Double totalKickReturnTouchdowns;
    private Double totalPuntReturns;
    private Double totalPuntReturnYards;
    private Double totalPuntReturnTouchdowns;
    
    // Fumble totals
    private Double totalFumblesTotal;
    private Double totalFumblesLost;
}
