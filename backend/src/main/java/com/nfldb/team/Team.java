package com.nfldb.team;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @Column(name = "team_id")
    private String teamId;

    private String team;
    private String name;
    private Integer year;
    private String city;
    private String logo;
    private String coach;
    private Integer wins;
    private Integer losses;
    private Integer ties;
    private String division;
    private String playoffs;

    private Integer pointsFor;
    private Integer pointsAgainst;
    private Integer divisionRank;
    private String offCoordinator;
    private String defCoordinator;
    private String offScheme;
    private String defAlignment;

    // Getters
    public String getTeamId() {
        return teamId;
    }

    public String getTeam() {
        return team;
    }

    public String getName() {
        return name;
    }

    public Integer getYear() {
        return year;
    }

    public String getCity() {
        return city;
    }

    public String getLogo() {
        return logo;
    }

    public String getCoach() {
        return coach;
    }

    public Integer getWins() {
        return wins;
    }

    public Integer getLosses() {
        return losses;
    }

    public Integer getTies() {
        return ties;
    }

    public Integer getPointsFor() {
        return pointsFor;
    }

    public Integer getPointsAgainst() {
        return pointsAgainst;
    }

    public String getDivision() {
        return division;
    }

    public Integer getDivisionRank() {
        return divisionRank;
    }

    public String getPlayoffs() {
        return playoffs;
    }

    public String getOffCoordinator() {
        return offCoordinator;
    }

    public String getDefCoordinator() {
        return defCoordinator;
    }

    public String getOffScheme() {
        return offScheme;
    }

    public String getDefAlignment() {
        return defAlignment;
    }

    // Setters
    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public void setCoach(String coach) {
        this.coach = coach;
    }

    public void setWins(Integer wins) {
        this.wins = wins;
    }

    public void setLosses(Integer losses) {
        this.losses = losses;
    }

    public void setTies(Integer ties) {
        this.ties = ties;
    }

    public void setPointsFor(Integer pointsFor) {
        this.pointsFor = pointsFor;
    }

    public void setPointsAgainst(Integer pointsAgainst) {
        this.pointsAgainst = pointsAgainst;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public void setDivisionRank(Integer divisionRank) {
        this.divisionRank = divisionRank;
    }

    public void setPlayoffs(String playoffs) {
        this.playoffs = playoffs;
    }

    public void setOffCoordinator(String offCoordinator) {
        this.offCoordinator = offCoordinator;
    }

    public void setDefCoordinator(String defCoordinator) {
        this.defCoordinator = defCoordinator;
    }

    public void setOffScheme(String offScheme) {
        this.offScheme = offScheme;
    }

    public void setDefAlignment(String defAlignment) {
        this.defAlignment = defAlignment;
    }
}
