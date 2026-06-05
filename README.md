# Prime SpoT — React Native App

A native Android/iOS video streaming app connected to your Prime SpoT backend.

---

## Screens
- **Home** — latest uploaded files in a 2-column grid with pull-to-refresh & pagination
- **Search** — live search connected to `/api/search`
- **Watch** — full video player (react-native-video) with controls, seek, mute, share

---

## Setup

### 1. Install dependencies
```bash
cd PrimeSpoTApp
npm install
```

### 2. Android link (native modules need linking)
```bash
# react-native-vector-icons
npx react-native link react-native-vector-icons

# For Android: add to android/app/build.gradle:
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 3. iOS (if building for iOS)
```bash
cd ios && pod install && cd ..
```

### 4. Run
```bash
npx react-native run-android
# or
npx react-native run-ios
```

---

## Backend API Routes Required

Add these to your Flask `app.py` if they don't exist yet:

```python
@app.route('/api/files')
def api_files():
    page  = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    # query your DB / Telegram index here
    # return JSON:
    return jsonify({
        "files": [...],   # list of file objects
        "total": 100,     # total file count
        "page": page,
        "pages": 5        # total pages
    })

@app.route('/api/search')
def api_search():
    q    = request.args.get('q', '')
    page = int(request.args.get('page', 1))
    # search your DB by file_name
    return jsonify({
        "files": [...],
        "total": 10,
        "page": page,
        "pages": 1
    })

@app.route('/api/file/<int:file_id>')
def api_file(file_id):
    # return single file object
    return jsonify({ ... })
```

### File object shape:
```json
{
  "file_id":    2,
  "file_name":  "Radio Flyer (1992) BR-Rip.mkv",
  "file_url":   "https://...",
  "file_size":  "1.4 GB",
  "mime_type":  "video/x-matroska",
  "thumbnail":  "https://...",
  "view_count": 42,
  "is_audio":   false
}
```

---

## Project Structure
```
PrimeSpoTApp/
├── App.tsx                        # Root with ThemeProvider + Navigation
├── index.js                       # Entry point
├── src/
│   ├── api/index.ts               # All API calls (BASE_URL here)
│   ├── components/
│   │   ├── FileCard.tsx           # Thumbnail card used in grids
│   │   ├── Header.tsx             # Top bar with theme toggle
│   │   └── SearchBar.tsx          # Search input
│   ├── context/ThemeContext.tsx   # Global dark/light state
│   ├── navigation/index.tsx       # Stack + Tab navigators
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   └── WatchScreen.tsx
│   └── theme/index.ts             # Colors matching Prime SpoT web
```

---

## Change Backend URL
Edit `src/api/index.ts`:
```ts
export const BASE_URL = 'https://primespot.koyeb.app';
```
