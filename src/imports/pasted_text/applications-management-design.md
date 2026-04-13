Design a new Applications Management module for the BSDI Super Admin dashboard.

The design must match the existing BSDI UI style used in the Permissions Management page, including layout, typography, table structure, card style, and spacing.

Use BSDI brand colors only:

Primary Action Color: BSDI Red
Sidebar: Existing dark blue gradient
Active Status: Soft green badge
Inactive Status: Soft red badge
Buttons: same style as existing dashboard buttons.

Sidebar

Add a new menu item in the left navigation.

Icon: Applications grid icon
Label: Applications

Position:

Roles
Permissions
Applications
Audit Logs

Active menu state should use the same red highlight used for Permissions.

Applications Page
Page Header

Title
Applications Management

Subtitle
Manage, edit and assign users to applications.

Right side button

+ Add Application

Button style same as other primary action buttons.

Applications Table

Create a card container similar to the Permissions Directory card.

Card title:
Applications Directory

Subtitle:
Manage and track system applications.

Table Columns

Application Name
Arabic Name
Description
Arabic Description
Status
Actions

Table Example Rows

Add around 10–15 applications.

Examples:

Map Viewer
الخريطة التفاعلية
Spatial data visualization portal
عرض البيانات المكانية
Active

SmartECO
سمارت إيكو
Environmental monitoring system
نظام مراقبة البيئة
Active

eCubeApps
eCubeApps
Form builder platform
منصة إنشاء النماذج
Inactive

Renewable Energy
الطاقة المتجددة
Renewable energy dashboard
لوحة الطاقة المتجددة
Active

Admin Module
وحدة الإدارة
Administrative control system
نظام التحكم الإداري
Active

IST GenAI
IST GenAI
AI powered geospatial assistant
مساعد جغرافي ذكي
Active

Status Style

Active
Green rounded badge

Inactive
Soft red rounded badge

Actions Column

Icons:

Edit (pencil icon)
Delete (trash icon)

Hover color should use BSDI red accent.

Create Application Popup

When clicking Add Application, open a centered modal.

Modal title
Create Application

Form layout should follow two column grid layout like the reference UI.

Fields:

Application Name (EN)
Application Name (AR)

Application Description (EN)
Application Description (AR)

Application URL

Is Secured
Dropdown
Options: Yes / No

Link Image Upload

Add upload component.

Drag & Drop upload area

Text:

Drag & Drop your files here
or
Browse Files

Hint text:

Image size should not exceed 2MB.
Recommended dimensions: 200px × 180px

Modal Footer Buttons

Cancel (secondary outline button)

Create Application (primary button)

Assign Users Flow

Users can be assigned to an application.

When clicking Edit Application, open a right side drawer panel.

Panel title:

Edit Application

Application Details

Show editable fields:

Application Name (EN)

Application Name (AR)

Application Description (EN)

Application Description (AR)

Application URL

Is Secured dropdown

Application Logo upload

Assigned Users Section

Below form add section:

Assigned Users

Display list of users:

Avatar
User Name
Email
Remove icon

Example:

Ahmed Ali
ahmed@bsdi.gov

Sara Hassan
sara@bsdi.gov

Mohammed Khalid
mohammed@bsdi.gov

Add Users

Button:

+ Add Users

Opens user selector modal.

User Selector Modal

Search bar

List users from All Users directory

Checkbox selection.

Columns:

User Name
Email
Organization

Buttons:

Cancel
Add Selected Users

User Assignment Logic

Users can:

• Be added to multiple applications
• Be removed from an application
• Be assigned from the full user list.

UI Styling

Follow BSDI UI guidelines:

• Rounded card containers
• Soft shadows
• Light grey backgrounds
• Table row hover highlight
• Consistent padding
• Same typography used in Permissions page
• Responsive layout for large monitors.