<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ziv5A0TQWB5bzg2txkdF8bpebPCksw38

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure Environment Variables:
   - Copy `.env.example` to `.env.local`
     ```bash
     cp .env.example .env.local
     ```
   - Set the `VITE_GEMINI_API_KEY` in `.env.local` to your Gemini API key.
   - Set other variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.) as needed.

3. Run the app:
   `npm run dev`
