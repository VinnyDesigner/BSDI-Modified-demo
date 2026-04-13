Layout Structure

Keep the layout 40% left panel (Access Roles table) and 60% map view.

Both sections must fill the full screen height and stay properly aligned.

Ensure responsive behavior for MacBook, Windows screens, and large monitors without extra side gaps.

Map should support Light / Dark toggle icon at the bottom-right.

Map Mode Toggle

Add a segmented toggle control at the top center of the map:

Spatial | Blocks

Spatial Mode (Default)

When Spatial is active:

Admin can draw map boundaries manually.

Enable drawing tools:

Polygon

Rectangle

Circle

Drawing tools appear as a floating vertical toolbar on the right side of the map, below zoom controls.

Flow:

Admin selects a role from the Access Roles table.

Click Edit.

Map enters Edit Mode.

Existing assigned boundary becomes visible.

Admin can:

Edit

Extend

Modify

Remove boundary

Replace Done button with "Update" button.

Buttons:

Update

Clear Selection

Blocks Mode

When Blocks is selected:

Disable drawing tools.

Enable a search bar at the top-left of the map.

Placeholder:
Search block / district / area...

Behavior:

Admin searches a block.

Matching locations appear as suggestions.

Selecting a result highlights the block boundary on the map.

Admin clicks Assign Block.

Buttons:

Assign Block

Clear Selection

Restore Layer Icon Panel

There is a Layers icon on the right-side map toolbar.

Fix the interaction so:

When clicking the Layers icon, a Layer Panel opens from the right side of the map.

Panel style:

Slide-in side panel

Width: ~280px

Semi-floating above the map

Layer panel should include toggles:

Map Layers

Roads

Buildings

Administrative Boundaries

Land Parcels

GIS Layers

Infrastructure

Utilities

Environmental Data

Custom Layers

Each layer should have:

Toggle switch

Visibility icon

Optional:
Add opacity slider for advanced layers.

Edit Mode Visual Feedback

When a role is in edit mode:

Highlight the selected row in the Access Roles table.

Show existing assigned boundary on the map.

Show Update button instead of Edit.

UI Alignment Improvements

Keep all map controls aligned vertically on the right.

Maintain proper spacing between:

Zoom

Layers

Drawing tools

Ensure the Spatial / Blocks toggle stays centered on top of the map.