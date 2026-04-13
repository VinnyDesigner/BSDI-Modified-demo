Update the Spatial Governance page interaction between the Access Roles table and the Map.

Layout

Keep the layout 40% left panel (Access Roles) and 60% map on the right.

Both sections should fit full height of the screen and be responsive.

Ensure proper spacing, padding, and alignment so the table does not overlap the map.

Access Roles → Map Interaction

Each row in the Access Roles table should be connected with specific spatial boundaries on the map.

Default State

Map displays all boundaries lightly.

No row selected.

When User Clicks Edit Icon

The clicked row becomes highlighted (selected state).

Background: light primary color.

Left accent border.

Edit icon changes to Done button.

The map should:

Zoom to the selected boundary

Highlight the selected boundary with:

Bold outline

Filled color with transparency

Dim or fade other boundaries.

Boundary Editing Mode

When a role is in Edit Mode:

Enable map editing tools:

Draw boundary

Extend boundary

Modify vertices

Delete part of boundary

Show editing controls on the map toolbar:

Draw polygon

Edit vertices

Undo

Reset

The selected boundary should display editable nodes/handles.

Done Button

Replace Edit button with Done button for the selected row.

When user clicks Done:

Save updated boundary.

Exit editing mode.

Show success popup/toast notification.

Popup message:

Title:
Boundary Updated

Message:
Spatial boundary for this role has been successfully updated.

Button:
OK

Map Visual States

Normal Mode

All boundaries visible.

Edit Mode

Selected boundary highlighted.

Edit handles visible.

Map editing toolbar visible.

Additional UI Improvements

Smooth transition when selecting a role.

Subtle animation when map zooms to the boundary.

Highlight selected row clearly.

Disable editing for other rows while one role is in edit mode.