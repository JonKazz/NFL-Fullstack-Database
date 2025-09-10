# Error Pages and Error Handling Guide

This guide explains how to use the 404 and 500 error pages, and how to handle API errors in your React application.

## Error Pages Created

### 1. 404 Not Found Page (`/404`)
- **Component**: `NotFound.js`
- **Route**: `/404` and catch-all `*`
- **When to use**: When a page or resource doesn't exist
- **Features**:
  - Clean, modern design with gradient background
  - "Go Home" and "Go Back" buttons
  - Responsive design for mobile devices

### 2. 500 Server Error Page (`/500`)
- **Component**: `ServerError.js`
- **Route**: `/500`
- **When to use**: When there's a server error or API failure
- **Features**:
  - Error-specific styling with red gradient
  - "Try Again" and "Go Home" buttons
  - Responsive design

## How to Know When to Direct to 404

### 1. **URL Routing (Automatic)**
The catch-all route `*` in `App.js` automatically shows the 404 page for any URL that doesn't match your defined routes:

```jsx
<Route path="*" element={<NotFound />} />
```

### 2. **API Errors (Manual)**
Use the error handling utilities to redirect to 404 when API calls fail:

```javascript
import { useErrorHandler, is404Error } from '../utils/errorHandler';

function MyComponent() {
  const { handleApiError, safeApiCall } = useErrorHandler();

  useEffect(() => {
    async function fetchData() {
      try {
        // This will automatically redirect to 404 if API returns 404
        const data = await safeApiCall(() => fetchPlayerProfile(playerId));
        setData(data);
      } catch (error) {
        // Error is automatically handled by safeApiCall
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
  }, []);
}
```

### 3. **Manual Navigation**
You can manually navigate to error pages:

```javascript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleNotFound = () => {
    navigate('/404');
  };

  const handleServerError = () => {
    navigate('/500');
  };
}
```

## Error Handling Utilities

### `useErrorHandler` Hook
Provides error handling functions:

```javascript
const { handleApiError, safeApiCall } = useErrorHandler();

// Handle errors manually
handleApiError(error, { fallbackPath: '/' });

// Wrap API calls for automatic error handling
const data = await safeApiCall(() => fetchData());
```

### Utility Functions
- `is404Error(error)`: Check if error is a 404
- `isServerError(error)`: Check if error is a server error (5xx)

## Common Scenarios

### 1. **Player Not Found**
```javascript
// In PlayerPage component
try {
  const profile = await fetchPlayerProfile(playerId);
  if (!profile.exists) {
    setProfileExists(false); // Show "Player Not Found" banner
  }
} catch (error) {
  if (is404Error(error)) {
    navigate('/404'); // Redirect to 404 page
  }
}
```

### 2. **Game Not Found**
```javascript
// In GameSummary component
try {
  const game = await fetchGameInfo(gameId);
  setGameData(game);
} catch (error) {
  if (is404Error(error)) {
    navigate('/404');
  }
}
```

### 3. **Season Not Found**
```javascript
// In SeasonSummary component
try {
  const season = await fetchSeasonInfo(year);
  setSeasonData(season);
} catch (error) {
  if (is404Error(error)) {
    navigate('/404');
  }
}
```

### 4. **Server Errors**
```javascript
try {
  const data = await fetchData();
} catch (error) {
  if (isServerError(error)) {
    navigate('/500');
  }
}
```

## Best Practices

1. **Use the error handling utilities** instead of manual try-catch blocks
2. **Provide fallback content** when possible (like the ProfileNotFoundBanner)
3. **Log errors** for debugging purposes
4. **Test error scenarios** by visiting invalid URLs or using invalid IDs
5. **Keep error messages user-friendly** and actionable

## Testing Error Pages

1. **Test 404 page**: Visit `/invalid-url` or `/player/999999`
2. **Test 500 page**: Visit `/500` directly
3. **Test API errors**: Use invalid player IDs or game IDs in your components

## Customization

You can customize the error pages by:
- Modifying the CSS in the `.module.css` files
- Changing the error messages and button text
- Adding additional error types (403, 401, etc.)
- Integrating with error tracking services (Sentry, etc.)
