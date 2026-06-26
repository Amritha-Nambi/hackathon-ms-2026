# Use Case 2: Sales Call Summary Generator Checklist

## Overview
This checklist captures the key implementation and validation requirements for the sales call summary generator app.

## Required Input
- [ ] Transcript text input via paste or uploaded text file

## Optional Metadata Extraction
- [ ] Extract caller name if present in the transcript
- [ ] Extract date of call if present in the transcript
- [ ] Extract product recommendation if present in the transcript
- [ ] Extract phone number if present in the transcript

## Output Requirements
- [ ] Very concise AI summary
- [ ] Key Discussion Points
- [ ] Customer Needs
- [ ] Next Actions
- [ ] CRM-ready summary format
- [ ] Bullet-point breakdown for each section
- [ ] JSON output model for integration

## JSON Output Model
- `summary`: one very concise sentence describing the call outcome
- `key_points`: array of short discussion bullets
- `customer_needs`: array of customer need or pain point bullets
- `action_items`: array of next-action bullets
- `sentiment`: optional sentiment label such as `positive`, `neutral`, or `negative`
- `follow_up_needed`: boolean flag indicating whether the transcript requires follow-up
- `caller_name`: optional extracted caller name if present in transcript
- `call_date`: optional extracted call date if present in transcript
- `product_recommendation`: optional extracted product recommendation if present in transcript
- `phone_number`: optional extracted phone number if present in transcript

### Example JSON
```json
{
  "summary": "The caller discussed pricing and requested a quote, and the agent agreed to send it as the next step.",
  "key_points": [
    "Pricing was discussed",
    "Customer requested a quote",
    "Agent confirmed next steps for follow-up"
  ],
  "customer_needs": [
    "Need a formal quote to compare options",
    "Looking for a price estimate based on current usage",
    "Needs decision support from the sales team"
  ],
  "action_items": [
    "Send the quote to the customer",
    "Follow up to confirm receipt and next meeting date"
  ],
  "sentiment": "positive",
  "follow_up_needed": true,
  "caller_name": "John Smith",
  "call_date": "2026-06-26",
  "product_recommendation": "Mid-market CRM package",
  "phone_number": "+61 400 000 000"
}
```

## Backend JSON Serialization
- [ ] The backend should accept transcript text as the only input.
- [ ] If metadata is detected in the transcript, extract it and include it in the JSON response.
- [ ] The AI prompt should return structured sections that map directly to the JSON fields.
- [ ] Convert AI output into the JSON model before returning it to the client.
- [ ] Ensure `summary` is a single concise sentence.
- [ ] Ensure `key_points`, `customer_needs`, and `action_items` are arrays of strings.
- [ ] Derive `sentiment` from the overall tone of the call, defaulting to `neutral` if uncertain.
- [ ] Set `follow_up_needed` to `true` when the transcript includes any unresolved next steps.
- [ ] Do not store the full transcript in persistent storage; keep it in memory only during processing.
- [ ] Return only the structured JSON fields to the UI.

## CRM Summary Format
- [ ] Caller Name
- [ ] Call Date
- [ ] Product Recommendation
- [ ] Phone Number
- [ ] Very concise summary (1-2 short sentences)
- [ ] Key Discussion Points (3-5 bullets)
- [ ] Customer Needs (3-5 bullets)
- [ ] Next Actions (2-4 bullets with owners or timing when available)

## Business Rules
- [ ] Only include information explicitly stated in the transcript
- [ ] Do not invent deadlines, owners, or commitments
- [ ] Mark next actions as follow-up if ownership or timing is missing
- [ ] Extract only data present in the transcript; do not add metadata not implied by the conversation
- [ ] Exclude raw transcript text from the summary output
- [ ] Exclude unrelated private or confidential details
- [ ] Exclude unnecessary personal contact information beyond the phone number if present

## Summary Quality
- [ ] Output is concise and CRM-friendly
- [ ] Summary uses a neutral, professional tone
- [ ] Bullets are short and actionable
- [ ] Key discussion points reflect the main topics discussed
- [ ] Customer needs capture pain points, requirements, and expectations
- [ ] Next actions are specific and clearly defined

## Security and Privacy
- [ ] Transcript content is not stored permanently
- [ ] Sensitive client data is protected
- [ ] Private information is not exposed in the generated summary
- [ ] AI output does not reveal unnecessary private or confidential details

## Testing and Validation
- [ ] Validate summary accuracy against the transcript
- [ ] Validate summary completeness across all required sections
- [ ] Validate correct identification of customer needs
- [ ] Validate correct capture of next actions
- [ ] Validate consistency across different transcript styles
- [ ] Validate that the app handles empty or invalid input gracefully
