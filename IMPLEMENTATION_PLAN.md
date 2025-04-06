# Implementing Sanity Visual Editing in Astro Project

This document outlines the step-by-step plan to implement Sanity's visual editing capabilities in our Astro project, following the tutorial at [https://www.sanity.io/guides/sanity-astro-blog](https://www.sanity.io/guides/sanity-astro-blog).

## Project Setup Analysis

We have two repositories:
1. **Sanity Studio** (root directory) - This is the Sanity CMS where content is managed
2. **Astro Frontend** (`astro-mosaic-emarketing` directory) - This is the Astro site that displays the content

## Implementation Steps

### 1. Update Dependencies

#### Astro Project:
- Install required dependencies for React integration:
```bash
cd astro-mosaic-emarketing
npx astro add @astrojs/react
```

### 2. Set Up Environment Variables and Type Definitions

- Ensure `env.d.ts` has the proper references for Sanity:
```typescript
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />
```

### 3. Embed Sanity Studio in Astro

- Update `astro.config.mjs` to add the Studio basePath:
```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    sanity({
      projectId: '<your-project-id>',
      dataset: '<dataset-name>',
      useCdn: false,
      apiVersion: "2025-01-28",
      studioBasePath: '/studio' // This enables the Studio at /studio route
    }),
    react()
  ],
});
```

- Create a Sanity configuration file in the Astro project:
```bash
touch astro-mosaic-emarketing/sanity.config.ts
```

- Add basic configuration to the file:
```typescript
// ./sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});
```

### 4. Configure Sanity Client in Astro

- Update `astro.config.mjs` to include visual editing configuration
- Ensure environment variables are correctly set up

### 5. Create Visual Editing Support Files

- Create/update `loadQuery.ts` utility for handling visual editing requests:
```bash
mkdir -p astro-mosaic-emarketing/src/sanity/lib
touch astro-mosaic-emarketing/src/sanity/lib/loadQuery.ts
```

- Add the loadQuery implementation for Visual Editing support:
```typescript
// ./src/sanity/lib/load-query.ts
import { type QueryParams } from "sanity";
import { sanityClient } from "sanity:client";

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";

const token = import.meta.env.SANITY_API_READ_TOKEN;

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  if (visualEditingEnabled && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.",
    );
  }

  const perspective = visualEditingEnabled ? "previewDrafts" : "published";

  const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
      stega: visualEditingEnabled,
      ...(visualEditingEnabled ? { token } : {}),
    },
  );

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,
  };
}
```

### 6. Update Sanity Configuration with Presentation Tool

- Create document location resolver:
```bash
touch astro-mosaic-emarketing/src/sanity/lib/resolve.ts
```

- Implement the resolver:
```typescript
// ./src/sanity/lib/resolve.ts
import { defineLocations } from "sanity/presentation";
import type { PresentationPluginOptions } from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    // Add more locations for other post types
    post: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/post/${doc?.slug}`,
          },
        ],
      }),
    }),
  },
};
```

- Update `sanity.config.ts` in the Sanity Studio project to add the Presentation tool:
```typescript
// ./sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";
import { presentationTool } from "sanity/presentation";
import { resolve } from "./src/sanity/lib/resolve";

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: location.origin,
    }),
  ],
  schema,
});
```

### 7. Create Visual Editing Layout Component

- Create a layout component that includes the `VisualEditing` component
- Configure the layout to wrap content pages

### 8. Update Content Model and Queries

- Ensure content queries support visual editing context
- Add support for source maps and perspectives

### 9. Configure Environment Variables

- Ensure all required environment variables are set up in `.env`:
```
PUBLIC_SANITY_PROJECT_ID="<your-project-id>"
PUBLIC_SANITY_DATASET="<dataset-name>"
SANITY_API_READ_TOKEN="<your-api-token>"
PUBLIC_SANITY_VISUAL_EDITING_ENABLED="true"
```

### 10. Add Support for Portable Text and Images

- Ensure proper rendering of Portable Text content
- Configure image URL builder for Sanity images

### 11. Test Visual Editing

- Test the visual editing experience between Studio and frontend
- Validate overlay functionality and editing workflow
- Visit the Studio at `http://localhost:4321/studio`
- Test the Presentation tool at `http://localhost:4321/studio/presentation`

## Implementation Details

### Key Files to Create/Modify:

#### Sanity Studio:
- `sanity.config.ts`: Add presentation tool and document resolver
- Create resolver file for document locations

#### Astro Frontend:
- `astro.config.mjs`: Update Sanity integration config
- `src/sanity/lib/loadQuery.ts`: Create utility for visual editing queries
- `src/layouts/VisualEditingLayout.astro`: Create layout with visual editing component
- Update content display components to work with source maps
- `sanity.config.ts`: Add Studio configuration in the Astro project

### Environmental Setup:
- Ensure API tokens are correctly set
- Configure CORS settings for the Studio
  - First time loading the Studio, you'll need to add the URL to CORS origins
  - Follow the prompts in the Studio UI to add the CORS settings

## Next Steps After Implementation

- Document the visual editing workflow for content editors
- Set up CI/CD for automatic deployments
- Consider performance optimizations 