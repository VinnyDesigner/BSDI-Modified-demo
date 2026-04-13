Update the Spatial Governance page to integrate Permission Role Management below the map. Remove the current “Spatial Boundaries Registry” table and replace it with a Permission Assignment table that allows managing users within created roles.

Keep the existing layout, red theme, typography, card style, spacing, and icon style consistent with the dashboard UI.

1. Remove Existing Section

Remove the section:

Spatial Boundaries Registry
(Search bar + filters + boundary list)

Replace it with a new section for Role-based Spatial Permissions.

2. New Section Title

New card title:

Spatial Permission Groups

Subtitle:

Manage spatial access permissions and users assigned to each permission group.

Icon:
Use the shield / permission icon similar to Roles page.

3. Add Role Selector (Connected to Permissions Page)

Above the table add a Role Selector panel.

Label:

Permission Groups

Display all created permissions from the Permissions page.

Layout:

Selectable radio cards or list.

Example:

◉ GIS Access Team
○ Map Editing Team
○ Spatial Review Team
○ Data Access Group

When selecting a role → the table updates with users assigned to that permission.

4. Add Summary Info

Below role selector show:

Assigned Users: 142 Users
Status: Active

5. Replace Table With New Table

Replace previous table with:

Table Name

Permission User Management

Subtitle:

Add or remove users from the selected permission group.

Table Columns

User | Organization | Role | Access Level | Status | Actions

Example rows:

Ahmed Hassan | Ministry of Housing | GIS Analyst | Edit | Active | Edit
Fatima Ali | Urban Planning | Reviewer | View | Active | Edit
Khalid Noor | Transport Authority | Analyst | View | Active | Edit

6. Table Functional Controls

Above table add controls:

Search bar:

Search users within permission group

Filter dropdown:

Organization

Filter dropdown:

Role

7. Add User Button

Top right of this section:

+ Add Users

Red button style (same as Add Boundary previously)

8. Add Users Popup

When clicking Add Users, open modal.

Modal title:

Add Users to Permission

Fields:

Organization dropdown

After selecting organization:

Show user list with checkboxes

Example:

☐ Ahmed Hassan
☐ Fatima Ali
☐ Khalid Noor
☐ Noor Salman

Buttons:

Cancel
Add Users

9. Edit User Access

When clicking Edit in table:

Popup opens.

Fields:

User name (read only)

Access Level dropdown:

View
Edit
Approve

Toggle:

Active / Disabled

Buttons:

Save
Cancel

10. Remove User From Role

Actions column also includes:

Remove icon

Confirmation popup:

Remove user from this permission group?

Cancel | Remove

11. Empty State (If No Role Selected)

If no permission group selected show:

Illustration + message

Message:

Select a permission group to manage spatial access permissions.

12. Maintain Existing Map

Do NOT change:

Map UI

Role selection panel beside map

Map controls

Dark map style

Only modify the section below the map.

13. Maintain UI Consistency

Keep same:

Card design

Red theme

Table row style

Rounded buttons

Icon style

Typography

Spacing

Shadow

Dashboard structure

Design must look like native part of BSDI Admin Dashboard.