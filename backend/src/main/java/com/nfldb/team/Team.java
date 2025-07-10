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
    private String coach;

    private Integer wins;
    private Integer losses;
    private Integer ties;
    private String division;

    @Column(name = "division_rank")
    private Integer divisionRank;

    @Column(name = "off_coordinator")
    private String offCoordinator;

    @Column(name = "def_coordinator")
    private String defCoordinator;

    @Column(name = "off_scheme")
    private String offScheme;

    @Column(name = "def_alignment")
    private String defAlignment;

    @Column(name = "missed_playoffs")
    private Boolean missedPlayoffs;

    @Column(name = "lost_wild_card")
    private Boolean lostWildCard;

    @Column(name = "lost_divisional")
    private Boolean lostDivisional;

    @Column(name = "lost_conference_championship")
    private Boolean lostConferenceChampionship;

    @Column(name = "lost_superbowl")
    private Boolean lostSuperbowl;

    @Column(name = "won_superbowl")
    private Boolean wonSuperbowl;

    // Getters
    public String getTeamId() { return teamId; }
    public String getTeam() { return team; }
    public String getName() { return name; }
    public Integer getYear() { return year; }
    public String getCity() { return city; }
    public String getCoach() { return coach; }
    public Integer getWins() { return wins; }
    public Integer getLosses() { return losses; }
    public Integer getTies() { return ties; }
    public String getDivision() { return division; }
    public Integer getDivisionRank() { return divisionRank; }
    public String getOffCoordinator() { return offCoordinator; }
    public String getDefCoordinator() { return defCoordinator; }
    public String getOffScheme() { return offScheme; }
    public String getDefAlignment() { return defAlignment; }
    public Boolean getMissedPlayoffs() { return missedPlayoffs; }
    public Boolean getLostWildCard() { return lostWildCard; }
    public Boolean getLostDivisional() { return lostDivisional; }
    public Boolean getLostConferenceChampionship() { return lostConferenceChampionship; }
    public Boolean getLostSuperbowl() { return lostSuperbowl; }
    public Boolean getWonSuperbowl() { return wonSuperbowl; }

    // Setters
    public void setTeamId(String teamId) { this.teamId = teamId; }
    public void setTeam(String team) { this.team = team; }
    public void setName(String name) { this.name = name; }
    public void setYear(Integer year) { this.year = year; }
    public void setCity(String city) { this.city = city; }
    public void setCoach(String coach) { this.coach = coach; }
    public void setWins(Integer wins) { this.wins = wins; }
    public void setLosses(Integer losses) { this.losses = losses; }
    public void setTies(Integer ties) { this.ties = ties; }
    public void setDivision(String division) { this.division = division; }
    public void setDivisionRank(Integer divisionRank) { this.divisionRank = divisionRank; }
    public void setOffCoordinator(String offCoordinator) { this.offCoordinator = offCoordinator; }
    public void setDefCoordinator(String defCoordinator) { this.defCoordinator = defCoordinator; }
    public void setOffScheme(String offScheme) { this.offScheme = offScheme; }
    public void setDefAlignment(String defAlignment) { this.defAlignment = defAlignment; }
    public void setMissedPlayoffs(Boolean missedPlayoffs) { this.missedPlayoffs = missedPlayoffs; }
    public void setLostWildCard(Boolean lostWildCard) { this.lostWildCard = lostWildCard; }
    public void setLostDivisional(Boolean lostDivisional) { this.lostDivisional = lostDivisional; }
    public void setLostConferenceChampionship(Boolean lostConferenceChampionship) { this.lostConferenceChampionship = lostConferenceChampionship; }
    public void setLostSuperbowl(Boolean lostSuperbowl) { this.lostSuperbowl = lostSuperbowl; }
    public void setWonSuperbowl(Boolean wonSuperbowl) { this.wonSuperbowl = wonSuperbowl; }
}
