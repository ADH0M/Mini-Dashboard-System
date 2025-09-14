# 🚀 User Dashboard — Lightweight Admin Template  

A responsive **React + TypeScript** dashboard with reusable UI components, data fetching, form handling, and real-time notifications.  
Built with **TailwindCSS** and **React Router** — perfect as a foundation for larger admin platforms.  

> **API Used:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — A free fake REST API for testing.

---

## ✨ Features  

### ✅ Responsive Layout  
- Fixed sidebar (collapses on mobile)  
- Main content area with dynamic routing  

### ✅ Reusable UI Components  
- **Button** (Primary / Secondary)  
- **Modal** (Popup with header, body, footer)  
- **AdvancedTable** (Searchable, Paginated, with Skeleton Loading)  
- **Toast** (Notifications: Success, Error, Info)  

### ✅ Data Management  
- Fetch & display users from JSONPlaceholder API  
- Search and filter table data  
- Client-side pagination (configurable rows per page)  
- Skeleton loading states  

### ✅ Forms & Validation  
- Full user registration form (Personal, Address, Company)  
- Real-time validation with error messages  
- Form reset functionality  
- Submit with loading state & success toast  

### ✅ User Detail Page  
- View full user profile by ID (`/user/:id`)  
- Clean card-based layout with icons  
- Responsive design for all devices  

### ✅ Error Handling & UX  
- Global error boundaries  
- Toast notifications for API success/failure  
- Loading states for async operations  
- No infinite re-renders — fixed and tested  

---

## 🛠️ Tech Stack  
- **Framework:** React 18 + TypeScript  
- **Routing:** React Router DOM v6  
- **Styling:** Tailwind CSS (Utility-First)  
- **State Management:** React Hooks (useState, useEffect, useContext)  
- **Notifications:** Custom Toast System with Context  
- **Icons:** Heroicons (via SVG)  
- **API:** JSONPlaceholder (Fake REST API)  

---

## 📦 Getting Started  

### Prerequisites  
- Node.js (v16+)  
- npm or yarn  

### Installation  

```bash
# Clone the repository
git clone https://github.com/your-username/user-dashboard.git
cd user-dashboard

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Open 👉 [http://localhost:5173](http://localhost:5173) in your browser.  

---

## 🗂️ Project Structure  

```
src/
├── components/
│   ├── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── AdvancedTable.tsx
│       ├── ToastProvider.tsx
│       └── ...
├── pages/
│   ├── Dashboard.tsx
│   ├── DataTable.tsx   # Paginated, searchable user table
│   ├── FormPage.tsx    # User creation form with validation
│   └── UserPage.tsx    # User profile page (/user/:id)
├── App.tsx
└── main.tsx
```

---

## 🧩 Component Usage  

### 1. **Button**
```tsx
import Button from "../components/ui/Button";

<Button onClick={handleClick}>Primary</Button>
<Button variant="secondary" onClick={handleCancel}>Cancel</Button>
```

### 2. **AdvancedTable**
```tsx
import AdvancedTable from "../components/ui/AdvancedTable";

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  {
    key: "role",
    header: "Role",
    render: (user) => <span className="...">{user.role}</span>,
  },
];

<AdvancedTable
  data={users}
  columns={columns}
  loading={isLoading}
  searchable
  paginated
  rowsPerPage={10}
  onRowClick={(user) => navigate(`/user/${user.id}`)}
/>
```

### 3. **Toast Notifications**
Wrap your app with `ToastProvider` in **App.tsx**:
```tsx
import { ToastProvider } from "./components/ui/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <Router>...</Router>
    </ToastProvider>
  );
}
```

Use anywhere:
```tsx
import { useToast } from "../components/ui/ToastProvider";

const { addToast } = useToast();
addToast("User created!", "success");
addToast("Failed to load data", "error");
```
---

## 🧭 Routes  

| Path         | Page        | Description                          |
|--------------|------------|--------------------------------------|
| `/`          | Dashboard  | Welcome page                         |
| `/data-table`| DataTable  | User table with search & pagination  |
| `/form`      | FormPage   | User creation form                   |
| `/user/:id`  | UserPage   | Detailed user profile                |

---

## 🧪 Example API Data (User)  

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

---

## 📄 License  
This project is open-source and available under the **MIT License**.  