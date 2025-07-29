package com.nfldb.dto;

import com.nfldb.gameinfo.GameInfo;
import com.nfldb.gamestats.GameStats;
import java.util.List;

public class GameWithStatsDTO {
    private GameInfo gameInfo;
    private List<GameStats> gameStats; // Should always be size 2

    public GameWithStatsDTO() {}

    public GameWithStatsDTO(GameInfo gameInfo, List<GameStats> gameStats) {
        this.gameInfo = gameInfo;
        this.gameStats = gameStats;
    }

    public GameInfo getGameInfo() { return gameInfo; }
    public void setGameInfo(GameInfo gameInfo) { this.gameInfo = gameInfo; }

    public List<GameStats> getGameStats() { return gameStats; }
    public void setGameStats(List<GameStats> gameStats) { this.gameStats = gameStats; }
} 