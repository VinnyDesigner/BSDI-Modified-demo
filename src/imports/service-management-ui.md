. Add Primary Action Button

Place a primary button on the top-right of the page header (next to the search bar area).

Button:

Label: + Create New Service

Style: Primary button matching existing design system

Icon: Plus icon

2. Create "Create New Service" Flow (Modal / Side Panel)

When clicking Create New Service, open a right-side slide panel (preferred) or modal.

Panel Title:
Create New Service

Fields to include:

Organization Information

Organization (Dropdown)

Example: Ministry of Housing, Transport Authority, Urban Planning Dept

Department (Dropdown)

Service Details

Service Name (Input)

Service Type (Dropdown)

WMS Service

REST API

Feature Layer

Webhook

External API

Service Description (Textarea)

Technical Details

API Endpoint URL (Input)

Version (Input)

Authentication Type (Dropdown)

API Key

OAuth

Token

None

Access Control

Visibility (Dropdown)

Internal

Public

Restricted

Organization Access (Multi-select)

Status

Active

Inactive

Maintenance

Buttons:

Cancel

Create Service (Primary)

3. Modify Existing Service

In each service card, update the Manage Service button behavior.

When clicked → open Service Detail Panel

Panel sections:

Service Overview

Service Name

Service Type

Organization

Department

Status

Usage Statistics

Monthly Usage

Last Updated

API Health

Editable Fields

Service Name

Endpoint

Access Control

Status

Buttons:

Save Changes

Disable Service

Delete Service (Danger)

4. Add Organization Visibility on Service Cards

Update each service card to show which organization owns the service.

Add a small line under service type:

Example:

Population Distribution WMS
WMS Service
Organization: Ministry of Housing

or show a badge/tag:
Ministry of Housing

5. Small UI Improvements

Add filter dropdown above service cards

Filters:

Organization

Service Type

Status

6. Maintain Existing Design

Important rules:

Keep same color system

Keep same card style

Keep same typography

Do not change sidebar or layout

Only extend functionality

Design must feel like a natural extension of the current dashboard UI.