import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const sortedPosts = posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    );

  return rss({
    title: "Jason Edward",
    description: "Building AI systems that work.",
    site: context.site!,
    items: sortedPosts.map((post) => ({
      link: `/blog/${post.slug}`,
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate),
    })),
  });
}
