import { sanityClient } from "sanity:client";

export async function loadQuery({ query, params, enabled }) {
  const visualEditingEnabled =
    import.meta.env.PUBLIC_SANITY_VISUAL_EDITOR_ENABLED === "true";

  const token = import.meta.env.SANITY_API_READ_TOKEN;

  if (visualEditingEnabled && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is requried during visual editing."
    );
  }

  const perspective = visualEditingEnabled ? "previewDrafts" : "published";
  const { result, resultSourceMap } = await sanityClient.fetch(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: visualEditingEnabled ? "withKeyArraySelector" : false,
      stega: visualEditingEnabled,
      ...(visualEditingEnabled ? { token } : {}),
      useCdn: !visualEditingEnabled,
    }
  );

  return {
    data: result,
    sourceMap: resultSourceMap,
    perspective,
  };
}
