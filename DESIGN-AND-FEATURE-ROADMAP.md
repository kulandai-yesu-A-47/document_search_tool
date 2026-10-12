# KnowSpace — UI refresh and feature roadmap

## UI refresh included in this version
- Responsive left navigation and workspace header
- Unified teal/mint visual system, typography, spacing, cards, buttons, and status pills
- Search empty state, searching state, result count, and no-results state
- More structured document rows with preview, download, and delete actions
- Redesigned upload form with selected-file feedback and recent uploads
- Shared in-page preview dialog for PDF, common image/video formats, and basic text/HTML files
- Responsive layout for smaller screens
- No new runtime dependencies added

## Existing functionality retained
- React Router pages: search, upload, and all documents
- Existing Django API calls for upload, list, search, delete, and stats
- Existing backend indexing/search implementation

## Suggested features to add next (not implemented by this UI refresh)
1. **Document metadata:** file type, file size, upload date, and processing status.
2. **Library filters:** file type, date range, tags, and sort by newest/name.
3. **Pagination or infinite loading:** for larger document libraries.
4. **Document details panel:** show metadata and matching text snippets in the preview.
5. **Word document preview:** render DOCX in-app using a maintained client-side preview library, after validating supported formats and file size.
6. **Better search:** highlighted matching terms, filters, recent searches, and useful empty states.
7. **Upload progress and validation:** progress indicator, allowed file types, size checks, duplicate detection, and retry.
8. **Authentication and permissions:** users/teams, private documents, and ownership-aware delete/download endpoints.
9. **Persistent file storage:** use durable object/file storage for deployed uploads; don't rely on ephemeral application filesystem storage.
10. **Observability and reliability:** backend health endpoint, API error reporting, tests for upload/search/delete, and backup/restore checks.
11. **Accessibility:** keyboard focus management in preview dialog, Escape-to-close, and screen-reader status messages.
12. **Security:** validate file content/type on backend, enforce upload size, protect secrets, and ensure uploaded HTML cannot execute in the app origin.

## Verification note
The source was updated without adding dependencies. A production build could not be re-run in this editing environment because the frontend dependency install did not complete. Re-run locally from `Frontend/`:

```powershell
npm install
npm run build
npm run lint
```

Then test upload, search, preview, download, and delete against the local Django API before deploying.
