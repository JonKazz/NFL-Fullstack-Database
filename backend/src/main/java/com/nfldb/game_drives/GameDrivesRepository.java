package com.nfldb.game_drives;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameDrivesRepository extends JpaRepository<GameDrives, Long> {
    List<GameDrives> findByGameId(String gameId);
}
