Update the Map UI inside the Spatial Governance page to improve role-based spatial management and data filtering.

1️⃣ Tabs Update

At the top of the map container, keep two tabs:

Spatial

Data (Rename the existing Blocks tab to Data)

Design rules:

Keep the same pill-style tab design

Active tab → BSDI brand red background with white text

Inactive tab → light grey background with dark text

Maintain current spacing and alignment.

2️⃣ Spatial Tab (Boundary Assignment Mode)

When Spatial tab is active, enable spatial boundary editing for roles.

Role Interaction (Left Panel)

Each Access Role row should contain:

Role Name

Permission Type

Created By

Updated Date

Edit icon

When admin clicks Edit icon:

The selected role row becomes highlighted.

The system enters Edit Mode.

The map zooms to the existing boundary (if available).

Show role label on map:

Example:

Editing: Electricity Authority

Only one role can be edited at a time.

Map Editing Tools

When Edit Mode is active, enable drawing tools on the map:

Tools:

Polygon draw

Rectangle draw

Circle draw

Extend boundary

Delete selection

Clear selection

Rules:

If a new shape overlaps existing boundary → merge the shapes

Selected area should show:

BSDI red outline

semi-transparent fill

Update Button

When in Edit Mode, show Update button at the top-right corner of the map.

Button style:

BSDI red background

Rounded corners

Save / Check icon

Workflow:

Admin clicks Edit on a role.

Admin draws or modifies spatial boundaries.

Admin clicks Update.

Selected boundary becomes assigned to that role.

Show success message:

Spatial boundary successfully assigned to the selected role

Exit edit mode after saving.

3️⃣ Data Tab (Previously Blocks)

When Data tab is active, show a map filtering panel for querying spatial data.

Remove drawing tools and show filter search bar.

Filter Panel Layout

Add a floating filter bar at the top of the map.

Design:

Rounded container

White background

Soft shadow

Horizontal layout

Padding: 16px

Height: ~56px

Filter Fields

From left to right:

Layer Dropdown

Label: Layer
Placeholder: Select Layer

Example layers:

Governorate

District

Block

Parcel

Infrastructure

Field Dropdown

Label: Field
Placeholder: Select Field

Examples:

Name

Code

Category

ID

Type

Operator Dropdown

Label: Operator

Default value:

=

Options:

=

Contains

Starts With

Ends With

Value Input

Label: Value

Placeholder:

Enter value
Search Button

Blue button with:

Search icon

Text: Search

Rounded corners

Search Interaction

When admin clicks Search:

Map zooms to the matching location.

Matching feature gets highlighted boundary.

Show semi-transparent fill for selected feature.

Optional enhancements:

Add Clear Filter button

Smooth zoom animation

Highlight selected block or area.

4️⃣ Final Map Layout

Map should contain:

Top:

Spatial | Data

If Spatial tab active
→ Drawing tools + Update button

If Data tab active
→ Filter search panel

5️⃣ UX Improvements

Add these interactions:

Clicking role zooms to assigned boundary

Hover role preview boundary on map

Show "No boundary assigned" for empty roles

Prevent drawing outside allowed area