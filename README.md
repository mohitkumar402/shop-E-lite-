# Shop E Lite

React + TypeScript + Vite based e-commerce dashboard with authentication, protected routes, product browsing, cart, profile, and a full admin page-builder/customizer.

## Quick Evaluator Login (No Registration Needed)
The app auto-seeds demo accounts on first run so invigilator can log in directly.

- Main User ID: `main@test.com`
- Main Password: `Main@123`
- Test User ID: `test@test.com`
- Test Password: `Test@123`
- Admin ID: `admin@test.com`
- Admin Password: `Admin@123`

Note: Admin panel access appears when logged in with an email containing `admin`.

## App Run Instructions
1. Install dependencies:
```bash
npm install
```
2. Start development server:
```bash
npm run dev
```
3. Open the local URL printed by Vite (usually `http://localhost:3000` or next available port).

## Full App View Guide (For Invigilator)
1. Login using `main@test.com` / `Main@123`.
2. Visit `Dashboard` for configurable storefront preview sections.
3. Visit `Products` for search, filter, sort, and infinite scroll behavior.
4. Visit `Cart` for quantity controls, totals, and checkout summary.
5. Visit `Profile` for edit profile and persistence checks.
6. Login as `admin@test.com` / `Admin@123` and open `Admin` tab.
7. In `Admin`, customize sections and click `Save`.
8. Return to `Dashboard` to confirm changes reflect in live page view.

## Core Features
- Authentication with localStorage persistence
- Protected routes for all internal pages
- Session timeout handling with countdown
- Product listing from Fake Store API
- Cart state management with totals
- Profile editing with persistent user data
- Responsive layout (mobile/tablet/desktop)

## Extra Functionality Implemented
- Admin 3-panel canvas layout (`Sidebar | Editor | Live Preview`)
- Page Builder with draggable section ordering
- Section enable/disable per page
- Add/remove sections from template library
- Theme customization:
  - colors
  - font family
  - button style
  - spacing
  - border radius
- Promo Cards section customizer:
  - section options (title, subtitle, layout, columns, style)
  - card CRUD (add/edit/remove)
  - card-level settings (icon, button, color, enable toggle)
- Newsletter section customizer:
  - title, subtitle, placeholder, button text
  - layout modes
  - solid/gradient background options
  - optional side image and success message
- Header/Footer/Announcement bar global controls
- Dashboard rendering synced with admin-managed page sections
- Infinite scroll on products page

## Tech Stack
- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Context API (Auth, Cart, Theme, Toast)

## Build
```bash
npm run build
```

