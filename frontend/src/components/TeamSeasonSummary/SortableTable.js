import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './SortableTable.module.css';
import { getPlayerName, formatNumber } from '../../utils';

// Component to handle async player name fetching
function PlayerNameCell({ playerId }) {
  const [playerName, setPlayerName] = useState('Loading...');

  useEffect(() => {
    async function fetchPlayerName() {
      const name = await getPlayerName(playerId);
      setPlayerName(name);
    }
    
    fetchPlayerName();
  }, [playerId]);

  return (
    <td className={styles['player-name-cell']}>
      <Link to={`/player/${playerId}`} className={styles['player-link']}>
        {playerName}
      </Link>
    </td>
  );
}

// Hook for sorting functionality
function useSortableData(data, config = null) {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortConfig.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedData, requestSort, sortConfig };
}

// Generic Sortable Table Component
function SortableTable({ players, columns }) {
  // Default sort to first stat column (index 1) in descending order
  const defaultSort = { key: columns[1]?.key, direction: 'desc' };
  const { items: sortedPlayers, requestSort, sortConfig } = useSortableData(players, defaultSort);

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return styles['table-header'];
    }
    return sortConfig.key === name ? 
      `${styles['table-header']} ${styles[sortConfig.direction]}` : 
      styles['table-header'];
  };

  const getSortIndicator = (name) => {
    if (!sortConfig || sortConfig.key !== name) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const renderCell = (player, column) => {
    const value = player[column.key];
    
    // Handle special cases
    if (column.key === 'playerName') {
      return <PlayerNameCell playerId={player.playerId} />;
    }
    
    if (column.key === 'passCmp') {
      const completions = player.passCompletions || 0;
      const attempts = player.passAttempts || 0;
      return <td className={styles['stat-cell']}>{completions}/{attempts}</td>;
    }
    
    if (column.key === 'rushYardsPerAttempt') {
      const yards = player.rushYards || 0;
      const attempts = player.rushAtt || 0;
      const ypa = attempts > 0 ? (yards / attempts).toFixed(1) : '0.0';
      return <td className={styles['stat-cell']}>{ypa}</td>;
    }
    
    if (column.key === 'fieldGoalPercentage') {
      const made = player.fieldGoalsMade || 0;
      const attempted = player.fieldGoalsAttempted || 0;
      const percentage = attempted > 0 ? Math.round((made / attempted) * 100) : 0;
      return <td className={styles['stat-cell']}>{percentage}%</td>;
    }
    
    if (column.key === 'puntAverage') {
      const yards = player.puntYards || 0;
      const punts = player.punts || 0;
      const average = punts > 0 ? Math.round(yards / punts) : 0;
      return <td className={styles['stat-cell']}>{average}</td>;
    }
    
    // Default case
    return <td className={styles['stat-cell']}>{formatNumber(value)}</td>;
  };

  return (
    <div className={styles['table-container']}>
      <table className={styles['position-table']}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                className={getClassNamesFor(column.key)}
                onClick={() => requestSort(column.key)}
                style={{ cursor: 'pointer' }}
              >
                {column.label}{getSortIndicator(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.playerId || index} className={styles['table-row']}>
              {columns.map((column) => (
                <React.Fragment key={column.key}>
                  {renderCell(player, column)}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SortableTable;
