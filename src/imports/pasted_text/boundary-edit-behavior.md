Update the Boundary Editing Mode behavior in the Access Roles → Spatial Boundaries Registry screen.

1. Map Editing Toolbar Position

When the Edit button is clicked and the map enters Boundary Editing Mode:

Show the drawing tools panel (Polygon, Circle, Undo, Delete, Close icons).

The toolbar must NOT overlap the existing map controls (zoom, layer, etc.).

Position the editing toolbar slightly below the existing map controls on the right side.

Maintain proper spacing (around 16–24px vertical gap) between the two tool groups.

Structure:

Top-right: existing map tools (zoom, layer, etc.)

Below them: Boundary Editing Toolbar

This prevents UI overlap and keeps the tools clearly separated.

2. Show Existing Boundary for Editing

When entering Edit Mode:

Automatically display the predefined spatial boundary polygon on the map.

The boundary should appear with:

Red outline

Semi-transparent red fill

Editable vertex points

Users must be able to:

Drag boundary vertex points to adjust shape

Extend or shrink the boundary

Remove sections of the polygon

Add new vertices

This allows editing the existing selected boundary, not drawing from scratch.

3. Highlight Selected Access Role

When editing:

Highlight the selected row (e.g., Electricity Authority) in the left table.

Change the Edit button to an Update button.

Button style:

Red primary button

Label: Update

Include check icon if needed.

4. Boundary Editing Banner

Keep the Boundary Editing Mode banner at the top of the map.

Content:

Title
Boundary Editing Mode

Description
Editing boundary for: Electricity Authority
Use the tools to modify the boundary

5. Update Action

When the user clicks Update:

Save the modified boundary.

Exit Boundary Editing Mode.

Restore the original UI:

Hide editing toolbar

Change Update button back to Edit

Remove vertex editing points

6. Map Interaction Rules

During edit mode:

Map must allow vertex editing

Map panning and zooming should remain active

Only the selected boundary should be editable