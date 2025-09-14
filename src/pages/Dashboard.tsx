import { useState } from "react";
import useAuth from "../Hooks/useAuth";
import { useToast } from "../Hooks/useToast";

interface FormState {
  username?: string;
  email?: string;
  password?: string;
  success?: boolean;
}

export default function RegisterForm() {
  const [state, setState] = useState<FormState>({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [auth, setAuth] = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const errors: FormState = {};
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!username) errors.username = "Username is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setState(errors);
      setLoading(false);
      addToast("the failds are required", "error");
      return;
    }

    // simulate API
    await new Promise((res) => setTimeout(res, 1000));

    // Optionally store rememberMe choice
    if (rememberMe) {
      localStorage.setItem(
        "rememberedUser",
        JSON.stringify({ username, email })
      );
    } else {
      sessionStorage.setItem(
        "rememberedUser",
        JSON.stringify({ username, email })
      );
    }
    addToast("Register Success", "success");
    setState({ success: true });
    setLoading(false);
    setAuth({ username, email });
  };

  const isAuth = Boolean(auth.email && auth.username);

  return (
    <>
      {isAuth ? (
        <main className="min-h-screen bg-gray-100 p-6">
          <nav className="bg-white shadow rounded-lg p-4 mb-6 flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              {auth.username?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div>
              <p className="text-gray-800 font-semibold">{auth.username}</p>
              <p className="text-gray-500 text-sm">{auth.email}</p>
            </div>
          </nav>

          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Welcome, {auth.username}!
            </h2>
            <p className="text-gray-600">
              You are successfully registered and logged in.
            </p>
            {/* Add more content here if needed */}
          </section>
        </main>
      ) : (
        <div className="max-h-screen h-full bg-gray-100 flex items-center justify-center px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Register
            </h2>

            {/* Username */}
            <div className="space-y-1">
              <input
                name="username"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {state.username && (
                <p className="text-sm text-red-600">{state.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <input
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {state.email && (
                <p className="text-sm text-red-600">{state.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {state.password && (
                <p className="text-sm text-red-600">{state.password}</p>
              )}
            </div>

            {/* ✅ Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="text-gray-700 text-sm select-none"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Register"}
            </button>

            {/* Success Message */}
            {state.success && (
              <p className="text-green-600 text-center font-medium">
                Form submitted successfully!
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
}
