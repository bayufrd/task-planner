/**
 * API ROUTES DOCUMENTATION
 * 
 * ============================================================================
 * Current Structure (v0 - Legacy)
 * ============================================================================
 * 
 * src/app/api/
 * ├── tasks/
 * │   ├── route.ts              [GET, POST] /api/tasks
 * │   ├── [id]/
 * │   │   └── route.ts          [GET, PUT, DELETE] /api/tasks/:id
 * │   └── priority/
 * │       └── route.ts          [GET] /api/tasks/priority
 * 
 * 
 * ============================================================================
 * Future Structure (v1 - Recommended)
 * ============================================================================
 * 
 * src/app/api/
 * ├── v1/
 * │   ├── tasks/
 * │   │   ├── route.ts          [GET, POST] /api/v1/tasks
 * │   │   ├── [id]/
 * │   │   │   └── route.ts      [GET, PUT, DELETE] /api/v1/tasks/:id
 * │   │   ├── today/
 * │   │   │   └── route.ts      [GET] /api/v1/tasks/today
 * │   │   ├── upcoming/
 * │   │   │   └── route.ts      [GET] /api/v1/tasks/upcoming
 * │   │   └── priority/
 * │   │       └── route.ts      [GET] /api/v1/tasks/priority
 * │   │
 * │   ├── tags/
 * │   │   ├── route.ts          [GET, POST] /api/v1/tags
 * │   │   └── [id]/
 * │   │       └── route.ts      [GET, PUT, DELETE] /api/v1/tags/:id
 * │   │
 * │   ├── analytics/
 * │   │   ├── route.ts          [GET] /api/v1/analytics
 * │   │   ├── productivity/
 * │   │   │   └── route.ts      [GET] /api/v1/analytics/productivity
 * │   │   ├── completion-rate/
 * │   │   │   └── route.ts      [GET] /api/v1/analytics/completion-rate
 * │   │   └── time-tracking/
 * │   │       └── route.ts      [GET] /api/v1/analytics/time-tracking
 * │   │
 * │   └── settings/
 * │       └── route.ts          [GET, PUT] /api/v1/settings
 * │
 * ├── health.ts                 [GET] /api/health
 * └── README.md                 Documentation
 * 
 * 
 * ============================================================================
 * Task API Endpoints (Current)
 * ============================================================================
 * 
 * GET /api/tasks
 *   Query params:
 *     - page (int, default: 1)
 *     - limit (int, default: 20, max: 100)
 *     - search (string): Search in title/description
 *     - status (string): TODO | IN_PROGRESS | DONE
 *     - priority (string): HIGH | MEDIUM | LOW
 *     - sort (string): deadline | priority | createdAt
 *     - order (string): asc | desc
 *   Response: { success, data: [], pagination: {...}, timestamp }
 *   Status: 200 | 400 (invalid params)
 * 
 * POST /api/tasks
 *   Body: {
 *     title (required, 2-200 chars)
 *     priority (required): HIGH | MEDIUM | LOW
 *     deadline (required): ISO date string
 *     description? (max 1000 chars)
 *     status? (default: TODO): TODO | IN_PROGRESS | DONE
 *     estimatedDuration? (1-1440 minutes)
 *     reminderTime? (minutes)
 *     tags? (max 10 items)
 *   }
 *   Response: { success, data: {}, message, timestamp }
 *   Status: 201 (created) | 400 (validation error) | 500 (server error)
 * 
 * GET /api/tasks/:id
 *   Response: { success, data: {...task details...}, timestamp }
 *   Status: 200 | 400 (invalid id) | 404 (not found) | 500 (error)
 * 
 * PUT /api/tasks/:id
 *   Body: { title?, priority?, deadline?, description?, status?, ... }
 *   Response: { success, data: {...}, message, timestamp }
 *   Status: 200 | 400 (invalid id/data) | 404 (not found) | 500 (error)
 * 
 * DELETE /api/tasks/:id
 *   Response: { success, message, timestamp }
 *   Status: 200 | 400 (invalid id) | 404 (not found) | 500 (error)
 * 
 * GET /api/tasks/priority
 *   Query params:
 *     - page (int, default: 1)
 *     - limit (int, default: 20, max: 100)
 *     - includeDetails (bool): Include full task data
 *   Response: { success, data: [], pagination: {...}, timestamp }
 *   Status: 200 | 400 (invalid params)
 * 
 * 
 * ============================================================================
 * Response Format (Standard)
 * ============================================================================
 * 
 * Success Response:
 * {
 *   "success": true,
 *   "message": "Success message",
 *   "data": {...},
 *   "timestamp": "2026-04-08T12:00:00.000Z"
 * }
 * 
 * Pagination Response:
 * {
 *   "success": true,
 *   "message": "Success",
 *   "data": [...],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 100,
 *     "totalPages": 5,
 *     "hasNextPage": true,
 *     "hasPrevPage": false
 *   },
 *   "timestamp": "2026-04-08T12:00:00.000Z"
 * }
 * 
 * Error Response:
 * {
 *   "success": false,
 *   "error": {
 *     "message": "Error message",
 *     "code": "ERROR_CODE",
 *     "details": {...}
 *   },
 *   "timestamp": "2026-04-08T12:00:00.000Z"
 * }
 * 
 * 
 * ============================================================================
 * Helper Files
 * ============================================================================
 * 
 * src/lib/api-helpers.ts
 *   - successResponse()
 *   - errorResponse()
 *   - paginatedResponse()
 *   - validationError()
 *   - notFoundResponse()
 *   - unauthorizedResponse()
 *   - forbiddenResponse()
 * 
 * src/lib/api-validation.ts
 *   - validateTaskInput()
 *   - validateId()
 *   - validatePaginationParams()
 *   - validateSearchQuery()
 *   - TaskInput interface
 * 
 * src/lib/routes.ts
 *   - FRONTEND_ROUTES
 *   - API_ROUTES
 *   - API_METHODS
 *   - QUERY_PARAMS
 *   - DEFAULT_PAGINATION
 *   - buildApiUrl()
 *   - getAbsoluteApiUrl()
 * 
 * src/lib/frontend-routes.ts
 *   - Routes (for component navigation)
 */
