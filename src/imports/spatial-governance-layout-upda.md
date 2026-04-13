Update the **Spatial Governance page layout** to improve alignment, spacing, and padding so that the table section below the map does not overlap the map area.

Maintain the existing **BSDI dashboard design system**, red theme, typography, icon style, card style, and component design.

1. Fix Map and Content Separation

The current issue is that the **table card overlaps the bottom of the map**.
Adjust the layout so that the map and the table are clearly separated.

Make the following changes:

Add **32px vertical spacing** between the bottom of the map container and the section below it.

Ensure the **map container has its own card structure** with:
Top padding: 16px
Bottom padding: 24px
Rounded corners consistent with the system UI.

Remove any **negative margin or floating overlap** effect currently applied to the table section.

2. Create Proper Section Structure

Divide the page into two clear sections:

Section 1
Map + Role Selector

Section 2
Permission Management Table

Both sections should be placed inside separate **cards**.

3. Map Section Layout

Structure the map area as:

Card container

Inside card:
Left side:
Role selector panel

Right side:
Map canvas

Add padding:

Top: 20px
Left: 20px
Right: 20px
Bottom: 24px

Ensure the **map canvas height remains fixed (approx 420–480px)** so that the layout remains stable.

4. Role Selector Panel

Left panel spacing:

Width: 240px
Padding: 20px

Spacing between role items: 12px

Bottom statistics section should have **16px top margin**.

5. Table Section Card

The table section should be a new **full-width card below the map card**.

Card padding:

Top: 20px
Left: 24px
Right: 24px
Bottom: 24px

Border radius: same as system cards.

Add **24px margin-top** between the map card and the table card.

6. Section Header Layout

Header layout:

Left side:
Section icon
Title
Subtitle

Right side:
Primary button (Add Boundary or Add Users depending on implementation)

Spacing rules:

Icon to title: 12px
Title to subtitle: 4px

Header bottom margin: 20px

7. Search and Filter Row

Search bar and filters should sit in a single row.

Layout:

Search field width: 420px

Spacing between elements: 16px

Vertical margin below filters: 20px

8. Table Alignment

Table columns should align consistently with dashboard tables.

Column padding:

Left padding: 20px
Right padding: 20px

Row height:

Minimum 64px

Spacing between rows:

16px vertical breathing space.

9. Action Buttons

Action buttons (View / Edit):

Button spacing: 8px

Button height: 36px

Border radius: consistent with system UI.

10. Responsive Stability

Ensure the table section does not shift upward or overlap the map when the page loads.

The layout must behave as:

Map card
↓
24px spacing
↓
Table card

No floating overlap or negative spacing.

11. Maintain UI Consistency

Do not change:

Sidebar navigation
Header bar
Map controls
Role selector design
Button style
Color theme

Only improve **layout structure, spacing, and padding** for better visual hierarchy.

The final layout should look clean, balanced, and aligned with a professional **enterprise GIS admin dashboard design**.
