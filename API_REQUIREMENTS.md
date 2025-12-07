# API Requirements

This document describes the API endpoints needed for the photobooth UI application.

## Overview

The frontend now makes dynamic API calls on page load based on the current URL path. The API should use the URL context to return appropriate data.

## API Endpoints

### 1. GET /api/folders/:path?

**Purpose:** Fetch list of folders in a specific directory

**Parameters:**
- `path` (optional, from URL query): Folder path (e.g., `photos`, `photos/trip1`)
  - If no path provided, defaults to `/photos`

**Request Example:**
```
GET /api/folders/photos
GET /api/folders/photos/trip1
GET /api/folders (defaults to /photos)
```

**Response Format:** JSON array of folder objects

**Response Example:**
```json
[
  { 
    "name": "Photos",
    "date": "2023-10-01"
  },
  { 
    "name": "Videos",
    "date": "2023-09-15"
  },
  { 
    "name": "Documents",
    "date": "2023-08-20"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully fetched folders
- `4xx/5xx` - Error fetching folders

---

### 2. GET /api/images/:path?

**Purpose:** Fetch list of images in a specific directory

**Parameters:**
- `path` (optional, from URL query): Folder path (e.g., `photos`, `photos/trip1`)
  - If no path provided, defaults to `/photos`

**Request Example:**
```
GET /api/images/photos
GET /api/images/photos/trip1
GET /api/images (defaults to /photos)
```

**Response Format:** JSON array of image objects

**Response Example:**
```json
[
  { 
    "img": "https://example.com/image1.jpg",
    "title": "Image 1"
  },
  { 
    "img": "https://example.com/image2.jpg",
    "title": "Image 2"
  },
  { 
    "img": "https://example.com/image3.jpg",
    "title": "Image 3"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully fetched images
- `4xx/5xx` - Error fetching images

---

### 3. POST /api/folders

**Purpose:** Create a new folder

**Request Body:**
```json
{
  "name": "New Folder Name"
}
```

**Response Format:** JSON object with created folder details

**Response Example:**
```json
{
  "name": "New Folder Name",
  "date": "2025-12-07"
}
```

**Status Codes:**
- `200 OK` - Folder created successfully
- `400 Bad Request` - Invalid folder name
- `4xx/5xx` - Error creating folder

---

### 4. POST /api/upload

**Purpose:** Upload multiple files to the current folder

**Request Format:** FormData with file attachments
- Field name: `files`
- Field value: Multiple File objects

**Request Example:**
```javascript
const formData = new FormData();
formData.append('files', fileObject1);
formData.append('files', fileObject2);

fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

**Accepted MIME Types:**
- `image/*` (all image formats)
- `video/*` (all video formats)

**Response:**
- No JSON response needed, status code only

**Status Codes:**
- `200 OK` - Files uploaded successfully
- `400 Bad Request` - No files provided or invalid file type
- `4xx/5xx` - Error uploading files

---

## URL Path Context

The frontend uses the current pathname to determine which folder's data to fetch:

| URL Path | API Call |
|----------|----------|
| `/` | `/api/folders/photos` and `/api/images/photos` |
| `/photos` | `/api/folders/photos` and `/api/images/photos` |
| `/photos/trip1` | `/api/folders/photos/trip1` and `/api/images/photos/trip1` |
| `/videos` | `/api/folders/videos` and `/api/images/videos` |
| `/videos/summer` | `/api/folders/videos/summer` and `/api/images/videos/summer` |

---

## Implementation Notes

1. The API calls are made automatically on page load and whenever the pathname changes (via router navigation)
2. If an API call fails, the frontend falls back to empty arrays
3. The frontend expects both `folders` and `images` to be returned as JSON arrays
4. Folder objects must have at least `name` and `date` properties
5. Image objects must have at least `img` (URL) and `title` properties
6. The loading state (`isLoading`) is managed by the frontend while data is being fetched

---

## Client-Side Implementation

The `fetchFolderAndImageData` utility function in `utils.js` handles all API calls:

```javascript
export const fetchFolderAndImageData = async (folderContext) => {
  // Makes both API calls and returns { folders, images }
}
```

This function is called within a `useEffect` hook that depends on `pathname`, ensuring data is refetched whenever the user navigates to a different folder.
