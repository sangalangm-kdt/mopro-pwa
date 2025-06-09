import { useNavigate } from "react-router-dom";
import LargeHeader from "@/components/Header";
import TextInput from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import Icon from "@/components/icons/Icons";
import Logo from "@assets/logo/logo v2.svg?react";
import BoardingScreen from "@/components/BoardingScreen";
import TopControls from "@/components/TopControls";

import { Check } from "lucide-react";
import { useRequestAccountForm } from "@/hooks/user-request";

export default function RequestAccount() {
  const navigate = useNavigate();
  const steps = ["Basic Info", "Email", "Password", "Review"];

  const {
    step,
    direction,
    form,
    errors,
    loading,
    setLoading,
    handleChange,
    handleNext,
    handleBack,
    totalSteps,
  } = useRequestAccountForm(navigate, steps);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Request submitted", form);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen relative flex-col md:flex-row">
      {/* Left Visual */}
      <div className="hidden md:flex flex-1 bg-gradient-to-tl from-lime-800 to-lime-950 items-center justify-center p-4">
        <BoardingScreen />
      </div>

      {/* Right Form */}
      <div className="relative w-full md:w-[45%] lg:w-[40%] xl:w-[35%] flex items-center justify-center p-6 dark:bg-bg-color">
        <div className="w-full max-w-sm animate-fade-in-up pt-28">
          {/* Logo + Controls */}
          <div className="absolute top-10 left-0 right-0 px-6 flex items-start justify-between">
            <Logo className="h-20 w-auto" />
            <TopControls />
          </div>

          <LargeHeader
            header="Request an Account"
            subheader="Join Us"
            subheading="Fill in your details to get started."
          />

          {/* Step Progress Indicator */}
          <div className="mb-6 relative mt-2 px-1">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
            <div
              className="absolute top-4 left-0 h-1 bg-primary-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
            <div className="flex justify-between relative z-10 text-xs font-medium">
              {steps.map((label, i) => {
                const current = i + 1;
                const isCompleted = step > current;
                const isActive = step === current;
                return (
                  <div key={label} className="flex-1 text-center">
                    <div
                      className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary-700"
                          : isActive
                          ? "bg-primary-500 scale-110 shadow-lg"
                          : "bg-gray-400 dark:bg-zinc-600"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : current}
                    </div>
                    <span className="hidden sm:block text-gray-600 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={`${direction} mt-6 space-y-4 py-5`}
          >
            {step === 1 && (
              <div className="p-4 rounded-md border border-gray-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-900 space-y-4">
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Your first name"
                  icon={
                    <Icon
                      name="first-name"
                      className="w-5 h-5 text-primary-700"
                    />
                  }
                  error={errors.firstName}
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Your last name"
                  icon={
                    <Icon
                      name="last-name"
                      className="w-5 h-5 text-primary-700"
                    />
                  }
                  error={errors.lastName}
                />
              </div>
            )}

            {step === 2 && (
              <div className="p-4 rounded-md border border-gray-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-900">
                <TextInput
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  icon={
                    <Icon name="email" className="w-5 h-5 text-primary-700" />
                  }
                  error={errors.email}
                />
              </div>
            )}

            {step === 3 && (
              <div className="p-4 rounded-md border border-gray-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-900 space-y-4">
                <TextInput
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  icon={
                    <Icon name="lock" className="w-5 h-5 text-primary-700" />
                  }
                  error={errors.password}
                />
                <TextInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  icon={
                    <Icon name="lock" className="w-5 h-5 text-primary-700" />
                  }
                  error={errors.confirmPassword}
                />
              </div>
            )}

            {step === 4 && (
              <div className="p-4 rounded-md border border-dashed border-primary-600 shadow-sm bg-white dark:bg-zinc-900">
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                  Please review your details:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>First Name:</strong> {form.firstName}
                  </li>
                  <li>
                    <strong>Last Name:</strong> {form.lastName}
                  </li>
                  <li>
                    <strong>Email:</strong> {form.email}
                  </li>
                </ul>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-gray-500"
                onClick={handleBack}
              >
                {step === 1 ? "Back to Login" : "Back"}
              </Button>

              {step < totalSteps ? (
                <Button type="button" variant="primary" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="primary" loading={loading}>
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
