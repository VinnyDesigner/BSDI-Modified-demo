Update the **Roles Directory page**. When the user clicks the **Edit button** in the Actions column, open an **Edit Role popup modal** where the role details and assigned users can be managed.

### Popup Title

**Edit Role**

### Popup Layout

Create a centered modal with a clean layout and consistent **BSDI red theme styling** used in the existing interface.

Modal width: **560px**
Rounded corners, light shadow, proper spacing between sections.

---

### Section 1 — Role Information

Add editable fields:

**Role Name**

* Text input
* Pre-filled with the current role name

**Description**

* Text area
* Pre-filled with existing description

**Type**

* Dropdown
* Options:

  * System
  * Organization
  * Department
  * Custom

**Status**

* Dropdown
* Options:

  * Active
  * Inactive
* Default value should match the current role status

---

### Section 2 — Assigned Users

Below role information create **Assigned Users Management**.

#### Current Assigned Users

Display currently assigned users as removable chips.

Example layout:

Assigned Users
[ Ahmed Ali ✕ ]
[ Fatima Noor ✕ ]
[ Khalid Hasan ✕ ]

* Each chip contains **user name + remove icon**
* Clicking **✕ removes the user from the role**

---

#### Add More Users

Add a **searchable multi-select dropdown**.

Label: **Add Users**

Placeholder:
"Search and select users"

Dropdown behavior:

* Shows **All users from all departments**
* Each user has a **checkbox**
* Multiple users can be selected

Example list:

☐ Ahmed Ali — GIS Department
☐ Fatima Noor — Environment Department
☐ Khalid Hasan — IT Department
☐ Sara Mohamed — Planning Department

Selected users will automatically appear in the **Assigned Users chips list**.

---

### Buttons (Bottom Right)

Cancel — secondary button
Update Role — primary red button

---

### Interaction Behavior

Edit Button Click
→ Opens Edit Role popup

Remove User
→ Instantly removes the user chip

Add Users Dropdown
→ Allows selecting multiple users

Status Dropdown
→ Allows changing role between **Active / Inactive**

Update Role
→ Saves changes and closes modal

Show success toast message:

"Role updated successfully"

---

### UI Design Rules

* Follow existing **Roles Directory page style**
* Use **same red accent color**
* Maintain consistent **spacing, padding, and typography**
* Buttons should match existing **Edit / Add Role button style**
* Modal should have **light shadow and rounded edges**
