const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Passthrough copy for assets, images, and admin
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "images": "assets/img" });
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

  // Configure collection for posts
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("posts/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });

  // Create a collection of all tags
  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function(item) {
      if( "tags" in item.data ) {
        let tags = item.data.tags;

        tags = tags.filter(function(item) {
          switch(item) {
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
      "liquid"
    ],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid"
  };
};
