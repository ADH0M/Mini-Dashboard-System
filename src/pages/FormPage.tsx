import { useState } from "react";
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

type FormData = {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    suite?: string;
    zipcode?: string;
    geo?: {
      lat?: string;
      lng?: string;
    };
  };
  company?: {
    name?: string;
    catchPhrase?: string;
    bs?: string;
  };
};

export default function FormPage() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // التحقق من الصحة
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // التحقق من الحقول الأساسية
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    } else if (!/^https?:\/\//i.test(formData.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    // التحقق من العنوان
    if (!formData.address.street.trim()) {
      newErrors.address = {
        ...newErrors.address,
        street: "Street is required",
      };
    }
    if (!formData.address.city.trim()) {
      newErrors.address = { ...newErrors.address, city: "City is required" };
    }
    if (!formData.address.zipcode.trim()) {
      newErrors.address = {
        ...newErrors.address,
        zipcode: "Zipcode is required",
      };
    }
    if (!formData.address.geo.lat.trim()) {
      newErrors.address = {
        ...newErrors.address,
        geo: { ...newErrors.address?.geo, lat: "Latitude is required" },
      };
    } else if (isNaN(Number(formData.address.geo.lat))) {
      newErrors.address = {
        ...newErrors.address,
        geo: { ...newErrors.address?.geo, lat: "Latitude must be a number" },
      };
    }
    if (!formData.address.geo.lng.trim()) {
      newErrors.address = {
        ...newErrors.address,
        geo: { ...newErrors.address?.geo, lng: "Longitude is required" },
      };
    } else if (isNaN(Number(formData.address.geo.lng))) {
      newErrors.address = {
        ...newErrors.address,
        geo: { ...newErrors.address?.geo, lng: "Longitude must be a number" },
      };
    }

    // التحقق من الشركة
    if (!formData.company.name.trim()) {
      newErrors.company = {
        ...newErrors.company,
        name: "Company name is required",
      };
    }
    if (!formData.company.catchPhrase.trim()) {
      newErrors.company = {
        ...newErrors.company,
        catchPhrase: "Catch phrase is required",
      };
    }
    if (!formData.company.bs.trim()) {
      newErrors.company = { ...newErrors.company, bs: "BS is required" };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !hasNestedErrors(newErrors);
  };

  // دالة مساعدة للتحقق من الأخطاء المتداخلة
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasNestedErrors = (obj: any): boolean => {
    return Object.values(obj).some((val) =>
      val && typeof val === "object" ? hasNestedErrors(val) : val
    );
  };

  // معالجة التغييرات في الحقول العادية
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // مسح الخطأ عند الكتابة
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // معالجة التغييرات في حقول العنوان
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));

    // مسح الخطأ عند الكتابة
    if (errors.address?.[name as keyof Address]) {
      setErrors((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: undefined,
        },
      }));
    }
  };

  // معالجة التغييرات في حقول geo
  const handleGeoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        geo: {
          ...prev.address.geo,
          [name]: value,
        },
      },
    }));

    // مسح الخطأ عند الكتابة
    if (errors.address?.geo?.[name as "lat" | "lng"]) {
      setErrors((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          geo: {
            ...prev.address?.geo,
            [name]: undefined,
          },
        },
      }));
    }
  };

  // معالجة التغييرات في حقول الشركة
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [name]: value,
      },
    }));

    // مسح الخطأ عند الكتابة
    if (errors.company?.[name as keyof Company]) {
      setErrors((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          [name]: undefined,
        },
      }));
    }
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const req = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!req.ok) throw new Error("Failed to submit");

      const data = await req.json();
      console.log("Created user:", data);

      addToast("User created successfully!", "success");

      // إعادة تعيين النموذج
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: {
            lat: "",
            lng: "",
          },
        },
        company: {
          name: "",
          catchPhrase: "",
          bs: "",
        },
      });
    } catch (error) {
      addToast("Something went wrong. Please try again.", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-10 text-blue-600 text-shadow-2xs ">
        Create User{" "}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* القسم 1: المعلومات الأساسية */}
        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Leanne Graham"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. Sincere@april.biz"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 1-770-736-8031 x56442"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Website *
            </label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g. https://hildegard.org"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.website
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-500">{errors.website}</p>
            )}
          </div>
        </div>

        {/* القسم 2: العنوان */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street */}
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street *
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="e.g. Kulas Light"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.address?.street
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.address?.street && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.street}
                </p>
              )}
            </div>

            {/* Suite */}
            <div>
              <label
                htmlFor="suite"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Suite
              </label>
              <input
                id="suite"
                name="suite"
                type="text"
                value={formData.address.suite}
                onChange={handleAddressChange}
                placeholder="e.g. Apt. 556"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.address.city}
                onChange={handleAddressChange}
                placeholder="e.g. Gwenborough"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.address?.city
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.address?.city && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.city}
                </p>
              )}
            </div>

            {/* Zipcode */}
            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zipcode *
              </label>
              <input
                id="zipcode"
                name="zipcode"
                type="text"
                value={formData.address.zipcode}
                onChange={handleAddressChange}
                placeholder="e.g. 92998-3874"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.address?.zipcode
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.address?.zipcode && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.zipcode}
                </p>
              )}
            </div>

            {/* Geo - Lat */}
            <div>
              <label
                htmlFor="lat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Latitude *
              </label>
              <input
                id="lat"
                name="lat"
                type="text"
                value={formData.address.geo.lat}
                onChange={handleGeoChange}
                placeholder="e.g. -37.3159"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.address?.geo?.lat
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.address?.geo?.lat && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.geo.lat}
                </p>
              )}
            </div>

            {/* Geo - Lng */}
            <div>
              <label
                htmlFor="lng"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Longitude *
              </label>
              <input
                id="lng"
                name="lng"
                type="text"
                value={formData.address.geo.lng}
                onChange={handleGeoChange}
                placeholder="e.g. 81.1496"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.address?.geo?.lng
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.address?.geo?.lng && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.geo.lng}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* القسم 3: الشركة */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <div className="grid grid-cols-1 gap-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name *
              </label>
              <input
                id="companyName"
                name="name"
                type="text"
                value={formData.company.name}
                onChange={handleCompanyChange}
                placeholder="e.g. Romaguera-Crona"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.company?.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.company?.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.company.name}
                </p>
              )}
            </div>

            {/* Catch Phrase */}
            <div>
              <label
                htmlFor="catchPhrase"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Catch Phrase *
              </label>
              <input
                id="catchPhrase"
                name="catchPhrase"
                type="text"
                value={formData.company.catchPhrase}
                onChange={handleCompanyChange}
                placeholder="e.g. Multi-layered client-server neural-net"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.company?.catchPhrase
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.company?.catchPhrase && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.company.catchPhrase}
                </p>
              )}
            </div>

            {/* BS */}
            <div>
              <label
                htmlFor="bs"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                BS *
              </label>
              <input
                id="bs"
                name="bs"
                type="text"
                value={formData.company.bs}
                onChange={handleCompanyChange}
                placeholder="e.g. harness real-time e-markets"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.company?.bs
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.company?.bs && (
                <p className="mt-1 text-sm text-red-500">{errors.company.bs}</p>
              )}
            </div>
          </div>
        </div>

        {/* أزرار الإرسال والإعادة */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating User...
              </span>
            ) : (
              "Create User"
            )}
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                phone: "",
                website: "",
                address: {
                  street: "",
                  suite: "",
                  city: "",
                  zipcode: "",
                  geo: {
                    lat: "",
                    lng: "",
                  },
                },
                company: {
                  name: "",
                  catchPhrase: "",
                  bs: "",
                },
              });
              setErrors({});
            }}
            className="flex-1"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
