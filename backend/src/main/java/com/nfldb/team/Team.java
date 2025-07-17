package com.nfldb.team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "teams")
public class Team {

    // 1. Identifiers & Basic Info
    @Id
    private String id;
    @Column(name = "team_id")
    private String teamId;
    private String name;
    private Integer year;

    // 2. Location & Stadium
    private String city;
    private String stadium;

    // 3. Logo/Branding
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

    // --- Getters and Setters ---

    // 1. Identifiers & Basic Info
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }
    public String getTeam() { return teamId; }
    public void setTeam(String team) { this.teamId = team; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    // 2. Location & Stadium
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getStadium() { return stadium; }
    public void setStadium(String stadium) { this.stadium = stadium; }

    // 3. Logo/Branding
    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    // 4. Performance/Record
    public Integer getWins() { return wins; }
    public void setWins(Integer wins) { this.wins = wins; }
    public Integer getLosses() { return losses; }
    public void setLosses(Integer losses) { this.losses = losses; }
    public Integer getTies() { return ties; }
    public void setTies(Integer ties) { this.ties = ties; }
    public Integer getPointsFor() { return pointsFor; }
    public void setPointsFor(Integer pointsFor) { this.pointsFor = pointsFor; }
    public Integer getPointsAgainst() { return pointsAgainst; }
    public void setPointsAgainst(Integer pointsAgainst) { this.pointsAgainst = pointsAgainst; }
    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }
    public Integer getDivisionRank() { return divisionRank; }
    public void setDivisionRank(Integer divisionRank) { this.divisionRank = divisionRank; }
    public String getPlayoffs() { return playoffs; }
    public void setPlayoffs(String playoffs) { this.playoffs = playoffs; }

    // 5. Coaching Staff
    public String getCoach() { return coach; }
    public void setCoach(String coach) { this.coach = coach; }
    public String getOffCoordinator() { return offCoordinator; }
    public void setOffCoordinator(String offCoordinator) { this.offCoordinator = offCoordinator; }
    public String getDefCoordinator() { return defCoordinator; }
    public void setDefCoordinator(String defCoordinator) { this.defCoordinator = defCoordinator; }

    // 6. Schemes
    public String getOffScheme() { return offScheme; }
    public void setOffScheme(String offScheme) { this.offScheme = offScheme; }
    public String getDefAlignment() { return defAlignment; }
    public void setDefAlignment(String defAlignment) { this.defAlignment = defAlignment; }
}