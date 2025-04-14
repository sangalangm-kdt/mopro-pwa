import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/index"; // Make sure this has SCANNER defined

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-4 ">
      <h1 className="color">Home</h1>
      <button
        onClick={() => navigate(ROUTES.SCANNER)}
        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded transition"
      >
        Go to QR Scanner
      </button>
    </div>
  );
};

export default Home;
