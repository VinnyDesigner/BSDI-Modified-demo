Update the Access Roles – Map Permission UI with two selection modes: Spatial and Blocks.

Layout

Keep the layout 40% left panel (Access Roles table) and 60% map view.

Maintain existing responsive layout and spacing.

The map container should remain full height and aligned with the left panel.

The Spatial / Blocks toggle should appear at the top center of the map as a segmented control.

Mode 1: Spatial (Default)

When Spatial is selected:

Admin can draw directly on the map.

Enable map drawing tools:

Polygon

Rectangle

Circle

Show drawing controls as small floating toolbar on the right side of the map under the map controls.

After drawing:

Highlight the selected boundary.

Show “Update Boundary” and “Clear Selection” buttons.

The drawn boundary will be assigned to the selected role in the left table.

Interaction flow:

Admin selects a role from the Access Roles table.

Click Edit.

Map switches to editing mode.

Admin draws a boundary on the map.

Click Update Boundary to save.

Mode 2: Blocks

When Blocks is selected:

Disable drawing tools.

Enable a search bar at the top-left of the map.

Placeholder text:
“Search block / district / area…”

Search behavior:

Admin searches for a location or administrative block.

Matching areas appear as suggestions.

When selected:

The block boundary is highlighted on the map.

The boundary is assigned to the selected role.

Show buttons:

Assign Block

Clear Selection

UI Design Improvements

Use segmented toggle style for:

Spatial

Blocks

Active tab should be highlighted with the primary color.

Keep map tools vertically aligned on the right side.

Ensure spacing between:

Map controls

Drawing tools

Toggle switch

Edit Mode UI

When editing a role:

Highlight the selected row in the Access Roles table.

Show map selection preview.

Replace Edit button with:

Update

Cancel

Responsive Behavior

Works well for:

MacBook screens

32-inch monitors

Windows displays

Map and table should always fill available width without side gaps.