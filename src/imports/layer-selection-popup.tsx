Update the existing popup UI by adding a Layer Selection Panel inside the popup. This panel allows users to toggle GIS data layers using checkboxes and expandable groups.

Layout

Add a vertical scrollable panel inside the popup.

Panel width: 280–320px

Background: #FFFFFF

Border radius: 8px

Padding: 12–16px

Row height: 36–40px

Divider line color: #E5E7EB

Use Auto Layout (Vertical).

Layer Row Structure

Each row should contain:

Checkbox (left)

Expand / Collapse icon (+ / −)

Layer name

Layer settings icon (grid icon) on right

Example structure:

[Checkbox] [+/-] Layer Name                          [Grid Icon]

Typography:

Font: Inter / Roboto

Size: 14px

Color: #374151

Layer Structure

Create the following hierarchy:

Addresses

ADDRESSES

Streetcenterlines

wip_ministrialroads

Mtt_network

Tse_network

District_cooling

Ewc_wdd

WaterDistributionDataset

SystemValve (disabled)

AirValve (disabled)

ServiceValve (disabled)

Fitting (disabled)

Hydrant (disabled)

WServicePoint (disabled)

Meter (disabled)

CasingProtection (enabled)

ServicePipe (disabled)

MainPipe (enabled)

Checkbox Styles
Active / Checked

Fill color: #DC2626 (Red 600)

Check icon: White

Hover

Border: #B91C1C

Unchecked

Border: #D1D5DB

Disabled

Background: #F3F4F6

Text: #9CA3AF

Icons

Expand/Collapse icon:

Size: 12px

Settings grid icon:

Size: 16px

Color: #6B7280

Component Structure

Create reusable components:

Layer Row

Layer Group

Checkbox

Expand Toggle

Layer Settings Icon

Use nested auto-layout for hierarchy indentation (16px per level).