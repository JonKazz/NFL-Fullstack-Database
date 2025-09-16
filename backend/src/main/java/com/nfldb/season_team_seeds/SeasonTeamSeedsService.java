package com.nfldb.season_team_seeds;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class SeasonTeamSeedsService {
    private final SeasonTeamSeedsRepository repository;

    public SeasonTeamSeedsService(SeasonTeamSeedsRepository repository) {
        this.repository = repository;
    }

    /**
     * Get team seeds by ID
     * @param id The ID of the team seeds record (format: {conference}_{seasonYear})
     * @return Optional containing SeasonTeamSeeds or empty if not found
     */
    public Optional<SeasonTeamSeeds> getTeamSeedsById(String id) {
        return repository.findById(id);
    }
}
