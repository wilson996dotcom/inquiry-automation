# Inquiry automation pipeline

Form submission -> database -> AI categorization -> salesperson notification.

## Setup

1. **Database**: create a free project at supabase.com. In the SQL editor,
   run the `create table` statement found in a comment at the bottom of
   `db.js`. Copy your project URL and service_role key from
   Project Settings > API.

2. **AI**: get an API key from console.anthropic.com.

3. **Email**: get a free API key from resend.com (or swap `notify.js` for
   Nodemailer + Gmail SMTP if you'd rather not sign up for another
   service).

4. Copy `.env.example` to `.env` and fill in all the values.

5. Install and run:
   ```
   npm install
   npm start
   ```

6. Test it:
   ```
   curl -X POST http://localhost:3000/webhook \
     -H "Content-Type: application/json" \
     -d '{"name":"Jane Doe","phone":"0722000000","message":"What are your fees for a 2 year old?"}'
   ```
   You should see a new row in Supabase and an email land in
   `NOTIFY_EMAIL_TO`.

## Wiring up your actual form

Point your website form's submit handler (or your form tool's webhook/
integration setting) at `POST https://your-deployed-url/webhook` with a
JSON body of `{ name, phone, email, message }`.

## Deploying

Push this folder to a GitHub repo, then create a new Web Service on
Render.com (or Railway.app) pointing at it. Set the same environment
variables from `.env` in the host's dashboard. Both platforms run a
small Node app like this comfortably inside a $50/month budget --
often for $0-7/month at low traffic.

## Extending

- **Admin dashboard**: add a `GET /inquiries` route that reads from
  Supabase and returns JSON, then build a simple frontend (or use
  Supabase's built-in table editor as a stopgap admin view).
- **Follow-up reminders**: add a scheduled job (e.g. a cron-triggered
  route, or Supabase's pg_cron) that queries inquiries with
  `status = 'categorized'` and `created_at` older than 2 days, then
  sends a follow-up notification.
- **WhatsApp**: see the comment at the bottom of `notify.js` for the
  Twilio WhatsApp integration point.
"# inquiry-automation" 
