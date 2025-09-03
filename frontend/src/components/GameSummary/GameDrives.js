import React, { useState, useEffect } from 'react';
import { fetchGameDrives } from '../../api/fetches';
import styles from './GameDrives.module.css';

function GameDrives({ gameId, teams, gameInfo }) {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDrives() {
      try {
        setLoading(true);
        const drivesData = await fetchGameDrives(gameId);
        
        // Helper function to convert time string to seconds for sorting
        const timeStringToSecondsForSort = (timeStr) => {
          if (!timeStr || timeStr === '') return 0;
          
          const parts = timeStr.split(':');
          if (parts.length === 2) {
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            return minutes * 60 + seconds;
          }
          return 0;
        };
        
        // Sort drives by quarter and timeStart for proper chronological order
        const sortedDrives = drivesData.sort((a, b) => {
          const quarterOrder = { '1': 1, '2': 2, '3': 3, '4': 4, 'OT': 5 };
          const quarterA = quarterOrder[a.quarter] || 999;
          const quarterB = quarterOrder[b.quarter] || 999;
          
          if (quarterA !== quarterB) {
            return quarterA - quarterB;
          }
          
          // If same quarter, sort by timeStart (earlier time first)
          const timeA = a.timeStart || '';
          const timeB = b.timeStart || '';
          
          if (timeA && timeB) {
            // Convert time strings to seconds for comparison
            const timeASeconds = timeStringToSecondsForSort(timeA);
            const timeBSeconds = timeStringToSecondsForSort(timeB);
            return timeBSeconds - timeASeconds; // Higher seconds first (earlier in quarter)
          }
          
          // Fallback to drive number if timeStart is missing
          const driveA = parseInt(a.driveNum) || 0;
          const driveB = parseInt(b.driveNum) || 0;
          return driveA - driveB;
        });
        
        // Debug: Log the sorting order and values
        console.log('=== DRIVE SORTING DEBUG ===');
        sortedDrives.forEach((drive, index) => {
          const timeSeconds = timeStringToSecondsForSort(drive.timeStart || '');
          console.log(`${index + 1}. Q${drive.quarter} - Drive ${drive.driveNum} - ${drive.teamId} - TimeStart: ${drive.timeStart} (${timeSeconds}s) - EndEvent: ${drive.endEvent}`);
        });
        console.log('=== END DEBUG ===');
        
        setDrives(sortedDrives);
      } catch (err) {
        console.error('Error fetching drives:', err);
        setError('Failed to load drive information');
      } finally {
        setLoading(false);
      }
    }

    if (gameId) {
      fetchDrives();
    }
  }, [gameId]);

  if (loading) return <div className={styles['drives-loading']}>Loading drives...</div>;
  if (error) return <div className={styles['drives-error']}>{error}</div>;
  if (!drives.length) return <div className={styles['no-drives']}>No drive information available for this game.</div>;

  return (
    <div className={styles['game-drives']}>
      <h3>Game Drives</h3>
      <div className={styles['drives-table-container']}>
        <table className={styles['drives-table']}>
          <thead>
            <tr>
              <th>Quarter</th>
              <th>Drive #</th>
              <th>Team</th>
              <th>Time Start</th>
              <th>Time Total</th>
              <th>End Event</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive, index) => (
              <tr key={index}>
                <td>Q{drive.quarter}</td>
                <td>{drive.driveNum}</td>
                <td>{drive.teamId}</td>
                <td>{drive.timeStart || 'N/A'}</td>
                <td>{drive.timeTotal || 'N/A'}</td>
                <td>{drive.endEvent || 'N/A'}</td>
                <td>{drive.pointsScored > 0 ? drive.pointsScored : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GameDrives;
