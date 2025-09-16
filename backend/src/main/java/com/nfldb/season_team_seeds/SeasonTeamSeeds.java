package com.nfldb.season_team_seeds;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "season_team_seeds")
public class SeasonTeamSeeds {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "conference")
    private String conference;

    @Column(name = "season_year")
    private Integer seasonYear;

    @Column(name = "seed_team_1")
    private String seedTeam1;

    @Column(name = "seed_team_2")
    private String seedTeam2;

    @Column(name = "seed_team_3")
    private String seedTeam3;

    @Column(name = "seed_team_4")
    private String seedTeam4;

    @Column(name = "seed_team_5")
    private String seedTeam5;

    @Column(name = "seed_team_6")
    private String seedTeam6;

    @Column(name = "seed_team_7")
    private String seedTeam7;

    @Column(name = "seed_team_8")
    private String seedTeam8;

    @Column(name = "seed_team_9")
    private String seedTeam9;

    @Column(name = "seed_team_10")
    private String seedTeam10;

    @Column(name = "seed_team_11")
    private String seedTeam11;

    @Column(name = "seed_team_12")
    private String seedTeam12;

    @Column(name = "seed_team_13")
    private String seedTeam13;

    @Column(name = "seed_team_14")
    private String seedTeam14;

    @Column(name = "seed_team_15")
    private String seedTeam15;

    @Column(name = "seed_team_16")
    private String seedTeam16;

    @Column(name = "seed_position_1")
    private String seedPosition1;

    @Column(name = "seed_position_2")
    private String seedPosition2;

    @Column(name = "seed_position_3")
    private String seedPosition3;

    @Column(name = "seed_position_4")
    private String seedPosition4;

    @Column(name = "seed_position_5")
    private String seedPosition5;

    @Column(name = "seed_position_6")
    private String seedPosition6;

    @Column(name = "seed_position_7")
    private String seedPosition7;

    @Column(name = "seed_position_8")
    private String seedPosition8;

    @Column(name = "seed_position_9")
    private String seedPosition9;

    @Column(name = "seed_position_10")
    private String seedPosition10;

    @Column(name = "seed_position_11")
    private String seedPosition11;

    @Column(name = "seed_position_12")
    private String seedPosition12;

    @Column(name = "seed_position_13")
    private String seedPosition13;

    @Column(name = "seed_position_14")
    private String seedPosition14;

    @Column(name = "seed_position_15")
    private String seedPosition15;

    @Column(name = "seed_position_16")
    private String seedPosition16;
}
