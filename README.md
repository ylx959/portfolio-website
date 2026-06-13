# YLX Studio Website

This website is open for reference and borrowing.

Feel free to use the layout, structure, or interaction ideas for your own project.

Please keep the work respectful.
Do not claim the original content, images, or identity as your own.



## Image previews

Project detail images use blurred low-resolution previews before the full images load.

After adding or changing project images in `scripts/mineport-project-data.js`, run:

```bash
node scripts/generate-previews.js
```

The script only creates missing files in `assets/images/previews`, so it is safe to run again.

## Asset versions

After changing local CSS or JavaScript, bump the cache-busting versions in `index.html`:

```bash
node scripts/bump-assets.js
```

The script increments only local `styles/*.css` and `scripts/*.js` references.
