import Header from "@/components/navigation/Header";

const HelpAndSupport = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Header
        title="Help & Support"
        textColorClass="text-gray-800 dark:text-white"
      />
      {/* Add your help content here */}
      <div className="p-4 text-sm text-gray-700 dark:text-gray-200">
        {/* Placeholder content */}
        <p>
          Need assistance? Here you can find help topics or contact support.
        </p>
      </div>
    </div>
  );
};

export default HelpAndSupport;
