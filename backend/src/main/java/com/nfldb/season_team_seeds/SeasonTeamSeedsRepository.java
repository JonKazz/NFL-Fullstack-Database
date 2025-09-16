package com.nfldb.season_team_seeds;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonTeamSeedsRepository extends JpaRepository<SeasonTeamSeeds, String> {
    // Only need findById() which is inherited from JpaRepository
    // ID format: {conference}_{seasonYear} (e.g., "AFC_2023", "NFC_2023")
}
