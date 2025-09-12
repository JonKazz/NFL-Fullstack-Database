package com.nfldb.ap_team_votes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ap_team_votes")
public class ApTeamVotes {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "season_year", nullable = false)
    private Integer seasonYear;

    @Column(name = "player_id", nullable = false)
    private String playerId;

    @Column(name = "player_name", nullable = false)
    private String playerName;

    @Column(name = "team_id", nullable = false)
    private String teamId;

    @Column(name = "position", nullable = false)
    private String position;

    @Column(name = "ap_team", nullable = false)
    private Integer apTeam;
}
