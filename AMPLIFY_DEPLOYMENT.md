# AWS Amplify Deployment Configuration

## SPA Rewrite Rule for Deep Links

To ensure that deep links (routes like `/app/jobs`, `/app/new-job`, `/app/jobs/123`) work correctly when users navigate directly to them or refresh the page, AWS Amplify needs to be configured with a Single Page Application (SPA) rewrite rule.

### Required Configuration

In your AWS Amplify console, add the following rewrite rule:

**Source Address Pattern:** `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>`

**Target Address:** `/index.html`

**Type:** `200 (Rewrite)`

### Alternative Configuration

If the regex above doesn't work, you can use this simpler approach:

**Source Address Pattern:** `</^\/app\/.*>`

**Target Address:** `/index.html`

**Type:** `200 (Rewrite)`

### Why This Is Needed

React Router handles client-side routing, but when users:
- Navigate directly to a deep link (e.g., `https://yoursite.com/app/jobs/123`)
- Refresh the page on a route other than the root
- Share/bookmark a specific page

The web server (AWS Amplify) needs to serve the `index.html` file so that React Router can take over and route to the correct component.

### Build Settings

Ensure your build settings in AWS Amplify are configured as follows:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Testing Deep Links

After deployment, test these routes:
- `/` (root - should show landing page)
- `/app` (should redirect to jobs list)
- `/app/jobs` (should show jobs list)
- `/app/new-job` (should show new job form)
- `/app/jobs/[id]` (should show specific job)
- `/app/jobs/[id]/preview` (should show job preview)

All routes should work both when navigating from within the app and when accessed directly via URL.
