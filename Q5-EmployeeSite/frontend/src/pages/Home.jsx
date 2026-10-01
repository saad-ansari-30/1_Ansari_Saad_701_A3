import { Link, useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const employeeName =
        localStorage.getItem("employeeName");

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("employeeName");

        navigate("/login");
    };

    return (
        <div className="container">

            <h1>Employee Home Page</h1>

            <h2>
                Welcome, {employeeName}
            </h2>

            <div className="menu">

                <Link to="/profile">
                    Page 1 - Employee Profile
                </Link>

                <Link to="/leave">
                    Page 2 - Application for Leave
                </Link>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Home;