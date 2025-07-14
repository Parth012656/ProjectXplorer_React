# ProjectXplorer React Application

A modern, responsive React.js application for discovering and exploring programming projects across multiple domains.

## 🚀 Features

- **Landing Page**: Beautiful hero section with domain cards and call-to-action buttons
- **Authentication**: Login/Register functionality with social login placeholders
- **Home Page**: Center-aligned action buttons and domain exploration cards
- **Filter Page**: Advanced filtering by domain, rating, and difficulty level
- **Favorites Page**: Save and manage your favorite projects
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth transitions and hover effects with Framer Motion
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for iconography
- **Axios** for API calls (placeholder implementation)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation component
│   ├── ProjectCard.tsx # Project display card
│   ├── FilterComponent.tsx # Filter controls
│   ├── AuthComponent.tsx # Login/Register forms
│   └── LandingCard.tsx # Domain cards for landing
├── pages/              # Page components
│   ├── LandingPage.tsx # Landing page
│   ├── LoginPage.tsx   # Authentication page
│   ├── HomePage.tsx    # Main home page
│   ├── FilterPage.tsx  # Project filtering page
│   └── FavoritesPage.tsx # Favorites management
├── services/           # API services
│   └── api.ts         # API calls and mock data
├── types/              # TypeScript interfaces
│   └── index.ts       # Type definitions
└── utils/              # Utility functions
```

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with gradient backgrounds
- **Hover Effects**: Interactive elements with smooth transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Loading States**: Skeleton loaders and loading spinners
- **Empty States**: Helpful messages when no data is available
- **Color-coded Difficulty**: Visual indicators for project complexity

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd projectxplorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## 📱 Pages Overview

### Landing Page (`/landing`)
- Hero section with app introduction
- Feature highlights
- Domain exploration cards
- Call-to-action sections

### Home Page (`/`)
- Welcome message
- Action buttons (Login, Favorites, Filter)
- Domain cards for quick navigation
- Statistics section

### Login Page (`/login`)
- Authentication modal
- Social login options (Google/GitHub)
- Email/password login
- Registration form

### Filter Page (`/filter`)
- Advanced search functionality
- Filter by domain, rating, and difficulty
- Project cards display
- Real-time filtering

### Favorites Page (`/favorites`)
- Saved projects display
- Favorite management
- Empty state handling
- Quick actions

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration:
- Custom color palette
- Custom animations
- Responsive breakpoints
- Component classes

### API Integration
Currently uses mock data with placeholder API calls:
- All API URLs are empty strings
- Mock data provided for development
- Ready for backend integration

## 🎯 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication with JWT
- [ ] Project detail pages
- [ ] User profiles
- [ ] Project submission
- [ ] Comments and ratings
- [ ] Search functionality
- [ ] Dark mode
- [ ] PWA features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: This is a frontend-only implementation with mock data. Backend integration will be added in future updates.
