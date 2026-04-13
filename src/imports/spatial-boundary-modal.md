Update the Spatial Governance → Spatial Boundaries Registry page.

When the user clicks the Edit button in the table row, open a modal popup that allows editing the boundary details, changing the organization, and managing assigned users.

The design must follow the same red theme, typography, spacing, and UI style used across the dashboard.

Modal Layout

Modal Title:
Edit Boundary

Subtitle:
Update spatial boundary information and manage access.

Width: 640px
Padding: 24px
Border radius: 12px
Overlay: dark transparent background

Section 1 — Boundary Details

Boundary Name
Text input (prefilled)

Boundary Type
Dropdown
Example:

Residential Zoning

Infrastructure Grid

Protected Zones

Organization

Dropdown to select organization.

Example options:

Ministry of Housing

Electricity Authority

Environment Council

Transport Authority

Helper text under dropdown:

"Changing organization will allow adding users from that organization."

Section 2 — Assigned Users

Title:
Assigned Users

Show current users assigned to this boundary.

User row layout:

• Checkbox
• User avatar circle
• User name
• Organization name (small grey text)
• Remove icon

Example:

☐ Ahmed Khalid
Environment Council
[Remove]

☐ Sara Mohammed
Electricity Authority
[Remove]

Clicking Remove removes user from the list.

Scrollable container if more than 6 users.

Section 3 — Add Users

Title:
Add Users

Components:

Organization Filter

Dropdown

Default:
All Organizations

This allows selecting users from other organizations as well.

Search Users Field

Placeholder:
Search users by name or organization

When typing, show user suggestions dropdown

Each suggestion row:

• Checkbox
• User avatar
• User name
• Organization name

Selecting checkbox adds the user to Assigned Users list.

Footer Buttons

Right aligned buttons:

Cancel — secondary outline button

Save Changes — primary red button

Same style as Add Boundary button

Interaction Behavior

When clicking Save Changes:

Show success toast notification:

✔ Boundary updated successfully

Modal closes and table updates.

UI Design Rules

Maintain consistency with existing dashboard:

• same font family
• 16px vertical spacing
• subtle grey separators
• red accent highlights
• minimal enterprise UI
• smooth hover states

💡 Pro UX tip (used in enterprise GIS systems):

You could also show a small organization badge next to each user so admins can easily see when users belong to different organizations.

Example:

Ahmed Khalid
[Environment Council]