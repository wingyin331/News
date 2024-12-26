## Overview

[Getting Started](#getting-started)
[Usage](#usage)

## Usage

After installing the project dependenices, there are two ways to run the site locally:

1. `npm run dev` - Queries our production backend servers for content
2. `npm run local` - Queries *local* backend servers for content. This requires having three services running locally on your machine
    1. [Our API][8] on port 8080
    2. A WordPress server, running on port 80. This is easiest to setup with [XAMPP][9] and [Bitnami for XAMPP modules][10]
    3. A [MySQL server][11], typically running on port 3306, though this port can be changed in your WordPress configuration.

## Built With

- [Next.js][3] - JavaScript library for building user interfaces
- [React.js][4] - JavaScript library for building user interfaces
- [Babel][5] - JavaScript compiler to convert ECMAScript 2015+ code into a backwards compatible JS
- [Sass][6] - CSS extension
- [Google Analytics][7] - Analytics tracking
