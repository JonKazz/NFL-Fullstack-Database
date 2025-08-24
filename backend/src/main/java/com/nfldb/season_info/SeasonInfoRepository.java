package com.nfldb.season_info;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SeasonInfoRepository extends JpaRepository<SeasonInfo, Integer> {
    Optional<SeasonInfo> findBySeasonYear(Integer seasonYear);
    List<SeasonInfo> findAllByOrderBySeasonYearDesc();
}
