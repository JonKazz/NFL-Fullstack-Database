package com.nfldb.season_info;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "season_info")
public class SeasonInfo {

    @Id
    @Column(name = "season_year")
    private Integer seasonYear;

    @Column(name = "url")
    private String url;

    @Column(name = "SB_champ")
    private String sbChamp;

    @Column(name = "mvp_id")
    private String mvpId;

    @Column(name = "opoy_id")
    private String opoyId;

    @Column(name = "dpoy_id")
    private String dpoyId;

    @Column(name = "oroy_id")
    private String oroyId;

    @Column(name = "droy_id")
    private String droyId;

    @Column(name = "passing_leader_id")
    private String passingLeaderId;

    @Column(name = "rushing_leader_id")
    private String rushingLeaderId;

    @Column(name = "receiving_leader_id")
    private String receivingLeaderId;

    @Column(name = "mvp_name")
    private String mvpName;

    @Column(name = "opoy_name")
    private String opoyName;

    @Column(name = "dpoy_name")
    private String dpoyName;

    @Column(name = "oroy_name")
    private String oroyName;

    @Column(name = "droy_name")
    private String droyName;

    @Column(name = "passing_leader_name")
    private String passingLeaderName;

    @Column(name = "rushing_leader_name")
    private String rushingLeaderName;

    @Column(name = "receiving_leader_name")
    private String receivingLeaderName;
}
