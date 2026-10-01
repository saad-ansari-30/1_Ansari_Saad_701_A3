import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {

    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("http://localhost:3004/api/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setEmployee(data);
            })
            .catch((error) => {
                setError(error.message);
            });

    }, []);

    if (error) {
        return (
            <div className="container">
                <p className="error">{error}</p>
                <Link to="/">Back Home</Link>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="container">
                Loading...
            </div>
        );
    }

    return (
        <div className="container">

            <h1>Employee Profile</h1>

            <table>

                <tbody>

                    <tr>
                        <th>Employee ID</th>
                        <td>{employee.empId}</td>
                    </tr>

                    <tr>
                        <th>Name</th>
                        <td>{employee.name}</td>
                    </tr>

                    <tr>
                        <th>Email</th>
                        <td>{employee.email}</td>
                    </tr>

                    <tr>
                        <th>Department</th>
                        <td>{employee.department}</td>
                    </tr>

                    <tr>
                        <th>Designation</th>
                        <td>{employee.designation}</td>
                    </tr>

                    <tr>
                        <th>Basic Salary</th>
                        <td>₹{employee.basicSalary}</td>
                    </tr>

                    <tr>
                        <th>HRA</th>
                        <td>₹{employee.hra}</td>
                    </tr>

                    <tr>
                        <th>DA</th>
                        <td>₹{employee.da}</td>
                    </tr>

                    <tr>
                        <th>Gross Salary</th>
                        <td>₹{employee.grossSalary}</td>
                    </tr>

                    <tr>
                        <th>Joining Date</th>
                        <td>
                            {new Date(
                                employee.joiningDate
                            ).toLocaleDateString()}
                        </td>
                    </tr>

                </tbody>

            </table>

            <br />

            <Link to="/">
                Back Home
            </Link>

        </div>
    );
}

export default Profile;