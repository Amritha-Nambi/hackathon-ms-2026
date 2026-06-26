# Sales Call Summary Generator Test Cases

## Purpose
This test case file validates the AI-powered Sales Call Summary Generator against a sample B2B IT services sales call transcript. It is designed for QA verification of both input handling and output correctness.

## Folder structure
- `testing/`
  - `test_cases/`
    - `sales_call_summary_test_case.md`

## Sample transcript
**Sample Sales Call Transcript — Managed IT Services**

**Company:** NorthBridge IT Solutions
**Rep:** Sarah Chen, Account Executive
**Prospect:** Mike Reyes, Office Manager at a 35-person accounting firm

---

**Sarah:** Hi, is this Mike Reyes?

**Mike:** Yeah, this is Mike.

**Sarah:** Hey Mike, this is Sarah Chen calling from NorthBridge IT Solutions. I know I'm catching you out of the blue — do you have about two minutes, or is now a bad time?

**Mike:** Uh, I've got a few minutes, what's this about?

**Sarah:** Totally fair question. We work with accounting and professional services firms in the area — helping them with IT support, cybersecurity, and cloud backups so they're not scrambling when something breaks or during tax season crunch. I noticed your firm's been growing, and I'm curious — who handles IT support for you guys right now? Do you have someone in-house, or is it more of an as-needed thing?

**Mike:** It's kind of a mess honestly. We have a guy who comes in if something's really broken, but day-to-day it's just whoever on the team can figure it out.

**Sarah:** Yeah, that's really common, especially at your size — too small to justify a full-time IT person, but big enough that "winging it" starts costing real time. Can I ask, when something does go down — like email outage, a slow server, a printer network issue — how long does it typically take to get it fixed?

**Mike:** Could be same day, could be three days if he's busy with other clients.

**Sarah:** Right, and during that time your team's basically stuck, which during busy season has to be brutal. What about backups and security — if you got hit with ransomware tomorrow, do you know how you'd recover, or how long that'd take?

**Mike:** Honestly... not really sure. I think we have some backup thing but I couldn't tell you the details.

**Sarah:** That's actually one of the most common things we hear, and it's the scariest one — a lot of firms find out their backup wasn't working *after* they need it. I don't want to take up more of your time on the phone going down a rabbit hole, but would it be worth a 20-minute call with one of our engineers to do a quick, no-cost assessment of where you stand — response times, backup health, basic security gaps? No pressure, no pitch, just a clear picture of your risk.

**Mike:** Yeah, I think that'd be useful. Let me check with our partner though, he handles vendor stuff.

**Sarah:** Of course — totally reasonable. Would it help if I sent over a short one-pager you could forward to him, so he's not going in blind? And maybe we look at calendars for early next week for that assessment call?

**Mike:** Yeah, that works. Tuesday or Wednesday is usually good.

**Sarah:** Perfect, I'll send a couple of time slots for Tuesday afternoon and Wednesday morning, plus that one-pager, in the next hour. What's the best email for you?

**Mike:** mreyes@[company].com

**Sarah:** Got it. Thanks Mike, talk soon.

**Mike:** Sounds good, thanks.

---

## Test scenarios

### 1. Transcript input methods
- Test 1.1: Paste the transcript text directly into the input area.
- Test 1.2: Upload the transcript as a `.txt` file.

Expected result:
- Input is accepted.
- The app processes the transcript successfully.
- No validation error appears for either method.

### 2. Output sections
- Verify the app returns the following sections:
  - Very concise summary
  - Key Discussion Points
  - Customer Needs
  - Next Actions

Expected result:
- Each section is present and clearly labeled.
- The output is separated into bullet points where appropriate.

### 3. Summary conciseness
- Verify the `summary` is one short sentence.
- Verify it is CRM-ready and not overly verbose.

Expected result:
- The summary captures the call outcome in a single, concise statement.

### 4. Key discussion points
- Verify the app captures the main pain and topic areas:
  - lack of reliable in-house IT support
  - slow or inconsistent response times
  - uncertainty about backup and security
  - interest in a risk assessment call

Expected result:
- Key discussion points include the topics above.
- The bullets are short and factual.

### 5. Customer needs
- Verify the app identifies customer needs such as:
  - reliable IT support without a full-time hire
  - faster issue response times
  - backup health visibility and ransomware readiness
  - a low-risk assessment to understand gaps

Expected result:
- Customer needs reflect the prospect's pain and requirements.
- Each item is actionable and relevant.

### 6. Next actions
- Verify the app captures next actions:
  - send a one-pager to the prospect
  - propose time slots for a 20-minute assessment call
  - follow up after the prospect checks with their partner

Expected result:
- Next actions are specific and assigned in context.
- `follow_up_needed` is set to `true` in the schema.

### 7. Sentiment
- Verify the app sets `sentiment` based on call tone.

Expected result:
- Sentiment is `positive` or `neutral` depending on the model.
- It should not be negative given the prospect agreed to the next step.

### 8. Security and privacy
- Verify the output does not expose raw transcript text.
- Verify the output does not unnecessarily expose personal contact details such as the prospect’s email.
- If metadata extraction includes contact details, confirm only the required fields are included if present.

Expected result:
- Output excludes raw conversation text.
- The email is not returned in the summary text unless required by the feature.

### 9. JSON schema validation
- Verify the backend returns a valid JSON structure with fields:
  - `summary`
  - `key_points`
  - `customer_needs`
  - `action_items`
  - `sentiment`
  - `follow_up_needed`
  - optional caller metadata fields if extracted

Expected result:
- The JSON response is parseable.
- Array fields contain strings only.
- Required fields are present.

## Expected JSON example
```json
{
  "summary": "The call identified unreliable IT support, slow issue response times, and backup uncertainty, and the sales rep secured agreement for a team assessment call next week.",
  "key_points": [
    "No reliable in-house IT support",
    "Issue resolution can take up to three days",
    "Uncertainty around backup and ransomware recovery",
    "Prospect agreed to a no-cost assessment call"
  ],
  "customer_needs": [
    "Reliable proactive IT support",
    "Faster issue response times",
    "Clear backup health and recovery plan",
    "A low-risk technical assessment before vendor review"
  ],
  "action_items": [
    "Send a one-pager to the prospect",
    "Propose Tuesday afternoon or Wednesday morning for the assessment call",
    "Follow up after the prospect checks with their partner"
  ],
  "sentiment": "positive",
  "follow_up_needed": true
}
```

## Pass/fail criteria
- Pass: The app accepts the transcript, returns all required sections, and the output aligns with the expected summary, customer needs, and next actions.
- Fail: Any required section is missing, the summary is too verbose, or the JSON response is invalid.

## Notes
- This transcript is a cold-to-warm outbound sales call for managed IT services.
- The test case should be reused for both paste and file upload flows.
- The QA file is intended for manual testing and validation of the app’s behavior and data output.
