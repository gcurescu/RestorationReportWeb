# Testing IndexedDB Photo Migration

## Test Plan

1. **Basic Functionality**
   - [x] Install idb-keyval package
   - [x] Create imageStore.js with required functions
   - [x] Update photo upload to use IndexedDB
   - [x] Update photo display to fetch from IndexedDB
   - [x] Add lazy loading for PDF export libraries

2. **Photo Storage Testing**
   
   ### Test Cases:
   
   #### 1. Photo Upload
   - Navigate to `/app/new-job`
   - Upload photos in different sections
   - Verify photos are stored with new metadata format:
     ```json
     {
       "id": "photo_timestamp_random",
       "caption": "Photo caption",
       "timeISO": "2025-08-30T...",
       "thumbDataUrl": "data:image/jpeg;base64,...",
       "size": 12345,
       "type": "image/jpeg"
     }
     ```
   - Check browser DevTools > Application > IndexedDB for stored blobs

   #### 2. Photo Display
   - View uploaded photos in form previews
   - Navigate to job preview page
   - Verify photos load correctly from IndexedDB
   - Check fallback to thumbnail if blob missing

   #### 3. Job Operations
   - Delete a job with photos - verify photos are cleaned up from IndexedDB
   - Duplicate a job with photos - verify photos are duplicated in storage
   - Check that photo references are updated correctly

   #### 4. Legacy Compatibility
   - Test that existing jobs with old photo format (direct dataURL) still work
   - Verify PhotoRenderer component handles both formats

   #### 5. PDF Export
   - Generate PDF from a job with photos
   - Verify lazy loading of html2canvas and jsPDF works
   - Check that photos appear correctly in exported PDF

3. **Migration Verification**
   
   ### Before/After Comparison:
   
   **Old Format (localStorage):**
   ```json
   {
     "photos": [{
       "caption": "Photo 1",
       "file": "data:image/jpeg;base64,...very-long-string",
       "timeISO": "2025-08-30T..."
     }]
   }
   ```
   
   **New Format (IndexedDB + metadata):**
   ```json
   {
     "photos": [{
       "id": "photo_1724976543210_abc123def",
       "caption": "Photo 1", 
       "timeISO": "2025-08-30T...",
       "thumbDataUrl": "data:image/jpeg;base64,...small-thumb",
       "size": 245760,
       "type": "image/jpeg"
     }]
   }
   ```

4. **Performance Benefits**
   - localStorage no longer stores large base64 strings
   - Faster job loading (only metadata loaded initially)
   - Photos loaded on-demand when displayed
   - Better memory usage with thumbnails
   - Compressed images reduce storage size

## Testing Instructions

1. Start development server: `npm start`
2. Navigate to application: `http://localhost:3000`
3. Create new job with photos
4. Verify photos are stored correctly
5. Test all CRUD operations with photos
6. Export PDF to test lazy loading

## Production Deployment

For AWS Amplify, ensure the SPA rewrite rule is configured (see AMPLIFY_DEPLOYMENT.md).
