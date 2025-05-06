import { useNavigate } from "react-router-dom";
import { ROUTES, BUTTON_TEXT } from "@constants/index";
import Button from "@/components/Button";
import { useAuth } from "@/api/auth";

const Home = () => {
    const navigate = useNavigate();
    const { setTimezone, user } = useAuth();

    setTimezone();

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-base font-semibold mb-6 text-primary-800 dark:text-white">
                Home
            </h1>

            <Button onClick={() => navigate(ROUTES.SCANNER)}>
                {BUTTON_TEXT.SCAN}
            </Button>
        </div>
    );
};

export default Home;
