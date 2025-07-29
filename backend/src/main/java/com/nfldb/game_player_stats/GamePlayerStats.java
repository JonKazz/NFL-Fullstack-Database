package com.nfldb.game_player_stats;

import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "player_games")
public class GamePlayerStats {

    // 1. Composite Key (game_id, player_id)
    @EmbeddedId
    private GamePlayerStatsId id;
    
    @Column(name = "team_id")
    private String teamId;

    // Passing stats
    @Column(name = "pass_cmp")
    private Double passCmp;
    @Column(name = "pass_att")
    private Double passAtt;
    @Column(name = "pass_yds")
    private Double passYds;
    @Column(name = "pass_td")
    private Double passTd;
    @Column(name = "pass_int")
    private Double passInt;
    @Column(name = "pass_sacked")
    private Double passSacked;
    @Column(name = "pass_sacked_yds")
    private Double passSackedYds;
    @Column(name = "pass_long")
    private Double passLong;
    @Column(name = "pass_rating")
    private Double passRating;

    // Rushing stats
    @Column(name = "rush_att")
    private Double rushAtt;
    @Column(name = "rush_yds")
    private Double rushYds;
    @Column(name = "rush_td")
    private Double rushTd;
    @Column(name = "rush_long")
    private Double rushLong;

    // Receiving stats
    @Column(name = "targets")
    private Double targets;
    @Column(name = "rec")
    private Double rec;
    @Column(name = "rec_yds")
    private Double recYds;
    @Column(name = "rec_td")
    private Double recTd;
    @Column(name = "rec_long")
    private Double recLong;

    // Fumbles
    @Column(name = "fumbles")
    private Double fumbles;
    @Column(name = "fumbles_lost")
    private Double fumblesLost;

    // Defensive stats
    @Column(name = "def_int")
    private Double defInt;
    @Column(name = "def_int_yds")
    private Double defIntYds;
    @Column(name = "def_int_td")
    private Double defIntTd;
    @Column(name = "def_int_long")
    private Double defIntLong;
    @Column(name = "pass_defended")
    private Double passDefended;
    @Column(name = "sacks")
    private Double sacks;
    @Column(name = "tackles_combined")
    private Double tacklesCombined;
    @Column(name = "tackles_solo")
    private Double tacklesSolo;
    @Column(name = "tackles_assists")
    private Double tacklesAssists;
    @Column(name = "tackles_loss")
    private Double tacklesLoss;
    @Column(name = "qb_hits")
    private Double qbHits;
    @Column(name = "fumbles_rec")
    private Double fumblesRec;
    @Column(name = "fumbles_rec_yds")
    private Double fumblesRecYds;
    @Column(name = "fumbles_rec_td")
    private Double fumblesRecTd;
    @Column(name = "fumbles_forced")
    private Double fumblesForced;

    // Kick returns
    @Column(name = "kick_ret")
    private Double kickRet;
    @Column(name = "kick_ret_yds")
    private Double kickRetYds;
    @Column(name = "kick_ret_yds_per_ret")
    private Double kickRetYdsPerRet;
    @Column(name = "kick_ret_td")
    private Double kickRetTd;
    @Column(name = "kick_ret_long")
    private Double kickRetLong;

    // Punt returns
    @Column(name = "punt_ret")
    private Double puntRet;
    @Column(name = "punt_ret_yds")
    private Double puntRetYds;
    @Column(name = "punt_ret_yds_per_ret")
    private Double puntRetYdsPerRet;
    @Column(name = "punt_ret_td")
    private Double puntRetTd;
    @Column(name = "punt_ret_long")
    private Double puntRetLong;

    // Kicking
    @Column(name = "xpm")
    private Double xpm;
    @Column(name = "xpa")
    private Double xpa;
    @Column(name = "fgm")
    private Double fgm;
    @Column(name = "fga")
    private Double fga;

    // Punting
    @Column(name = "punt")
    private Double punt;
    @Column(name = "punt_yds")
    private Double puntYds;
    @Column(name = "punt_yds_per_punt")
    private Double puntYdsPerPunt;
    @Column(name = "punt_long")
    private Double puntLong;

