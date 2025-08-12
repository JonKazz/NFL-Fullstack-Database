package com.nfldb.regular_season_player_stats;

import jakarta.persistence.Column;
import java.io.Serializable;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RegSeasonPlayerStatsId implements Serializable {
    @Column(name = "player_id")
    private String playerId;
    
    @Column(name = "season_year")
    private Integer seasonYear;

    @Column(name = "team_id")
    private String teamId;
}