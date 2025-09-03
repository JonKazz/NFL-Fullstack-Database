package com.nfldb.game_team_stats;

import jakarta.persistence.Column;
import java.io.Serializable;
import java.util.Objects;
import jakarta.persistence.Embeddable;

@Embeddable
public class GameTeamStatsId implements Serializable {
    @Column(name = "game_id")
    private String gameId;
    
    @Column(name = "team_id")
    private String teamId;

    public GameTeamStatsId() {
    }
    
    public GameTeamStatsId(String gameId, String teamId) {
        this.gameId = gameId;
        this.teamId = teamId;
    }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }
    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        GameTeamStatsId gameId1 = (GameTeamStatsId) o;
        return Objects.equals(gameId, gameId1.teamId) &&
                Objects.equals(gameId, gameId1.teamId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gameId, teamId);
    }
}