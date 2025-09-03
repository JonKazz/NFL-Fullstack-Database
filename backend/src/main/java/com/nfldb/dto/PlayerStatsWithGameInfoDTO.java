package com.nfldb.dto;

import com.nfldb.gameinfo.GameInfo;
import com.nfldb.game_player_stats.GamePlayerStats;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerStatsWithGameInfoDTO {
    private GameInfo gameInfo;
    private GamePlayerStats playerStats;
    
    public PlayerStatsWithGameInfoDTO(GameInfo gameInfo, GamePlayerStats playerStats) {
        this.gameInfo = gameInfo;
        this.playerStats = playerStats;
    }
}