import { useState } from "react";
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
import ManufacturerInput from "@/components/ManufacturerDropdown";
import { ROUTES } from "@/constants";
import SuccessModal from "@/components/modals/RequestModal";

export default function RequestAccount() {
  const navigate = useNavigate();
  const steps = ["Basic Info", "Company Info", "Email", "Password", "Review"];
  const [showSuccess, setShowSuccess] = useState(false);

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
    e.preventDefault(); // ✅ Prevent default form submission
    setLoading(true); // ✅ Show loading state

    setTimeout(() => {
      setLoading(false); // ✅ Hide loading
      setShowSuccess(true); // ✅ Trigger modal AFTER click
    }, 1000); // You can replace this with an actual API call
  };

  return (
    <div className="flex min-h-screen relative flex-col md:flex-row">
      {/* Left Visual */}
      <div className="hidden md:flex flex-1 bg-gradient-to-tl from-lime-800 to-lime-950 items-center justify-center p-4">
        <BoardingScreen />
      </div>

      {/* Right Form */}
      <div className="relative w-full md:w-[45%] lg:w-[40%] xl:w-[35%] flex items-center justify-center p-6 dark:bg-bg-color">
        <div className="w-full max-w-sm pt-28 my-28 animate-fade-in-up">
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
          <div className="my-6 relative mt-2 px-1">
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
                <ManufacturerInput
                  label="Company Name"
                  value={form.manufacturerId}
                  onChange={(val) => handleChange("manufacturerId", val)}
                  icon={
                    <Icon
                      name="building"
                      className="w-5 h-5 text-primary-700"
                    />
                  }
                  error={errors.manufacturerId}
                />
              </div>
            )}

            {step === 3 && (
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

            {step === 4 && (
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

            {step === 5 && (
              <div className="p-5 rounded-lg border border-dashed border-primary-600 shadow-md bg-white dark:bg-zinc-900 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide">
                    Review Your Details
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
                  <li className="flex items-start gap-2">
                    <Icon
                      name="first-name"
                      className="w-4 h-4 mt-1 text-primary-600"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        First Name
                      </p>
                      <p className="font-medium">{form.firstName || "—"}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      name="last-name"
                      className="w-4 h-4 mt-1 text-primary-600"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last Name
                      </p>
                      <p className="font-medium">{form.lastName || "—"}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      name="building"
                      className="w-4 h-4 mt-1 text-primary-600"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Company Name
                      </p>
                      <p className="font-medium">
                        {form.manufacturerId || "—"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      name="email"
                      className="w-4 h-4 mt-1 text-primary-600"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium break-all">
                        {form.email || "—"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                className="text-base text-gray-500"
                onClick={handleBack}
              >
                Back
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

            {step >= 2 && (
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-primary-700 dark:text-primary-400 font-medium hover:underline"
                >
                  Log in
                </button>
              </div>
            )}
          </form>

          {/* Success Modal */}
          {showSuccess && (
            <SuccessModal
              show={showSuccess}
              onClose={() => setShowSuccess(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
