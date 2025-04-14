const steps = [
  {
    title: "Scan the Serial",
    description:
      "Use your device to scan the QR or barcode of the product to begin tracking.",
    image: "/assets/scan.png",
  },
  {
    title: "Enter Work Progress",
    description:
      "Fill in the work order details to associate with the scanned item.",
    image: "/assets/enter.png",
  },
  {
    title: "Track Progress",
    description: "Monitor inspection time and status in real-time.",
    image: "/assets/track.png",
  },
];

export default function BoardingScreen() {
  const [index, setIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  const step = steps[index];

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoSlide]);

  const next = () => {
    setAutoSlide(false);
    setIndex((prev) => (prev + 1) % steps.length);
  };

  const prev = () => {
    setAutoSlide(false);
    setIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <div className="flex flex-col items-start justify-center text-left text-primary-200 dark:text-whitepx-6 sm:px-10 lg:px-20 py-10 h-full w-full max-w-xl mx-auto">
      {/* Image */}
      <img
        src={step.image}
        alt={step.title}
        className="w-40 h-auto mb-6 self-center sm:self-start transition-all duration-500"
      />

      {/* Text Content */}
      <div className="transition-all duration-500 ease-in-out">
        <h2 className="text-2xl font-display font-semibold mb-2 text-primary-100 dark:text-primary-600">
          {step.title}
        </h2>
        <p className="max-w-md text-sm text-primary-200 dark:text-white mb-6  ">
          {step.description}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={prev}
          className="text-sm px-4 py-2 rounded bg-primary-400 hover:bg-primary-500 text-white transition"
        >
          Prev
        </button>
        <button
          onClick={next}
          className="text-sm px-4 py-2 rounded bg-primary-400 hover:bg-primary-500 text-white transition"
        >
          Next
        </button>
      </div>

      {/* Dot Indicators - Clickable */}
      <div className="flex gap-2 mt-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setAutoSlide(false);
              setIndex(i);
            }}
            className={`w-2 h-2 rounded-full transition ${
              i === index
                ? "bg-primary-700 dark:bg-primary-200"
                : "bg-primary-300 dark:bg-primary-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
