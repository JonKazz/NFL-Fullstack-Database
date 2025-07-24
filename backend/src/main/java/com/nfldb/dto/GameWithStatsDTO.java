package com.nfldb.dto;

import com.nfldb.game.Game;
import com.nfldb.gamestats.GameStats;
import java.util.List;

public class GameWithStatsDTO {
    private Game gameInfo;
    private List<GameStats> gameStats; // Should always be size 2

    public GameWithStatsDTO() {}

    public GameWithStatsDTO(Game gameInfo, List<GameStats> gameStats) {
        this.gameInfo = gameInfo;
        this.gameStats = gameStats;
    }

    public Game getGameInfo() { return gameInfo; }
    public void setGameInfo(Game gameInfo) { this.gameInfo = gameInfo; }

    public List<GameStats> getGameStats() { return gameStats; }
    public void setGameStats(List<GameStats> gameStats) { this.gameStats = gameStats; }
} 