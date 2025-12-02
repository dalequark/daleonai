# Dale on AI - Eleventy Blog

This is the source code for [Dale on AI](https://daleonai.com), migrated to [Eleventy](https://www.11ty.dev/).

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd daleonai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
It starts the Eleventy development server (usually at [http://localhost:8080](http://localhost:8080)) and watches for changes.

### `npm run build`

Builds the app for production to the `_site` folder.\
It compiles the Sass files to CSS and generates the static HTML pages.

### `npm run css`

Compiles the Sass files from `assets/css/style.scss` to `_site/assets/css/style.css`.

### `npm run watch:css`

Runs the Sass compiler in watch mode. Use this in a separate terminal tab during development if you are making style changes, so they are recompiled automatically.

## Project Structure

- **`posts/`**: Markdown files for blog posts.
- **`_includes/`**: HTML partials and templates.
- **`_layouts/`**: Page layouts (e.g., default, post).
- **`assets/`**: Static assets like CSS (Sass), images, and JS.
- **`images/`**: Post-specific images.
- **`.eleventy.js`**: Eleventy configuration file.
