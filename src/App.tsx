// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DataTable from "./pages/DataTable";
import FormPage from "./pages/FormPage";
import { ToastProvider } from "./components/ui/ToastProvider";
import UserPage from "./pages/User";
import ContextProvider from "./context/ContextProvider";

function App() {
  return (
    <ToastProvider>
      <Router basename="Mini-Dashboard-System">
        <div className="flex  h-screen bg-gray-100">
          <ContextProvider>
            <Sidebar />
            <div className="flex-1 mt-10 md:mt-2 p-4 ms:ml-5 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<DataTable />} />
                <Route path="/create-user" element={<FormPage />} />
                <Route path="/user/:id" element={<UserPage />} />
              </Routes>
            </div>
          </ContextProvider>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
