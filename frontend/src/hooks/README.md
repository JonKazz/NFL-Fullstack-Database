# Data Validation and 404 Handling

This guide explains how to handle URL-based navigation where users can type any URL, but you need to validate that the data actually exists before showing the page.

## The Problem

Users can type any URL like:
- `/season/2010` - but there's no data for 2010
- `/player/999999` - but this player doesn't exist  
- `/game/invalid` - but this game doesn't exist

Without validation, these pages would load but show empty data or errors.

## The Solution

Use the data validation hooks to check if data exists before rendering the page. If data doesn't exist, automatically redirect to 404.

## Available Hooks

### 1. `useSeasonValidation(year)`
Validates that a season year exists in your database.

```javascript
import { useSeasonValidation } from '../hooks/useDataValidation';

function SeasonSummary() {
  const { year } = useParams();
  const { loading, dataExists, data } = useSeasonValidation(year);
  
  if (loading) return <div>Validating season...</div>;
  // If dataExists is false, user is automatically redirected to 404
  
  // Rest of your component logic
}
```

### 2. `usePlayerValidation(playerId)`
Validates that a player exists in your database.

```javascript
import { usePlayerValidation } from '../hooks/useDataValidation';

function PlayerPage() {
  const { playerId } = useParams();
  const { loading, dataExists, data } = usePlayerValidation(playerId);
  
  if (loading) return <div>Validating player...</div>;
  // If dataExists is false, user is automatically redirected to 404
  
  // Rest of your component logic
}
```

### 3. `useGameValidation(gameId)`
Validates that a game exists in your database.

```javascript
import { useGameValidation } from '../hooks/useDataValidation';

function GameSummary() {
  const { gameId } = useParams();
  const { loading, dataExists, data } = useGameValidation(gameId);
  
  if (loading) return <div>Validating game...</div>;
  // If dataExists is false, user is automatically redirected to 404
  
  // Rest of your component logic
}
```

### 4. `useTeamSeasonValidation(teamId, year)`
Validates that a team exists for a specific season.

```javascript
import { useTeamSeasonValidation } from '../hooks/useDataValidation';

function TeamSeasonSummary() {
  const { teamId, year } = useParams();
  const { loading, dataExists, data } = useTeamSeasonValidation(teamId, year);
  
  if (loading) return <div>Validating team season...</div>;
  // If dataExists is false, user is automatically redirected to 404
  
  // Rest of your component logic
}
```

## How It Works

1. **URL Parsing**: React Router extracts parameters from the URL
2. **Data Validation**: The hook calls your API to check if data exists
3. **Automatic Redirect**: If data doesn't exist, user is redirected to `/404`
4. **Component Rendering**: If data exists, component renders normally

## Example Flow

```
User types: /season/2010
    ↓
useSeasonValidation(2010) checks available seasons
    ↓
2010 not in available seasons
    ↓
User automatically redirected to /404
```

## Implementation in Your Components

### Before (No Validation)
```javascript
function SeasonSummary() {
  const { year } = useParams();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData(year).then(setData);
  }, [year]);
  
  // Problem: Page loads even if year doesn't exist
  return <div>{data ? 'Data loaded' : 'No data'}</div>;
}
```

### After (With Validation)
```javascript
function SeasonSummary() {
  const { year } = useParams();
  const { loading, dataExists } = useSeasonValidation(year);
  
  if (loading) return <div>Validating...</div>;
  // If dataExists is false, user is redirected to 404 automatically
  
  // Only runs if data exists
  return <div>Season data loaded successfully!</div>;
}
```

## Testing

Test your validation by visiting these URLs:

### Valid URLs (should work)
- `/season/2023` (if 2023 data exists)
- `/player/12345` (if player exists)
- `/game/67890` (if game exists)

### Invalid URLs (should redirect to 404)
- `/season/2010` (no data for 2010)
- `/player/999999` (player doesn't exist)
- `/game/invalid` (game doesn't exist)

## Custom Validation

You can create custom validation hooks for other data types:

```javascript
import { useDataValidation } from '../hooks/useDataValidation';

function useCustomValidation(id) {
  return useDataValidation(
    async () => {
      const data = await fetchCustomData(id);
      return { exists: !!data, data };
    },
    [id],
    { fallbackPath: '/' }
  );
}
```

## Benefits

1. **Better UX**: Users see proper 404 pages instead of empty data
2. **SEO Friendly**: Search engines understand when content doesn't exist
3. **Error Prevention**: Prevents API calls for non-existent data
4. **Consistent Behavior**: All invalid URLs redirect to 404
5. **Loading States**: Users see validation progress

## Error Handling

The hooks automatically handle:
- Network errors
- API failures
- Invalid responses
- Missing data

All of these scenarios redirect users to the appropriate error page (404 or 500).
