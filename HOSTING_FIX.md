# IMPORANT: Fix Your Hosted Database Access

The "Invalid Credentials" error often happens because the hosted application cannot talk to the Database properly due to security blocks.

## Step 1: Whitelist All IPs in MongoDB Atlas
Your hosted app (Render) has a changing IP address. You MUST allow access from anywhere.

1. Go to **MongoDB Atlas Dashboard** (cloud.mongodb.com).
2. Click **Network Access** in the left sidebar.
3. Click **+ Add IP Address**.
4. Click **Allow Access From Anywhere** (it will add `0.0.0.0/0`).
5. Click **Confirm**.

## Step 2: Update Environment Variables on Render
Make sure your Render Environment Variables are correct.

1. Go to **Render Dashboard** -> Your Service -> **Environment**.
2. Check `MONGO_URI`. It MUST be exactly this (copy-paste):
   
   ```text
   mongodb+srv://princechouhan754288_db_user:PRINCE%402008@cluster0.5kezn8k.mongodb.net/onlinebookstore?retryWrites=true&w=majority
   ```

   (Note: I removed `&appName=Cluster0` which sometimes causes issues with older drivers, but `PRINCE%402008` is the correct encoding for your password if it contains `@`).

3. Ensure `SESSION_SECRET` is set to something (e.g. `secretkey`).

## Step 3: Debugging
After doing the above, wait for Render to maintain the service.
Visit: `https://<your-app-url>/debug-admin`
- If it says `user_found: true`, then the admin exists.
- If it says `user_found: false`, the database is connected but empty.
