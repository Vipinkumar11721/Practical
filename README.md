# Listings App

Simple listings application using Express, EJS, MongoDB Atlas and Cloudinary for image storage.

## Setup (local)

1. Copy `.env.example` to `.env` and fill values (do not commit `.env`).
2. Install dependencies:

```powershell
npm install
```

3. Start locally:

```powershell
npm run dev
# or
npm start
```

4. Visit `http://localhost:8080`.

## Deployment (Render)

See `RENDER_DEPLOY.md` for step-by-step instructions. In short:
- Push repository to GitHub
- Create a Web Service on Render pointing to this repo
- Set the environment variables on Render (do NOT upload `.env`)
- Ensure MongoDB Atlas Network Access includes Render's IPs or `0.0.0.0/0` for testing

## Notes
- `.env` is ignored by Git. Ensure secrets are set in your hosting environment.
- If you get npm dependency errors on deploy, ensure `package.json` and `.npmrc` (legacy-peer-deps=true) are present.

## Contact
If you want me to add CI, a nicer README, or Dockerfile for Render/other platforms, tell me and I'll add it.
