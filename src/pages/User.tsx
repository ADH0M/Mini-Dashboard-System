// src/pages/UserPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { useToast } from "../Hooks/useToast";

type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
};

type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

export default function UserPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id: userId } = useParams<{ id: string }>();

  

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    const getUserById = async () => {
      try {

        setLoading(true);
        setError(null); 

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`, // ✅ مسافة زائدة حُذفت
          { method: "GET", cache: "no-cache" }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const userData: User = await response.json();
        setUser(userData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load user data");
        addToast("Failed to load user data", "error");
      } finally {
        setLoading(false); 
      }
    };

    getUserById();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col ">
        <div className="p-5 border-indigo-50 border-r-indigo-500 w-10 h-10 border rounded-full mb-5 animate-spin" />
        <div className="text-xl text-gray-500">Loading user data...</div>
      </div>
    );
  }

  if (error) {
   
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="text-2xl text-red-500 mb-4">❌ {error}</div>
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          className="px-6 py-3"
        >
          Go to Home
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">No user data</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          👋 Welcome, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's the information you registered with us.
        </p>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <Button
          variant="secondary"
          onClick={() => navigate("/data-table")}
          className="px-6 py-3 bg-indigo-400 text-indigo-50 cursor-pointer"
        >
          ← Back to Form
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-5">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3 text-gray-800">
              Personal Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Full Name:</span>
              <span className="text-gray-800">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Username:</span>
              <span className="text-gray-800">@{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Email:</span>
              <span className="text-blue-600">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Phone:</span>
              <span className="text-gray-800">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Website:</span>
              <a
                href={
                  user.website.startsWith("http")
                    ? user.website
                    : `https://${user.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {user.website}
              </a>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-5">
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3 text-gray-800">
              Address
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <span className="block font-medium text-gray-600">Street</span>
              <span className="text-gray-800">{user.address.street}</span>
            </div>
            {user.address.suite && (
              <div>
                <span className="block font-medium text-gray-600">Suite</span>
                <span className="text-gray-800">{user.address.suite}</span>
              </div>
            )}
            <div>
              <span className="block font-medium text-gray-600">City</span>
              <span className="text-gray-800">{user.address.city}</span>
            </div>
            <div>
              <span className="block font-medium text-gray-600">Zip Code</span>
              <span className="text-gray-800">{user.address.zipcode}</span>
            </div>
            <div className="pt-3 border-t">
              <span className="block font-medium text-gray-600 mb-2">
                Coordinates
              </span>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Latitude:</span>
                  <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                    {user.address.geo.lat}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Longitude:</span>
                  <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                    {user.address.geo.lng}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Card (Full Width) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-5">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3 text-gray-800">
              Company Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="block font-medium text-gray-600 mb-1">
                Company Name
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {user.company.name}
              </span>
            </div>
            <div>
              <span className="block font-medium text-gray-600 mb-1">
                Catch Phrase
              </span>
              <span className="italic text-gray-700">
                "{user.company.catchPhrase}"
              </span>
            </div>
            <div>
              <span className="block font-medium text-gray-600 mb-1">
                Business Strategy
              </span>
              <span className="text-gray-800">{user.company.bs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
