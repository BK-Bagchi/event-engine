# shadcn/ui Components Reference

This document provides a comprehensive overview of all shadcn/ui components used in this project, including their use cases and typical applications.

## Component List

### Accordion

**Use Case:** Displaying collapsible content sections

- Use when you need to show/hide multiple sections of content
- Useful for FAQs, detailed settings, or expandable lists
- Saves vertical space by allowing users to expand only relevant sections

### Alert

**Use Case:** Displaying alert messages to users

- Inform users of important information, warnings, or success messages
- Can be used for validation feedback, notifications, or system messages
- Provides visual distinction based on alert type (info, warning, error, success)

### Alert Dialog

**Use Case:** Requesting user confirmation before performing an action

- Use for destructive actions (delete, clear data, etc.)
- Displays a modal dialog with a message and confirmation/cancel buttons
- Prevents accidental actions with explicit user permission

### Button

**Use Case:** Triggering actions and user interactions

- Call-to-action buttons for primary actions
- Can be styled with different variants (primary, secondary, outline, ghost)
- Essential component for forms, navigation, and interactive elements

### Card

**Use Case:** Organizing and displaying grouped content

- Contains header, content, and footer sections
- Useful for displaying related information in a structured container
- Common in dashboards, product listings, and content cards

### Carousel

**Use Case:** Displaying multiple images or content with swipe/motion

- Show multiple items in a rotating slideshow
- Swipe functionality for mobile users
- Perfect for image galleries, testimonials, or featured content rotations

### Chart

**Use Case:** Displaying charts and visualized data

- Use for line, bar, pie, or other chart visualizations
- Ideal for dashboards and analytics pages
- Integrates with data sources to present trends and metrics

### Checkbox

**Use Case:** Allowing users to toggle between checked and unchecked states

- Multiple selection in forms (vs single selection with radio buttons)
- Terms & conditions acceptance
- Filtering and preference selection

### Combobox

**Use Case:** Dropdown menu with search/filter functionality

- Searchable dropdown for selecting from a large list
- Better UX than plain dropdowns for many options
- Combines input field with dropdown suggestions

### Dialog

**Use Case:** Displaying modal popup content

- Forms in a modal window
- Confirmation dialogs with additional options
- Content that requires user focus and interaction

### Drawer

**Use Case:** Showing hidden content in a slide-out drawer

- Mobile-friendly navigation menus
- Side panels for secondary content
- Less intrusive than modals, allows background interaction in some cases

### Empty

**Use Case:** Placeholder for empty states

- 404 error pages with no content
- Empty search results
- Placeholder for arrays/lists with no data
- Provides user feedback when content is missing

### Field

**Use Case:** Collecting user text input in forms

- Text fields for names, emails, passwords
- Search input fields
- Essential for form building
- Can be combined with labels and validation messages

### Input

**Use Case:** Basic text input for forms and controls

- Single-line inputs for names, emails, search
- Works with `Label` and `Field` wrappers for accessibility
- Common building block for forms and inline editing

### Input Group

**Use Case:** Grouping related input fields together

- Combining multiple inputs (e.g., country code + phone number)
- Grouped form controls with shared styling
- Organizing related input elements visually

### Input OTP

**Use Case:** Animated input field for One-Time Password entry

- Multi-digit OTP input with auto-focus
- Two-factor authentication screens
- Verification code entry with visual appeal

### Label

**Use Case:** Text label for form inputs and controls

- Associating text with form fields for accessibility
- Improving form UX with clear labeling
- Required component in accessible forms

### Pagination

**Use Case:** Navigating through multiple pages/sections of content

- Displaying large datasets across multiple pages
- Content listings that need pagination
- Improves performance by loading data in chunks

### Progress

**Use Case:** Displaying progress of ongoing operations

- File upload/download progress
- Task completion percentage
- Loading indicators for long-running operations

### Select

**Use Case:** Allowing users to choose a single value from a list

- Form field for selecting options (country, category, etc.)
- Dropdown selection with keyboard navigation
- More accessible than native select elements

### Separator

**Use Case:** Visual divider to separate content sections

- Horizontal or vertical line between content areas
- Visual hierarchy and organization
- Spacing and visual separation without taking up much space

### Sheet

**Use Case:** Side sheet or drawer for secondary content

- Slide-out panel for secondary navigation or content
- Mobile-friendly alternative to modals
- Allows users to maintain context while viewing side content

### Sidebar

**Use Case:** Composable, customizable navigation/layout sidebar

- Main navigation menu
- Dashboard layouts with side navigation
- Collapsible menu for mobile responsiveness

### Skeleton

**Use Case:** Showing loading placeholders while content loads

- Content loading shimmer effect
- Improves perceived performance
- Displays skeleton of expected content layout

### Sonner

**Use Case:** Displaying toast notifications and temporary messages

- Success/error/info messages that auto-dismiss
- Non-intrusive notifications
- Toast notifications for user feedback

### Spinner

**Use Case:** Displaying loading indicator

- Loading state during data fetching
- Processing/waiting indicators
- Visual feedback for async operations

### Switch

**Use Case:** Toggle switch for binary choices in forms

- Enable/disable settings
- Boolean preference selection
- More intuitive than checkboxes for on/off states

### Tabs

**Use Case:** Displaying multiple sections within a single page

- Tabbed interfaces for organizing content
- Switching between different views/filters
- Reduces page scrolling and clutter

### Table

**Use Case:** Displaying data in a structured table layout

- Data listings and records
- Sortable/filterable data
- Organized presentation of tabular information

### Textarea

**Use Case:** Collecting multi-line text input in forms

- Comments, descriptions, or feedback
- Long-form text input
- Rich text input fields

### Tooltip

**Use Case:** Displaying helpful information on hover

- Additional context or hints for UI elements
- Keyboard shortcuts or tooltips for buttons
- Non-intrusive help information that appears on hover/focus

---

## Usage Notes

- These components can be imported from `@/components/ui/`
- They work seamlessly with Tailwind CSS for styling
- Components are built on top of Radix UI for accessibility
- Refer to shadcn/ui documentation for advanced usage and customization

## Future References

When building UI components with AI agents, refer to this document to:

1. Understand the primary use case for each component
2. Choose the right component for the task
3. Avoid misusing components for unintended purposes
4. Maintain consistency in component usage across the project
