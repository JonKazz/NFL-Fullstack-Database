package com.nfldb.season_info;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SeasonInfoService {
    private final SeasonInfoRepository repository;

    public SeasonInfoService(SeasonInfoRepository repository) {
        this.repository = repository;
    }

    public Optional<SeasonInfo> getSeasonInfo(Integer seasonYear) {
        return repository.findBySeasonYear(seasonYear);
    }

    public Optional<SeasonInfo> getSeasonInfoWithPlayerNames(Integer seasonYear) {
        return repository.findBySeasonYear(seasonYear);
    }

    public List<Integer> getAvailableSeasons() {
        return repository.findAllByOrderBySeasonYearDesc()
            .stream()
            .map(SeasonInfo::getSeasonYear)
            .toList();
    }

    public List<SeasonInfo> getAllSeasons() {
        return repository.findAllByOrderBySeasonYearDesc();
    }

    public SeasonInfo saveSeasonInfo(SeasonInfo seasonInfo) {
        return repository.save(seasonInfo);
    }
}
