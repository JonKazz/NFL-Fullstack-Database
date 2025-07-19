package com.nfldb.playergame;

import jakarta.persistence.Column;
import java.io.Serializable;
import java.util.Objects;
import jakarta.persistence.Embeddable;

@Embeddable
public class PlayerGameId implements Serializable {
    @Column(name = "player_id")
    private String playerId;
    
    @Column(name = "game_id")
    private String gameId;

    public PlayerGameId() {
    }
    
    public PlayerGameId(String playerId, String gameId) {
        this.playerId = playerId;
        this.gameId = gameId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        PlayerGameId gameId1 = (PlayerGameId) o;
        return Objects.equals(playerId, gameId1.playerId) &&
                Objects.equals(gameId, gameId1.gameId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playerId, gameId);
    }
}