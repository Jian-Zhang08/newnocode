# Smartz Mobile App

A modern, mobile-responsive React application built with Vite, featuring user authentication, dashboard, and user management capabilities.

## Features

- 🔐 **Authentication System**
  - Login and Signup pages with form validation
  - Protected routes and session management
  - Local storage for user persistence

- 📊 **Dashboard**
  - Overview statistics and metrics
  - Recent activity feed
  - Quick action buttons
  - Responsive grid layout

- 👥 **User Management**
  - Complete CRUD operations (Create, Read, Update, Delete)
  - User search and filtering
  - Role-based user management (Admin, Moderator, User)
  - Status toggle functionality
  - Modal-based forms

- 📱 **Mobile Responsive Design**
  - Optimized for mobile devices
  - Touch-friendly interface
  - Responsive navigation
  - Adaptive layouts

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Pure CSS with mobile-first approach
- **State Management**: React Context API
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with navigation
│   └── layout.css      # Layout styles
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Signup page
│   ├── Dashboard.jsx   # Dashboard page
│   ├── UserManagement.jsx # User management page
│   ├── auth.css        # Authentication page styles
│   ├── dashboard.css   # Dashboard styles
│   └── user-management.css # User management styles
├── App.jsx             # Main app component with routing
├── App.css             # Global app styles
├── index.css           # Global styles and CSS variables
└── main.jsx            # App entry point
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smartzTemplate
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase (Optional):
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API in your Supabase dashboard
   - Copy your Project URL and anon public key
   - Update the `public/app-config.json` file:
   ```json
   {
     "supabase": {
       "url": "https://your-project-id.supabase.co",
       "anonKey": "your-anon-key-here",
       "enabled": true
     }
   }
   ```
   - Alternatively, you can still use environment variables as fallback:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication

1. **Sign Up**: Create a new account with name, email, and password
2. **Login**: Sign in with your email and password
3. **Session**: Your login state is persisted in local storage

### Dashboard

- View application statistics and metrics
- Monitor recent user activities
- Access quick action buttons for common tasks

### User Management

- **Add Users**: Click "Add User" to create new user accounts
- **Edit Users**: Click "Edit" on any user row to modify user details
- **Delete Users**: Click "Delete" to remove users (with confirmation)
- **Toggle Status**: Click on user status to activate/deactivate accounts
- **Search**: Use the search bar to filter users by name or email

## Design Principles

- **Mobile-First**: Designed with mobile devices as the primary target
- **Component-Based**: Modular, reusable components following React best practices
- **Clean Code**: Well-structured, documented, and maintainable code
- **Responsive Design**: Adapts seamlessly across all device sizes
- **User Experience**: Intuitive navigation and interaction patterns

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Maintain consistent naming conventions
- Write clean, readable CSS with BEM-like methodology

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.