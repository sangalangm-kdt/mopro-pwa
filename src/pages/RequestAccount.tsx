import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LargeHeader from "@/components/Header";
import TextInput from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import Icon from "@/components/icons/Icons";
import Logo from "@assets/logo/logo.svg?react";
import BoardingScreen from "@/components/BoardingScreen";
import TopControls from "@/components/TopControls";
import { Check, Hash } from "lucide-react";
import { useRequestAccountForm } from "@/hooks/user-request";
import ManufacturerInput from "@/components/ManufacturerDropdown";
import { REQUEST_ACCOUNT_TEXT_KEYS, ROUTES } from "@/constants";
import SuccessModal from "@/components/modals/RequestModal";
import { FORM_STEP_CONTAINER_CLASSES } from "@/constants";
import { useTranslation } from "react-i18next";
import { useManufacturer } from "@/api/manufacturer";

type ManufacturerOption = {
  id: string;
  label: string;
};

export default function RequestAccount() {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const TEXT = REQUEST_ACCOUNT_TEXT_KEYS;
  const stepLabelKeys = [
    TEXT.STEPS.BASIC_INFO,
    TEXT.STEPS.MANUFACTURER_INFO,
    TEXT.STEPS.EMAIL,
    TEXT.STEPS.PASSWORD,
    TEXT.STEPS.REVIEW,
  ];
  const [showSuccess, setShowSuccess] = useState(false);
  const [didClickSubmit, setDidClickSubmit] = useState(false);
  const {
    manufacturers,
    isLoading: manufacturersLoading,
    error: manufacturersError,
  } = useManufacturer();
  const manufacturerOptions: ManufacturerOption[] = manufacturers
    .map((manufacturer) => ({
      id: String(manufacturer.id),
      label: String(
        manufacturer.name ??
          manufacturer.label ??
          (manufacturer as any).manufacturerName ??
          "",
      ),
    }))
    .filter(
      (manufacturer: ManufacturerOption) =>
        manufacturer.id && manufacturer.label,
    );

  const {
    step,
    direction,
    form,
    errors,
    loading,
    submitError,
    handleChange,
    handleEmailBlur,
    handleNext,
    handleBack,
    submitUserRequest,
    totalSteps,
  } = useRequestAccountForm(navigate, stepLabelKeys, {
    manufacturerLoadFailed: Boolean(manufacturersError),
  });
  const selectedManufacturer = manufacturerOptions.find(
    (manufacturer: ManufacturerOption) =>
      manufacturer.id === form.manufacturerId,
  );
  const canUseManufacturerStep =
    !manufacturersLoading &&
    !manufacturersError &&
    manufacturerOptions.length > 0;
  const nextDisabled = step === 2 && !canUseManufacturerStep;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step < totalSteps) {
      // Prevent accidental submit — move to next step instead
      if (nextDisabled) return;
      handleNext();
      return;
    }

    if (!didClickSubmit) {
      return; // 🔒 Prevent accidental Enter submit
    }

    if (loading) return;

    const success = await submitUserRequest();
    setDidClickSubmit(false);
    if (success) {
      setShowSuccess(true);
    }
  };

  return (
    <div className="flex min-h-screen relative flex-col lg:flex-row">
      {/* Left Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-tl from-lime-800 to-lime-950 items-center justify-center p-4">
        <BoardingScreen />
      </div>

      {/* Right Form */}
      <div className="relative w-full lg:w-[42%] xl:w-[35%] flex items-center justify-center px-6 py-8 sm:py-10 lg:py-12 dark:bg-bg-color">
        <div className="w-full max-w-md lg:max-w-sm pt-32 sm:pt-28 lg:pt-28 my-0 lg:my-12 animate-fade-in-up">
          {/* Logo + Controls */}
          <div className="absolute top-10 left-0 right-0 px-6 flex items-start justify-between">
            <Logo className="h-20 w-auto" />
            <TopControls />
          </div>

          <LargeHeader
            header={TEXT.TITLE}
            subheader={TEXT.SUBHEADER}
            subheading={TEXT.SUBHEADING}
          />

          {/* Step Progress Indicator */}
          <div className="my-6 relative mt-2 px-1">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
            <div
              className="absolute top-4 left-0 h-1 bg-primary-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
            <div className="flex justify-between relative z-10 text-xs font-medium">
              {stepLabelKeys.map((labelKey, i) => {
                const current = i + 1;
                const isCompleted = step > current;
                const isActive = step === current;
                return (
                  <div key={labelKey} className="flex-1 text-center">
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
                      {t(labelKey)}
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
              <div className={FORM_STEP_CONTAINER_CLASSES}>
                <TextInput
                  label={t(TEXT.FIELDS.EMPLOYEE_ID)}
                  name="employeeId"
                  value={form.employeeId}
                  onChange={(e) => handleChange("employeeId", e.target.value)}
                  placeholder={t(TEXT.PLACEHOLDER.EMPLOYEE_ID)}
                  icon={<Hash className="w-5 h-5 text-primary-700" />}
                  error={errors.employeeId}
                />
                <TextInput
                  label={t(TEXT.FIELDS.FIRST_NAME)}
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder={t(TEXT.PLACEHOLDER.FIRST_NAME)}
                  icon={
                    <Icon
                      name="first-name"
                      className="w-5 h-5 text-primary-700"
                    />
                  }
                  error={errors.firstName}
                />
                <TextInput
                  label={t(TEXT.FIELDS.LAST_NAME)}
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder={t(TEXT.PLACEHOLDER.LAST_NAME)}
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
              <div className={FORM_STEP_CONTAINER_CLASSES}>
                <ManufacturerInput
                  label={t(TEXT.FIELDS.MANUFACTURER)}
                  value={form.manufacturerId}
                  onChange={(val) => handleChange("manufacturerId", val)}
                  placeholder={
                    manufacturersLoading
                      ? t(TEXT.PLACEHOLDER.MANUFACTURER_LOADING)
                      : t(TEXT.PLACEHOLDER.MANUFACTURER)
                  }
                  manufacturers={manufacturerOptions}
                  loading={manufacturersLoading}
                  disabled={Boolean(manufacturersError)}
                  emptyMessage={t(TEXT.ERROR.MANUFACTURER_EMPTY)}
                  icon={
                    <Icon
                      name="building"
                      className="w-5 h-5 text-primary-700"
                    />
                  }
                  error={
                    manufacturersError
                      ? t(TEXT.ERROR.MANUFACTURER_LOAD_FAILED)
                      : !manufacturersLoading &&
                          manufacturerOptions.length === 0
                        ? t(TEXT.ERROR.MANUFACTURER_EMPTY)
                        : errors.manufacturerId
                  }
                />
              </div>
            )}

            {step === 3 && (
              <div className={FORM_STEP_CONTAINER_CLASSES}>
                <TextInput
                  label={t(TEXT.FIELDS.EMAIL)}
                  name="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder={t(TEXT.PLACEHOLDER.EMAIL)}
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
                  label={t(TEXT.FIELDS.PASSWORD)}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={t(TEXT.PLACEHOLDER.PASSWORD)}
                  error={errors.password}
                />
                <TextInput
                  label={t(TEXT.FIELDS.CONFIRM_PASSWORD)}
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder={t(TEXT.PLACEHOLDER.CONFIRM_PASSWORD)}
                  error={errors.confirmPassword}
                />
              </div>
            )}

            {step === 5 && (
              <div className="p-5 rounded-lg border border-dashed border-primary-600 shadow-md bg-white dark:bg-zinc-900 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide">
                    {t(TEXT.REVIEW_TITLE)}
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
                  <li className="flex items-start gap-2">
                    <Icon
                      name="clipboard-list"
                      className="w-4 h-4 mt-1 text-primary-600"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t(TEXT.FIELDS.EMPLOYEE_ID)}
                      </p>
                      <p className="font-medium">{form.employeeId || "—"}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      name="first-name"
                      className="w-4 h-4 mt-1 text-primary-600"
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t(TEXT.FIELDS.FIRST_NAME)}
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
                        {t(TEXT.FIELDS.LAST_NAME)}
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
                        {t(TEXT.FIELDS.MANUFACTURER)}
                      </p>
                      <p className="font-medium">
                        {selectedManufacturer?.label || "—"}
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
                        {t(TEXT.FIELDS.EMAIL)}
                      </p>
                      <p className="font-medium break-all">
                        {form.email || "—"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-4">
              {submitError && (
                <p
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
                >
                  {submitError}
                </p>
              )}

              <div className="flex justify-between">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-base text-gray-500"
                    onClick={handleBack}
                  >
                    {t(TEXT.ACTIONS.BACK)}
                  </Button>
                ) : (
                  <span /> // Keeps spacing
                )}

                {step < totalSteps ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    disabled={nextDisabled}
                  >
                    {t(TEXT.ACTIONS.NEXT)}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                    onClick={() => setDidClickSubmit(true)}
                  >
                    {loading
                      ? t(TEXT.ACTIONS.SUBMITTING)
                      : t(TEXT.ACTIONS.SUBMIT)}
                  </Button>
                )}
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t(TEXT.ACTIONS.ALREADY_HAVE_ACCOUNT)}{" "}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-primary-700 dark:text-primary-400 font-medium hover:underline"
                >
                  {t(TEXT.ACTIONS.LOGIN)}
                </button>
              </div>
            </div>
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
