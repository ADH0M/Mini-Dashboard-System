import AdvancedTable from "../components/ui/AdvancedTable";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
};

export default function DataTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getUsers = async () => {
    try {
      const req = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "GET",
        cache: "no-cache",
      });
      const data = await req.json();

      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "role",
      header: "Role",
      render: (user: User) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === "Admin"
              ? "bg-red-100 text-red-800"
              : user.role === "Editor"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {user.role ? user.role : "Customer"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-10 text-shadow-2xs text-blue-600">Data Table</h2>
      <AdvancedTable
        data={users}
        columns={columns}
        loading={loading}
        searchable={true}
        paginated={true}
        rowsPerPage={5}
        onRowClick={(user) => navigate(`/user/${user.id}`)}
        emptyMessage="No users found."
      />
    </div>
  );
}
