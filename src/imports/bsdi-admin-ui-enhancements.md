# BSDI Super Admin Dashboard – UI Enhancement Prompt

Enhance the existing **BSDI Super Admin portal UI** while keeping the current visual identity, layout style, dark left sidebar, top search bar, card-based dashboard, and modern government enterprise look and feel.

## 1) Notifications Enhancement

Improve the **notification bell interaction** in the top-right header.

### Requirements
- On **mouse hover** over the notification bell, show a **notification dropdown / popover**.
- The dropdown should display a list of recent requests/notifications in a clean enterprise style.
- Each notification item should include:
  - Request title
  - Short description / summary
  - Organization name
  - Timestamp
  - Status badge if applicable
- Each notification row should have clear hover state.
- On **clicking a notification**, redirect the user to the **specific request details / approval page** where the **Super Admin can approve or reject the request**.
- Include a **“View All Notifications”** option at the bottom of the popover.
- Add unread state styling, such as:
  - subtle highlight background
  - unread dot indicator
  - bold title for unread notifications

### Design Style
- Rounded modern dropdown
- Soft shadow
- Clean spacing
- Consistent with existing dashboard theme
- Premium government admin portal feel
- Use red accent only where needed for attention/status

---

## 2) Organizations Page Enhancement

Redesign the **Organizations page** so that the **Organizations Directory** is presented as a proper **data table** instead of a simple list/card layout.

### Requirements
Convert the Organizations Directory into a structured **data table** with:

#### Table Header Columns
- Organization Name
- Organization Code / ID
- Sector / Category
- Number of Departments
- Number of Users
- Status
- Created Date
- Actions

### Table Features
- Add a **search bar** above the table
- Add **filter controls** above the table
- Suggested filters:
  - Status
  - Sector / Category
  - Date
- Add sorting capability on important columns
- Add pagination at the bottom
- Add row hover effect
- Keep the design clean, readable, and enterprise-grade

### Interaction for Departments
- In the **Departments** column, show values like:
  - `8 Departments`
- On **hover or click**, show the list of department names in either:
  - a **popover**, or
  - a **modal popup**
- The popup should have:
  - title
  - department list
  - optional search if list is long
  - clean close interaction

### Interaction for Users
- In the **Users** column, show values like:
  - `142 Users`
- On **hover or click**, show the list of user names in either:
  - a **popover**, or
  - a **modal popup**
- Each user item may include:
  - User name
  - Role
  - Email (optional)
  - Status badge (optional)

### Design Notes
- Maintain consistency with the current dashboard style
- Use clear typography and spacing
- Make the table professional, minimal, and easy to scan
- Ensure desktop-first admin experience
- Keep UI polished, modern, and suitable for a national data governance platform

---

## 3) UX Expectations

- Keep all interactions intuitive and lightweight
- Use hover, focus, active, and selected states properly
- Ensure popovers and modals feel modern and accessible
- Preserve the existing branding and hierarchy
- The updated UI should look like a real **production-ready Super Admin dashboard**

---

## 4) Output Needed

Create:
- Updated **Notifications interaction design**
- Updated **Organizations page data table design**
- Popover / modal design for:
  - Departments list
  - Users list
- Clean, consistent, responsive admin UI mockup aligned with the current BSDI style