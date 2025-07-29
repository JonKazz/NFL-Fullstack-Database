package com.nfldb.game_player_stats;

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
public class GamePlayerStatsId implements Serializable {
    @Column(name = "player_id")
    private String playerId;
    
    @Column(name = "game_id")
    private String gameId;
}