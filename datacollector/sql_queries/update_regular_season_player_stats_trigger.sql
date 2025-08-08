-- FUNCTION: public.update_regular_season_player_stats()

-- DROP FUNCTION IF EXISTS public.update_regular_season_player_stats();

CREATE OR REPLACE FUNCTION public.update_regular_season_player_stats()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    -- Delete existing season stats for this player and year
    DELETE FROM regular_season_player_stats 
    WHERE player_id = NEW.player_id 
      AND season_year = EXTRACT(YEAR FROM (SELECT date::DATE FROM game_info WHERE game_id = NEW.game_id));
    
    -- Insert new aggregated season stats
    INSERT INTO regular_season_player_stats (
        player_id,
        season_year,
        team_id,
        games_played,
        passing_attempts,
        passing_completions,
        passing_yards,
        passing_touchdowns,
        passing_interceptions,
        rushing_attempts,
        rushing_yards,
        rushing_yards_per_attempt,
        rushing_touchdowns,
        fumbles_lost,
        receiving_targets,
        receiving_receptions,
        receiving_yards,
        receiving_touchdowns,
        receiving_yards_per_reception,
        defensive_interceptions,
        defensive_passes_defended,
        defensive_sacks,
        defensive_tackles_combined,
        defensive_qb_hits,
        defensive_pressures,
        extra_points_made,
        extra_points_attempted,
        field_goals_made,
        field_goals_attempted,
        punts,
        punt_yards,
        punt_yards_per_punt
    )
    SELECT 
        gps.player_id,
        EXTRACT(YEAR FROM gi.date::DATE) as season_year,

        -- Get team from latest regular season game for this player-season
        (SELECT gps2.team_id 
         FROM game_player_stats gps2 
         JOIN game_info gi2 ON gps2.game_id = gi2.game_id 
         WHERE gps2.player_id = gps.player_id 
           AND EXTRACT(YEAR FROM gi2.date::DATE) = EXTRACT(YEAR FROM (SELECT date::DATE FROM game_info WHERE game_id = NEW.game_id))
           AND gi2.season_week <= 18
         ORDER BY gi2.date DESC, gps2.game_id DESC 
         LIMIT 1) as team_id,

        COUNT(DISTINCT gps.game_id),
        COALESCE(SUM(gps.pass_attempts)::INTEGER, 0),
        COALESCE(SUM(gps.pass_completions)::INTEGER, 0),
        COALESCE(SUM(gps.pass_yards)::INTEGER, 0),
        COALESCE(SUM(gps.pass_touchdowns)::INTEGER, 0),
        COALESCE(SUM(gps.pass_interceptions)::INTEGER, 0),
        COALESCE(SUM(gps.rush_attempts)::INTEGER, 0),
        COALESCE(SUM(gps.rush_yards)::INTEGER, 0),

        CASE 
            WHEN SUM(gps.rush_attempts) > 0 THEN 
                ROUND((SUM(gps.rush_yards)::NUMERIC / SUM(gps.rush_attempts))::NUMERIC, 1)
            ELSE 0 
        END,

        COALESCE(SUM(gps.rush_touchdowns)::INTEGER, 0),
        COALESCE(SUM(gps.fumbles_lost)::INTEGER, 0),
        COALESCE(SUM(gps.receiving_targets)::INTEGER, 0),
        COALESCE(SUM(gps.receiving_receptions)::INTEGER, 0),
        COALESCE(SUM(gps.receiving_yards)::INTEGER, 0),
        COALESCE(SUM(gps.receiving_touchdowns)::INTEGER, 0),

        CASE 
            WHEN SUM(gps.receiving_receptions) > 0 THEN 
                ROUND((SUM(gps.receiving_yards)::NUMERIC / SUM(gps.receiving_receptions))::NUMERIC, 1)
            ELSE 0 
        END,

        COALESCE(SUM(gps.defensive_interceptions)::INTEGER, 0),
        COALESCE(SUM(gps.defensive_passes_defended)::INTEGER, 0),
        COALESCE(SUM(gps.defensive_sacks)::INTEGER, 0),
        COALESCE(SUM(gps.defensive_tackles_combined)::INTEGER, 0),
        COALESCE(SUM(gps.defensive_qb_hits)::INTEGER, 0),
        COALESCE(SUM(gps.defensive_pressures)::INTEGER, 0),
        COALESCE(SUM(gps.extra_points_made)::INTEGER, 0),
        COALESCE(SUM(gps.extra_points_attempted)::INTEGER, 0),
        COALESCE(SUM(gps.field_goals_made)::INTEGER, 0),
        COALESCE(SUM(gps.field_goals_attempted)::INTEGER, 0),
        COALESCE(SUM(gps.punts)::INTEGER, 0),
        COALESCE(SUM(gps.punt_yards)::INTEGER, 0),

        CASE 
            WHEN SUM(gps.punts) > 0 THEN 
                ROUND((SUM(gps.punt_yards)::NUMERIC / SUM(gps.punts))::NUMERIC, 1)
            ELSE 0 
        END

    FROM game_player_stats gps
    JOIN game_info gi ON gps.game_id = gi.game_id
    WHERE gps.player_id = NEW.player_id
      AND EXTRACT(YEAR FROM gi.date::DATE) = EXTRACT(YEAR FROM (SELECT date::DATE FROM game_info WHERE game_id = NEW.game_id))
      AND gi.season_week <= 18  -- Only regular season games
    GROUP BY gps.player_id, EXTRACT(YEAR FROM gi.date::DATE);

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.update_regular_season_player_stats()
    OWNER TO postgres;
