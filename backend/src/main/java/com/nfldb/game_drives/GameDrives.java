package com.nfldb.game_drives;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "game_drives")
public class GameDrives {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "game_id", nullable = false)
    private String gameId;

    @Column(name = "team_id", nullable = false)
    private String teamId;

    @Column(name = "drive_num")
    private String driveNum;

    @Column(name = "quarter")
    private String quarter;

    @Column(name = "time_start")
    private String timeStart;

    @Column(name = "start_at")
    private String startAt;

    @Column(name = "plays")
    private String plays;

    @Column(name = "time_total")
    private String timeTotal;

    @Column(name = "net_yds")
    private String netYds;

    @Column(name = "end_event")
    private String endEvent;

    @Column(name = "opposing_touchdown")
    private Boolean opposingTouchdown;

    @Column(name = "points_scored")
    private Integer pointsScored;
}
