interface HeaderProps {
  header: string;
  subheader?: React.ReactNode; // Typically a short tagline/intro
  subheading?: React.ReactNode; // More like a section title
}

export default function LargeHeader({
  header,
  subheader,
  subheading,
}: HeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl text-primary-900 font-bold mb-6">{header}</h1>
      {subheader && (
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          {subheader}
        </p>
      )}{" "}
      {subheading && (
        <h2 className=" text-gray-600 tracking-wider mb-1 mt-3 font-medium dark:text-gray-400">
          {subheading}
        </h2>
      )}
    </div>
  );
}
