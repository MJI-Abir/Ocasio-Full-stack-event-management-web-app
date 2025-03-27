import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { RegisterRequest } from "@/types/auth";

const RegisterForm = () => {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await register(formData);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-800 shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-700">
        <div className="text-center mb-6">
          <motion.h2
            className="text-2xl font-bold text-teal-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Create Account
          </motion.h2>
          <motion.p
            className="text-gray-300 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join us to explore events
          </motion.p>
        </div>

        {error && (
          <motion.div
            className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg relative mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
            required
          />
          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required
          />
          <div className="mt-6">
            <Button type="submit" isLoading={loading} className="w-full">
              Create Account
            </Button>
            <p className="text-center text-gray-300 text-sm mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-teal-400 hover:text-teal-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
