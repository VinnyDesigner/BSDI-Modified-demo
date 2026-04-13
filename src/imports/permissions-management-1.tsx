Update the existing “Roles2” screen and convert it into a Permissions Management page while maintaining the same layout, red color theme, spacing, typography, and component styles used in the current dashboard.

1. Page Title Changes

Change Roles Directory → Permissions Directory

Update description text to:
“Manage system permissions and assign users to permission groups.”

Rename table column:
Role Name → Permission Name

Rename page label in sidebar:
Roles2 → Permissions

2. Top Action Button

Add a primary red button in the top-right corner of the Permissions Directory card.

Button:

Label: + Create Permission

Style: Same as existing Add Role button

Color: Red gradient used in the current design

Icon: Plus icon

3. Create Permission Popup (Modal)

When user clicks Create Permission, open a center modal popup.

Modal style:

Same modal style used in system

Rounded corners

Soft shadow

White background

Width: ~520px

Modal Title

Create Permission

Subtitle:
“Create a permission group and assign users from an organization.”

Popup Fields
1. Permission Name

Input Field

Label:
Permission Name

Placeholder:
“Enter permission name”

Example:
GIS Access Team

2. Select Organization

Dropdown Field

Label:
Organization

Placeholder:
“Select organization”

Example options:

Ministry of Housing

Urban Planning Authority

Transport Authority

Environment Authority

3. Organization Users List

After selecting an organization, show a section:

Header:
Organization Users (142 Users)

Below show scrollable user list with checkboxes

Layout:

Checkbox | Avatar | User Name | Role

Example:

☐ Ahmed Hassan — GIS Analyst
☐ Fatima Ali — Data Reviewer
☐ Khalid Noor — Metadata Editor
☐ Noor Salman — Department Admin

Allow multi-selection checkboxes

Button Behavior

Bottom buttons:

Left button
Cancel (secondary style)

Right button
Create Permission

Button state:

Disabled until:

Permission Name filled

At least one user selected

4. Success Popup

After clicking Create Permission, show a success modal popup with illustration.

Illustration style:
Minimal flat illustration similar to system UI style.

Illustration idea:
Team / group with shield icon.

Title:

Permission Created Successfully

Message:

“You can now assign spatial permissions to this group in the Spatial Governance page.”

Buttons:

Primary button
Go to Spatial Governance

Secondary button
Close

5. Table Content Update

Update the table row examples:

Permission Name | Description | Users | Type | Status | Actions

Example rows:

GIS Data Access
Access spatial data layers

Map Editing Team
Edit spatial features and boundaries

Spatial Review Team
Approve spatial submissions

6. Actions Column

Keep existing buttons:

Edit
Permissions

Button style:
Outlined red buttons as existing design.

7. Maintain Design Consistency

Important:

Keep these unchanged:

Sidebar layout

Bahrain branding

Dashboard header

Red theme

Card style

Table spacing

Icons style

Rounded elements

Typography hierarchy

Design should look like a natural extension of the current BSDI Admin Dashboard UI.