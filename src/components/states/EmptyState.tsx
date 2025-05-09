import Icon from "@/components/icons/Icons";
import Header from "@/components/navigation/Header";

export default function EmptyState({
  title,
  description,
  code,
}: {
  title: string;
  description?: string;
  code?: string;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-zinc-900 text-gray-800 dark:text-white">
      {/* Reusable Header Component */}
      <Header
        title="Edit Progress"
        showBack
        textColorClass="text-gray-800 dark:text-white"
        rightElement={<Icon name="home" />}
      />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
          {code && (
            <code className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
              {code}
            </code>
          )}
        </div>
      </div>
    </div>
  );
}
