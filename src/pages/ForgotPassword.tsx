import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/logo/logo v2.svg?react";
import LargeHeader from "@/components/Header";
import TextInput from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import Icon from "@/components/icons/Icons";
import TopControls from "@/components/TopControls"; // ✅ Theme & language toggle
import { ROUTES } from "@constants/index"; // If you have route constants

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ✅ Add your reset logic here
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Left: Form */}
      <div className="relative w-full md:w-[50%] lg:w-[45%] xl:w-[40%] flex items-center justify-center p-6 dark:bg-bg-color animate-slide-in-left">
        {/* Top Controls */}
        <div className="absolute top-10 left-0 right-0 px-6 flex items-start justify-between">
          <Logo className="h-20 w-auto" />
          <TopControls />
        </div>

        <div className="w-full max-w-sm animate-fade-in-up pt-28">
          <LargeHeader
            header="Forgot Password"
            subheader="Reset your password"
            subheading="Enter your email address and we’ll send you a reset link."
          />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <TextInput
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Icon name="email" className="w-5 h-5 text-primary-700" />}
            />

            <Button type="submit" fullWidth variant="primary">
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-primary-700 dark:text-primary-400 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-lime-800 to-lime-950 items-center justify-center p-4 animate-fade-in">
        <div className="text-center text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg">
            Reset your password and get back to your work quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
