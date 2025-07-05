# Happenly (EventPlanner)

A modern, fullstack event management platform designed to make planning, organizing, and sharing events effortless for individuals, teams, and organizations.

---

## 📖 Project Description

**Happenly** (formerly EventPlanner) is a modern, fullstack event management platform designed to make planning, organizing, and sharing events effortless for individuals, teams, and organizations.

With a beautiful, responsive interface and powerful features, Happenly empowers users to:
- Create and customize events with rich details, images, and themes
- Manage guest lists, RSVPs, co-hosts, and event privacy
- Search, filter, and sort events in multiple views (grid, list, calendar)
- Export event data, perform bulk actions, and share events easily
- Register and log in securely with role-based access (user/admin)
- Enjoy a seamless experience on any device—mobile, tablet, or desktop

Built as a **Minimum Complete Product (MCP)**, Happenly is ready for real-world use and is designed for future enhancements such as analytics, notifications, admin dashboards, and more.

Whether you’re planning a small meetup, a large conference, or anything in between, Happenly gives you all the tools you need to make your events a success.

---

## 🚀 Features

- **User Authentication:** Register, login, logout, JWT-based sessions, roles (user/admin)
- **Event Management:** Create, edit, delete, duplicate, and view events
- **Event Details:** Rich event forms, image/banner upload, RSVP, co-hosts, privacy, color/theme, recurring events, and more
- **Event List:** Search, filter, sort, grid/list/calendar view, quick/bulk actions, export (CSV/JSON/TXT), favorites, tagging
- **Responsive UI:** Beautiful, modern design with Tailwind CSS, fully responsive for mobile, tablet, and desktop
- **Reviews & Feedback:** Users can add and delete reviews on the landing page
- **Dashboard Preview:** Modern SaaS-style landing page with live dashboard preview
- **Admin/Personalization:** Role-based access, event ownership, and future admin dashboard

---
## 📸 Screenshots

### 🌐 Landing Page (Light & Dark Mode)

<p align="center">
  <img src="## 📸 Screenshots

### 🌐 Landing Page (Light & Dark Mode)

<p align="center">
  <img src="https://github.com/pranjali7117/Happenly/blob/main/screenshot/Screenshot1.png" width="45%" alt="Landing Page Light Theme"/>
  &nbsp;
  <img src="https://github.com/pranjali7117/Happenly/blob/main/screenshot/Screenshot2.png" width="45%" alt="Landing Page Dark Theme"/>
</p>

### 🗓️ Events Page & Dashboard

<p align="center">
  <img src="https://github.com/pranjali7117/Happenly/blob/main/screenshot/Screenshot3.png" width="45%" alt="Events Page"/>
  &nbsp;
  <img src="https://github.com/pranjali7117/Happenly/blob/main/screenshot/Screenshot4.png" width="45%" alt="Dashboard"/>
</p>

---
## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, shadcn/ui, Vite
- **Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, JWT, bcrypt
- **State Management:** React Context API
- **Persistence:** MongoDB Atlas (cloud), localStorage (for demo)
- **Deployment Ready:** Easily deployable to Vercel, Netlify, Render, or any Node/React host

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/happenly.git
cd happenly/Eventsapp
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend/Eventsapp/backend
npm install
```

### 3. Environment Variables

- Copy `.env.example` to `.env` in both frontend and backend (if present).
- Set your MongoDB URI and JWT secret in `backend/Eventsapp/backend/.env`:

```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Run the App

**Backend:**
```bash
cd backend/Eventsapp/backend
node server.js
```

**Frontend:**
```bash
cd Eventsapp
npm run dev
```

- Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Responsiveness

- Fully responsive: works beautifully on mobile, tablet, and desktop.
- All main pages and forms are optimized for every screen size.

---

## 🏆 MCP (Minimum Complete Product)

This project is an **MCP (Minimum Complete Product)**—it is fully functional and ready for real-world use, but is also designed for future enhancements and scalability.

---

## 🔮 Future Enhancements

- Admin dashboard for user/event management
- Event analytics and reporting
- Email notifications and reminders
- Social sharing and calendar integration
- Payment and ticketing integration
- More advanced event customization and permissions

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---


## MADE WITH ❤️ and 🧠 Pranjali 

[MIT](LICENSE)

---


