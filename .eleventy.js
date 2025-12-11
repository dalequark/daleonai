const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  // Passthrough copy for assets, images, and admin
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");

  // Format dates
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // Custom filter for absolute URLs
  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    if (!url) {
      return base;
    }
    return new URL(url, base).toString();
  });

  // Image shortcode
  eleventyConfig.addShortcode("image", async function(src, alt, cls, sizes) {
    if (!src) return "";

    // Fix src path: remove leading slash if present, assuming relative to root
    let inputPath = src;
    if (src.startsWith("/")) {
        inputPath = "." + src;
    }

    // Only optimize local images
    if (src.startsWith("http")) {
        return `<img src="${src}" alt="${alt}" class="${cls}" loading="lazy" decoding="async">`;
    }

    try {
        let metadata = await Image(inputPath, {
          widths: [400, 800, 1200],
          formats: ["avif", "webp", "jpeg"],
          outputDir: "./_site/img/",
          urlPath: "/img/"
        });

        let imageAttributes = {
          alt,
          sizes: sizes || "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
          loading: "lazy",
          decoding: "async",
          class: cls || ""
        };

        return Image.generateHTML(metadata, imageAttributes);
    } catch (e) {
        console.warn(`[11ty] Image processing failed for ${src}: ${e.message}`);
        // Fallback to original src if optimization fails (e.g. file not found)
        return `<img src="${src}" alt="${alt}" class="${cls}" loading="lazy" decoding="async">`;
    }
  });

  // Configure collection for posts
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("posts/*.md").sort(function (a, b) {
      return b.date - a.date;
    });
  });

  // Create a collection of all tags
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the tags used in your templates, like page.md
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy >= 2.0.0
    return [...tagSet].sort();
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: [
      "md",
      "html",
      "liquid",
      "njk"
    ],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid"
  };
};
