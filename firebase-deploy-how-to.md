# Firebase Hosting Deployment Guide

This guide outlines the steps to deploy the **Music Master Trainer** to Firebase Hosting.

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Authenticated with Firebase (`firebase login`)

## Deployment Steps

1. **Build the Application**
   Ensure you have a fresh production build:
   ```bash
   npm run build
   ```
   *Vite outputs the build to the `dist/` directory.*

2. **Verify Project ID**
   Open `.firebaserc` and ensure the `projects.default` value matches your Firebase Project ID. You can find your Project ID in the [Firebase Console](https://console.firebase.google.com/).

3. **Initialize (Optional)**
   If you want to re-configure hosting settings:
   ```bash
   firebase init hosting
   ```
   - Public directory: `dist`
   - Single-page app: `Yes`
   - GitHub Actions: `No`
   - Overwrite index.html: `No`

4. **Deploy**
   Run the deployment command:
   ```bash
   firebase deploy --only hosting
   ```

5. **View Your App**
   Once deployment is complete, Firebase will provide a hosting URL (e.g., `https://your-project-id.web.app`).
