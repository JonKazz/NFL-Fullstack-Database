package com.nfldb.team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "season_team_info")
public class Team {

    // 1. Identifiers & Basic Info
    @Id
    private String id;

    @Column(name = "team_id")
    private String teamId;
    @Column(name = "name")
    private String name;
    @Column(name = "year")
    private Integer seasonYear;

    // 2. Location & Stadium
    private String city;
    private String stadium;

    // 3. Logo
    private String logo;

    // 4. Performance/Record
    private Integer wins;
    private Integer losses;
    private Integer ties;
    @Column(name = "points_for")
    private Integer pointsFor;
    @Column(name = "points_against")
    private Integer pointsAgainst;
    private String division;
    @Column(name = "division_rank")
    private Integer divisionRank;
    private String playoffs;

    // 5. Coaching Staff
    private String coach;
    @Column(name = "off_coordinator")
    private String offCoordinator;
    @Column(name = "def_coordinator")
    private String defCoordinator;

    // 6. Schemes
    @Column(name = "off_scheme")
    private String offScheme;
    @Column(name = "def_alignment")
    private String defAlignment;
}