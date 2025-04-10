interface Props {
  label?: string;
}

export default function RememberMeCheckbox({ label }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className={`
           w-5 h-5 rounded border-2 border-primary-600 bg-white text-white
          appearance-none transition-all duration-200 ease-in-out
          checked:bg-primary-600 checked:border-primary-600
          relative flex items-center justify-center
          before:content-['✓'] before:absolute before:text-xs before:text-white
          before:scale-0 checked:before:scale-100 before:transition-transform
        `}
      />
      <span>{label}</span>
    </label>
  );
}
