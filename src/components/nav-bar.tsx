import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="w-full bg-gray-800 text-white flex items-center justify-between px-4 py-2">
            <button
                className="text-white hover:text-gray-300"
                onClick={() => navigate(-1)}
            >
                Back
            </button>
            <ul className="flex space-x-4">
                <li>
                    <Link to="/" className="hover:text-gray-300">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/login" className="hover:text-gray-300">
                        Login
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard" className="hover:text-gray-300">
                        Dashboard
                    </Link>
                </li>
            </ul>
        </nav>
    );
}