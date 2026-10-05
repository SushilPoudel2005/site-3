# Soil Stewards Farm Website

A multi-page static site for the University of Idaho Soil Stewards Student Farm. Built with plain HTML/CSS/JS — no build step, no server required.

## Pages
- `index.html` — Home
- `about.html` — Farm history, mission, director info
- `volunteer.html` — "Get Dirty" info + volunteer signup form
- `events.html` — Tuesday Market, Get Dirty sessions, upcoming events
- `blog.html` — Photo/video gallery + farm journal
- `contact.html` — Inquiry form + map + contact info

## Publish on GitHub Pages
1. Create a new GitHub repo (e.g. `soil-stewards-farm`).
2. Push everything in this folder to the repo's `main` branch.
3. In the repo, go to **Settings → Pages**, set source to `main` branch, `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/soil-stewards-farm/` within a minute or two.

## Photos & videos
Real farm photos and video clips are already in place throughout the site (`assets/photo-01.jpg` … `photo-13.jpg`, `video-01.mp4` … `video-05.mp4`), converted from the originals and compressed for the web. The real farm logo is `assets/logo.png`, used as both the header mark and the favicon.

### Photos still needed (placeholders)
These spots currently show a green "Photo coming soon" box. Save a photo into `assets/` with **exactly** this file name and it replaces the placeholder automatically — no code changes needed. Use `.jpg`, landscape (sideways) if possible, around 1600px wide.

| File name | What it should show | Where it appears |
|---|---|---|
| `pumpkin-fest.jpg` | Pumpkins / people at Pumpkin Fest | Home slideshow (slide 1), Blog "Pumpkin Fest" post |
| `farm-wide.jpg` | Wide view of the farm or hoop house | Home slideshow (slide 2, "Get Dirty") |
| `market-stand.jpg` | Tuesday Market stand with produce | Home slideshow (slide 3), Events "Tuesday Market" card |
| `volunteers.jpg` | Volunteers planting / weeding / harvesting | Home "welcome!" photo, Events "Get Dirty" card |
| `crew-group.jpg` | Group photo of the Soil Stewards crew | About page, above "Meet our farm director" |
| `iris-mayes.jpg` | Headshot of Iris Mayes (square works best) | About page director card (shows "IM" initials until added) |


To add more later:
1. Drop new image/video files into `assets/`.
2. Add a tile using the shared `.media` class so sizing/rounding matches the rest of the gallery:
   ```html
   <img class="media" src="assets/your-photo.jpg" alt="Describe the photo">
   ```
   or for video:
   ```html
   <video class="media" controls preload="metadata" src="assets/your-video.mp4"></video>
   ```
Keep video files reasonably small/compressed (aim under ~10MB each) for fast loading, or host longer videos on YouTube and embed those instead.

## Making the forms actually work
GitHub Pages only serves static files — it can't process form submissions on its own. The **"Stay updated" email signup** (home page), **volunteer signup**, and **contact/inquiry** forms are wired up to send to [Formspree](https://formspree.io) (free for basic use). Until they're connected, submitting shows a friendly message pointing people to soilstewards@uidaho.edu:

1. Create a free Formspree account.
2. Create a new form and copy its endpoint (looks like `https://formspree.io/f/abc123xy`).
3. In `index.html`, `volunteer.html` and `contact.html`, replace `YOUR_FORM_ID` in the `<form action="...">` line with your real endpoint — you can use the same form ID for both, or create two separate Formspree forms to keep signups and inquiries apart.

Alternative: if you'd rather not use a third-party service, you can swap either `<form>` for a plain `mailto:` link, or embed a Google Form instead.

## Customizing
- Colors, fonts, and spacing all live in `css/styles.css` (see the `:root` variables at the top).
- The header (with dropdown menus) and footer are repeated on every page — if you change one, change all six.
- Page title banners use the watercolor `brush` style: `<h1 class="brush brush-green">about us</h1>` (colors: green, blue, sun, tomato, rose, teal).
- The home page slideshow is the `.slider` block at the top of `index.html` — update the Pumpkin Fest slide after the event.
