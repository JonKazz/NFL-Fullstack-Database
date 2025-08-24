package com.nfldb.player_profiles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "player_profiles")
public class PlayerProfile {

    @Id
    @Column(name = "player_id")
    private String playerId;

    @Column(name = "img")
    private String img;
    
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "height", nullable = false)
    private String height;

    @Column(name = "weight", nullable = false)
    private String weight;

    @Column(name = "dob", nullable = false)
    private String dob;

    @Column(name = "college", nullable = false)
    private String college;

    @Column(name = "url", nullable = false)
    private String url;
} 