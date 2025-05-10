Editorial Management Workflow Process (Updated)

     1. Article Submission

- Action : Author submits the paper through the Editorial Management System (EMS) interface.
- Details Captured :
- Case Number (auto-generated unique Submission ID)
- Article Type (e.g., Research, Review, Commentary)
- Issue Type (optional, e.g., Regular Issue, Special Issue)
- Title
- Author(s) (name, affiliation, contact details)
- Submission Date (auto-recorded)
- Uploaded Files (manuscript, images, supporting docs)
- Online Copyright Form : Mandatory digital copyright transfer agreement.
- Additional Information : Metadata (e.g., keywords, abstract, funding details).
- System Response :
- Status set to "New Submission" .
- History Log : Submission event recorded with timestamp and details (e.g., "Submitted by [Author] on [Date]").
- Email Notification :
- To Author(s): "Your submission '[Title]' (Submission ID: [Case Number]) has been received on [Submission Date]."
- CC to all co-authors.
- Paper moves to Publisher To Do List > New Submission .

  2.  Initial Screening by Managing Editor/Editor-in-Chief (EIC)

- Action : Managing Editor or EIC reviews the submission for completeness, relevance, and copyright compliance.
- Features Available :
- Full History View : EIC can access the article’s history log (e.g., submission date, files uploaded).
- Search Functionality : EIC can search the article title/author on Google and Google Scholar via integrated search buttons or API (e.g., checks for plagiarism or prior publication).
- Options :
- Accept for Review : Assign an Editor.
- Reject : Send rejection notice.
- Withdraw : Author or EIC can withdraw the submission (e.g., if duplicate or incomplete).
- System Update :
- If accepted: Status to "Need To Assign Editor" .
- If rejected: Status to "Reject" , moves to Completed Assignments > Reject .
- If withdrawn: Status to "Withdrawn" , logged in history.
- History Log : Action recorded (e.g., "Screened by [EIC Name] on [Date], Outcome: [Accept/Reject/Withdraw]").
- Email Notification :
- If accepted: To Author(s): "Your submission '[Title]' (Submission ID: [Case Number]) has passed initial screening."
- If rejected: To Author(s): "Your submission '[Title]' has been rejected. Reason: [Feedback]."
- If withdrawn: To Author(s): "Your submission '[Title]' has been withdrawn. Reason: [Details]."
- CC to all co-authors.

  3.  Editor Assignment

- Action : EIC assigns an Editor.
- Features Available :
- Full History View : Editor can see all prior steps (e.g., submission details, screening outcome).
- Search Functionality : Editor can search Google/Google Scholar for the article.
- System Update :
- Status changes to "Editor Invited" , then "Under Review" once accepted.
- History Log : "Editor [Name] assigned on [Date]."
- Email Notification :
- To Editor: "You’re assigned to '[Title]' (Submission ID: [Case Number])."
- To Author(s): "An Editor has been assigned to '[Title]'."
- CC to all co-authors.

  4.  Reviewer Invitation and Assignment

- Action : Editor invites/assigns Reviewers.
- Features Available :
- Full History View : Editor and Reviewers can view the article’s history (e.g., submission, editor assignment).
- Search Functionality : Reviewers can search Google/Google Scholar to validate originality or context.
- Options :
- Editor reviews alone or invites 2-3 Reviewers.
- System Update :
- Status to "Reviewers Invited" , then "Review In Progress" once accepted.
- History Log : "Reviewer [Name] invited/accepted on [Date]."
- Email Notification :
- To Reviewers: "You’re invited to review '[Title]' (Submission ID: [Case Number]). Deadline: [Date]."
- To Author(s): "Your submission '[Title]' is under peer review."
- CC to all co-authors.

  5.  Review Process

- Action : Reviewers submit feedback (scores, comments, recommendation).
- Features Available :
- Full History View : Reviewers see all prior steps.
- Search Functionality : Available for additional research.
- System Update :
- Status to "Submission With Required Reviews Completed" once all reviews are in.
- History Log : "Review completed by [Reviewer Name] on [Date]."
- Email Notification :
- To Editor: "All reviews for '[Title]' (Submission ID: [Case Number]) are complete."

  6.  Editorial Decision

- Action : Editor makes a decision based on reviews.
- Features Available :
- Full History View : Editor reviews entire process history.
- Search Functionality : Editor can cross-check article online.
- Options :
- Accept : Proceed to publication.
- Revise : Request revisions.
- Reject : End process.
- Withdraw : Editor or Author can withdraw (e.g., ethical concerns).
- System Update :
- Accept : Status to "Decision In Process" , then "Accept" .
- Revise : Status to "Revisions Due" .
- Reject : Status to "Reject" .
- Withdraw : Status to "Withdrawn" .
- History Log : "Decision: [Outcome] by [Editor Name] on [Date]."
- Email Notification :
- Accept : To Author(s): "Your submission '[Title]' has been accepted."
- Revise : To Author(s): "Your submission '[Title]' requires revisions by [Deadline]. Feedback: [Details]."
- Reject : To Author(s): "Your submission '[Title]' has been rejected. Reason: [Feedback]."
- Withdraw : To Author(s): "Your submission '[Title]' has been withdrawn. Reason: [Details]."
- CC to all co-authors.

  7.  Revision Loop (if applicable)

- Action : Author submits revised paper.
- System Update :
- Status to "New Revision Received" .
- History Log : "Revision submitted by [Author] on [Date]."
- Email Notification :
- To Editor: "Revised submission for '[Title]' (Submission ID: [Case Number]) received."
- To Author(s): "Your revised submission '[Title]' has been received."
- CC to all co-authors.

  8.  Final Acceptance and Payment Processing

- Action : Editor/EIC approves final version.
- Features Available :
- Full History View : EIC confirms all steps.
- Search Functionality : Final originality check.
- System Update :
- Status to "Accept" , then "In Press" after payment.
- History Log : "Final acceptance on [Date]."
- Email Notification :
- To Author(s): "Your article '[Title]' is accepted. Please complete payment."
- CC to all co-authors.
- Payment Step :
- Invoice generated; Author pays via gateway.
- History Log : "Payment confirmed on [Date]."
- Email Notification :
- To Author(s): "Payment for '[Title]' confirmed. Article now in press."
- CC to all co-authors.

  9.  Preparation for Publication

- Action : Editorial team prepares article (formatting, DOI assignment).
- System Update :
- Status remains "In Press" .
- History Log : "Preparation completed on [Date]."
- Email Notification :
- To Author(s): "Your article '[Title]' is being prepared for publication."
- CC to all co-authors.

  10. Publication via API

- Action : Article published to the journal.
- Process :
- EMS pushes article via API to journal platform (multi-journal or single-journal compatible).
- System Update :
- Status to "Publish" .
- History Log : "Published on [Date] in [Journal Name]."
- Email Notification :
- To Author(s): "Your article '[Title]' (Submission ID: [Case Number]) is published in [Journal Name]. Link: [URL]."
- CC to all co-authors.

  Enhanced Features

1.  Submission ID History :

- Each Submission ID has a detailed log accessible by EIC, Editors, and Reviewers, showing every step (e.g., submission, screening, reviews, decisions) with timestamps and user actions.

2.  Search Integration :

- Google and Google Scholar search buttons or API calls embedded in the EMS interface for EIC, Editors, and Reviewers to verify originality or context at any stage.

3.  Decision or Withdrawal :

- Editorial posts can result in standard decisions (Accept, Revise, Reject) or withdrawal by Author/EIC/Editor (e.g., for ethical issues, duplicates).

4.  Email Notifications : Comprehensive and inclusive of all co-authors.
