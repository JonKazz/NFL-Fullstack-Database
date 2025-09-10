package com.nfldb.season_info;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SeasonInfoService {
    private final SeasonInfoRepository repository;

    /**
     * Constructor for SeasonInfoService
     * @param repository The SeasonInfoRepository dependency
     */
    public SeasonInfoService(SeasonInfoRepository repository) {
        this.repository = repository;
    }

    /**
     * Get season information for a specific year
     * @param seasonYear The year to get season info for
     * @return Optional containing SeasonInfo if found, empty otherwise
     */
    public Optional<SeasonInfo> getSeasonInfo(Integer seasonYear) {
        return repository.findBySeasonYear(seasonYear);
    }

    /**
     * Get all available seasons ordered by year (descending)
     * @return List of season years in descending order
     */
    public List<Integer> getAvailableSeasons() {
        return repository.findAllByOrderBySeasonYearDesc()
            .stream()
            .map(SeasonInfo::getSeasonYear)
            .toList();
    }

    /**
     * Check if a season exists in the database
     * @param seasonYear The year to check
     * @return true if season exists, false otherwise
     */
    public boolean checkSeasonExists(Integer seasonYear) {
        return repository.findBySeasonYear(seasonYear).isPresent();
    }
}
