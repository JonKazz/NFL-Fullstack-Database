package com.nfldb.playergame;

import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Column;


@Entity
@Table(name = "player_games")
public class PlayerGame {

    // 1. Identifiers
    @EmbeddedId
    private PlayerGameId id;
    @Column(name = "team_id")
    private String teamId;
    @Column(name = "opponent_id")
    private String opponentId;
}
