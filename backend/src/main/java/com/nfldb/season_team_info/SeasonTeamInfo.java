package com.nfldb.season_team_info;

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
public class SeasonTeamInfo {

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

    // 7. Team Statistics
    @Column(name = "total_yards_for")
    private Integer totalYardsFor;
    @Column(name = "total_yards_against")
    private Integer totalYardsAgainst;
    @Column(name = "turnovers")
    private Integer turnovers;
    @Column(name = "forced_turnovers")
    private Integer forcedTurnovers;
    @Column(name = "pass_yards_for")
    private Integer passYardsFor;
    @Column(name = "pass_yards_against")
    private Integer passYardsAgainst;
    @Column(name = "pass_td_for")
    private Integer passTdFor;
    @Column(name = "pass_td_against")
    private Integer passTdAgainst;
    @Column(name = "pass_ints_thrown")
    private Integer passIntsThrown;
    @Column(name = "pass_ints")
    private Integer passInts;
    @Column(name = "rush_yards_for")
    private Integer rushYardsFor;
    @Column(name = "rush_yards_against")
    private Integer rushYardsAgainst;
    @Column(name = "rush_td_for")
    private Integer rushTdFor;
    @Column(name = "rush_td_against")
    private Integer rushTdAgainst;
    @Column(name = "penalties_for")
    private Integer penaltiesFor;
}