    // Advanced passing stats
    @Column(name = "pass_first_down")
    private Double passFirstDown;
    @Column(name = "pass_first_down_pct")
    private Double passFirstDownPct;
    @Column(name = "pass_target_yds")
    private Double passTargetYds;
    @Column(name = "pass_tgt_yds_per_att")
    private Double passTgtYdsPerAtt;
    @Column(name = "pass_air_yds")
    private Double passAirYds;
    @Column(name = "pass_air_yds_per_cmp")
    private Double passAirYdsPerCmp;
    @Column(name = "pass_air_yds_per_att")
    private Double passAirYdsPerAtt;
    @Column(name = "pass_yac")
    private Double passYac;
    @Column(name = "pass_yac_per_cmp")
    private Double passYacPerCmp;
    @Column(name = "pass_drops")
    private Double passDrops;
    @Column(name = "pass_drop_pct")
    private Double passDropPct;
    @Column(name = "pass_poor_throws")
    private Double passPoorThrows;
    @Column(name = "pass_poor_throw_pct")
    private Double passPoorThrowPct;
    @Column(name = "pass_blitzed")
    private Double passBlitzed;
    @Column(name = "pass_hurried")
    private Double passHurried;
    @Column(name = "pass_hits")
    private Double passHits;
    @Column(name = "pass_pressured")
    private Double passPressured;
    @Column(name = "pass_pressured_pct")
    private Double passPressuredPct;

    // Advanced rushing stats
    @Column(name = "rush_scrambles")
    private Double rushScrambles;
    @Column(name = "rush_scrambles_yds_per_att")
    private Double rushScramblesYdsPerAtt;
    @Column(name = "rush_first_down")
    private Double rushFirstDown;
    @Column(name = "rush_yds_before_contact")
    private Double rushYdsBeforeContact;
    @Column(name = "rush_yds_bc_per_rush")
    private Double rushYdsBcPerRush;
    @Column(name = "rush_yac")
    private Double rushYac;
    @Column(name = "rush_yac_per_rush")
    private Double rushYacPerRush;
    @Column(name = "rush_broken_tackles")
    private Double rushBrokenTackles;
    @Column(name = "rush_broken_tackles_per_rush")
    private Double rushBrokenTacklesPerRush;

    // Advanced receiving stats
    @Column(name = "rec_first_down")
    private Double recFirstDown;
    @Column(name = "rec_air_yds")
    private Double recAirYds;
    @Column(name = "rec_air_yds_per_rec")
    private Double recAirYdsPerRec;
    @Column(name = "rec_yac")
    private Double recYac;
    @Column(name = "rec_yac_per_rec")
    private Double recYacPerRec;
    @Column(name = "rec_adot")
    private Double recAdot;
    @Column(name = "rec_broken_tackles")
    private Double recBrokenTackles;
    @Column(name = "rec_broken_tackles_per_rec")
    private Double recBrokenTacklesPerRec;
    @Column(name = "rec_drops")
    private Double recDrops;
    @Column(name = "rec_drop_pct")
    private Double recDropPct;
    @Column(name = "rec_target_int")
    private Double recTargetInt;
    @Column(name = "rec_pass_rating")
    private Double recPassRating;

    // Defensive coverage stats
    @Column(name = "def_targets")
    private Double defTargets;
    @Column(name = "def_cmp")
    private Double defCmp;
    @Column(name = "def_cmp_perc")
    private Double defCmpPerc;
    @Column(name = "def_cmp_yds")
    private Double defCmpYds;
    @Column(name = "def_yds_per_cmp")
    private Double defYdsPerCmp;
    @Column(name = "def_yds_per_target")
    private Double defYdsPerTarget;
    @Column(name = "def_cmp_td")
    private Double defCmpTd;
    @Column(name = "def_pass_rating")
    private Double defPassRating;
    @Column(name = "def_tgt_yds_per_att")
    private Double defTgtYdsPerAtt;
    @Column(name = "def_air_yds")
    private Double defAirYds;
    @Column(name = "def_yac")
    private Double defYac;
    @Column(name = "blitzes")
    private Double blitzes;
    @Column(name = "qb_hurry")
    private Double qbHurry;
    @Column(name = "qb_knockdown")
    private Double qbKnockdown;
    @Column(name = "pressures")
    private Double pressures;
    @Column(name = "tackles_missed")
    private Double tacklesMissed;
    @Column(name = "tackles_missed_pct")
    private Double tacklesMissedPct;

    // Position and snap counts
    @Column(name = "pos")
    private String pos;
    @Column(name = "offense")
    private Double offense;
    @Column(name = "off_pct")
    private Double offPct;
    @Column(name = "defense")
    private Double defense;
    @Column(name = "def_pct")
    private Double defPct;
    @Column(name = "special_teams")
    private Double specialTeams;
    @Column(name = "st_pct")
    private Double stPct;
}
