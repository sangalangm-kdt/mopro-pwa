interface ProductInfoFieldProps {
  label: string;
  value: string;
}

export default function ProductInfoField({
  label,
  value,
}: ProductInfoFieldProps) {
  return (
    <div>
      <p className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </p>
      <div className="w-full rounded-md bg-gray-100 text-gray-800 px-3 py-2 text-sm border border-gray-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-700">
        {value || "-"}
      </div>
    </div>
  );
}
