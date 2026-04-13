Update the Edit Role popup behavior in the Roles Management screen with the following logic.

1. Special Case – BSDI Super Admin Role

When the user clicks Edit on “BSDI Super Admin”, open a popup with these sections:

Popup Title
Edit Role – BSDI Super Admin

Section 1: Selected Users (Top Card)

Show the 3 currently assigned users.

Each user row should include:

User avatar

User name

Department / Organization label (optional small text)

Status dropdown with options:

Active

Deactivate

Example row layout:

Avatar | User Name | Department | Status Dropdown (Active / Deactivate)

Section 2: Add More Users (All Users List)

Below the selected users card, add another card called:

All Users

Inside this card:

Add a Search Bar at the top

Placeholder: Search users by name, email, or department

Below the search bar show a scrollable list of all users

Each row contains:

Checkbox

Avatar

User Name

Department

Status Dropdown (Active / Deactivate)

When a user is checked:

The user should automatically appear in the Selected Users section above

Section 3: Popup Footer

Buttons aligned right:

Cancel (secondary button)

Update Role (primary red button)

2. For All Other Roles (Entity Admin, Department Reviewer, etc.)

Keep the existing popup design but improve user selection.

Add improvements:
A. Search Bar

Inside All Users list, add a search bar at the top

Placeholder:
Search users by name, email, or department

B. Selected Users Card

Above the All Users list add a card:

Selected Users

When users are selected from the list:

They appear in this card

This allows admins to review all selected users in one place

Each row contains:

Avatar

User Name

Department

Remove icon (X)

UI / Layout Improvements

Ensure:

Proper spacing between cards (24px)

Cards have soft shadows

Popup width around 720–800px

Scrollable user list

Consistent padding (16–20px)

Interaction Behavior

Selecting a checkbox adds user to Selected Users

Removing from Selected Users unchecks them from the list

Search filters users in real time

Status dropdown available only in Super Admin popup