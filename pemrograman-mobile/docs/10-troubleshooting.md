# Troubleshooting Guide - Smart Task Planner Mobile

## Common Issues

### 1. Metro Bundler Issues

#### Error: `Unable to resolve module`

**Symptom:** Module not found errors during build

**Solutions:**
```bash
# Clear Metro cache
npx expo start --clear

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Reset watchman
watchman watch-del-all
```

#### Error: `React Native version mismatch`

**Symptom:** Version conflict warnings

**Solutions:**
```bash
# Check Expo version
npx expo --version

# Update Expo SDK
npx expo upgrade

# Clear all caches
npx expo start --clear
rm -rf node_modules package-lock.json
npm install
```

---

### 2. Authentication Issues

#### Issue: WebView Auth not working

**Symptom:** Google login fails or token not received

**Solutions:**
1. Check CORS configuration on backend
2. Verify redirect URI in Google Console matches
3. Check if WebView supports JavaScript

```typescript
// In WebViewAuth.tsx
<WebView
  source={{ uri: authUrl }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  onMessage={handleMessage}
/>
```

#### Issue: Token not persisting

**Symptom:** User logged out on app restart

**Solutions:**
1. Verify AsyncStorage is working
2. Check Zustand persist configuration

```typescript
// Check auth store persist config
persist(
  (set, get) => ({ ... }),
  {
    name: "auth-storage",  // Key name
    storage: createJSONStorage(() => AsyncStorage),
  }
)
```

---

### 3. API/Network Issues

#### Issue: `Network request failed`

**Symptom:** API calls fail with network error

**Solutions:**
```typescript
// Check API URL in .env
EXPO_PUBLIC_API_URL=https://taskplanner.dastrevas.com/api

// Add timeout configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});
```

#### Issue: CORS errors

**Symptom:** API requests blocked by CORS policy

**Solutions:**
1. Ensure backend has proper CORS headers
2. Check backend CORS configuration
3. Verify API URL is correct

---

### 4. Navigation Issues

#### Issue: Screen not found

**Symptom:** 404 error when navigating

**Solutions:**
1. Verify file is in correct directory
2. Check file naming (lowercase, hyphens)
3. Restart Metro bundler

#### Issue: Navigation not working

**Symptom:** router.push/router.replace doesn't work

**Solutions:**
```typescript
// Ensure router is initialized
const router = useRouter();

// Use correct path format
router.push("/(main)/new-task");
router.push({ pathname: "/(main)/new-task", params: { taskId } });
```

---

### 5. State Management Issues

#### Issue: Data not updating after mutation

**Symptom:** UI doesn't reflect API changes

**Solutions:**
```typescript
// Ensure query invalidation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
  queryClient.invalidateQueries({ queryKey: ["taskStats"] });
}
```

#### Issue: Stale data displayed

**Symptom:** Old data shown after update

**Solutions:**
```typescript
// Reduce stale time
staleTime: 0,  // Always refetch

// Or force refetch
queryClient.invalidateQueries({ queryKey: ["tasks"] });
```

---

### 6. Build Errors

#### Error: `createTaskMutation doesn't exist`

**Symptom:** ReferenceError in new-task.tsx

**Solution:** Fixed - mutation variable name was `taskMutation`

#### Error: Native module not found

**Symptom:** Module import fails

**Solutions:**
```bash
# Reinstall pods (iOS)
cd ios
pod install
cd ..

# Clean build
npx expo prebuild --clean
```

#### Error: Android build fails

**Solutions:**
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..

# Or use fresh prebuild
npx expo prebuild --platform android --clean
```

---

### 7. Styling Issues

#### Issue: Styles not applying

**Symptom:** Elements don't have expected styling

**Solutions:**
1. Check StyleSheet.create is correct
2. Verify style names match
3. Check for typos in style properties

```typescript
// Correct usage
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

#### Issue: Layout problems

**Symptom:** Elements overlapping or not aligned

**Solutions:**
1. Verify Flexbox properties
2. Check parent-child relationships
3. Add `flex: 1` to parent containers

---

### 8. Performance Issues

#### Issue: Slow app performance

**Solutions:**
1. Use React.memo for components
2. Use useCallback for functions
3. Avoid anonymous functions in render
4. Implement pagination for long lists

```typescript
// Optimize component
const TaskCard = React.memo(({ task }) => {
  const handlePress = useCallback(() => {
    // Handle press
  }, []);

  return <TouchableOpacity onPress={handlePress}>...</TouchableOpacity>;
});
```

---

### 9. iOS Specific Issues

#### Issue: Safe area not handled

**Solutions:**
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top }}>
  {/* Content */}
</View>
```

#### Issue: WebView crashes

**Solutions:**
1. Check iOS WebView configuration
2. Limit JavaScript execution
3. Handle memory warnings

---

### 10. Android Specific Issues

#### Issue: Status bar styling

**Solutions:**
```typescript
import { StatusBar } from 'expo-status-bar';

<StatusBar style="dark" />
```

#### Issue: Back button handling

**Solutions:**
```typescript
// Handle hardware back button
useEffect(() => {
  const subscription = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
      // Handle back
      return true;
    }
  );
  return () => subscription.remove();
}, []);
```

---

## Debugging Tips

### Enable Debug Menu
1. Shake device or press `Cmd+D` (iOS Simulator)
2. Press `Cmd+M` (Android Emulator)

### View Logs
```bash
# Filter for specific tag
adb logcat | grep "ReactNative"

# iOS
xcrun simctl booted log show
```

### Check Network Requests
```typescript
// Add logging interceptor
api.interceptors.request.use((config) => {
  console.log('API Request:', config.method, config.url);
  return config;
});
```

## Getting Help

If issues persist:
1. Check Expo documentation: https://docs.expo.dev
2. Search Expo forums
3. Check GitHub issues
4. Review React Native docs

## Known Limitations

| Issue | Workaround |
|-------|-----------|
| WebView limitations | Use native OAuth when possible |
| Large list performance | Implement virtualized lists |
| Offline sync | Manual refresh for now |
| Background tasks | Limited on iOS |
