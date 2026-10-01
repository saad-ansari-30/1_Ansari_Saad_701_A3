import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/students";

function App() {

    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        course: "",
        city: ""
    });

    const [editId, setEditId] = useState(null);


    // ==========================================
    // LOAD STUDENTS
    // ==========================================

    const loadStudents = async () => {

        try {

            const response = await fetch(API);

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        loadStudents();

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };


    // ==========================================
    // ADD / UPDATE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (
            !form.name ||
            !form.email ||
            !form.mobile ||
            !form.course ||
            !form.city
        ) {

            alert("Please fill all fields");

            return;

        }


        try {

            if (editId) {

                await fetch(
                    `${API}/${editId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(form)
                    }
                );


                alert(
                    "Student updated successfully"
                );

            } else {

                await fetch(
                    API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(form)
                    }
                );


                alert(
                    "Student added successfully"
                );

            }


            resetForm();

            loadStudents();

        } catch (error) {

            console.log(error);

        }

    };


    // ==========================================
    // EDIT
    // ==========================================

    const editStudent = (student) => {

        setEditId(student.id);

        setForm({

            name: student.name,

            email: student.email,

            mobile: student.mobile,

            course: student.course,

            city: student.city

        });

    };


    // ==========================================
    // DELETE
    // ==========================================

    const deleteStudent = async (id) => {

        if (!window.confirm(
            "Are you sure you want to delete this student?"
        )) {

            return;

        }


        try {

            const response = await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data =
                await response.json();


            alert(data.message);

            loadStudents();

        } catch (error) {

            console.log(error);

        }

    };


    // ==========================================
    // RESET
    // ==========================================

    const resetForm = () => {

        setForm({

            name: "",
            email: "",
            mobile: "",
            course: "",
            city: ""

        });

        setEditId(null);

    };


    return (

        <div className="container">

            <h1>
                Student CRUD Application
            </h1>

            <p className="subtitle">
                Express + Sequelize + React
            </p>


            {/* ================================= */}
            {/* FORM */}
            {/* ================================= */}

            <div className="card">

                <h2>
                    {editId
                        ? "Edit Student"
                        : "Add Student"}
                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="student-form"
                >

                    <input
                        name="name"
                        placeholder="Student Name"
                        value={form.name}
                        onChange={handleChange}
                    />


                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />


                    <input
                        name="mobile"
                        placeholder="Mobile"
                        value={form.mobile}
                        onChange={handleChange}
                    />


                    <input
                        name="course"
                        placeholder="Course"
                        value={form.course}
                        onChange={handleChange}
                    />


                    <input
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                    />


                    <div>

                        <button type="submit">

                            {editId
                                ? "Update Student"
                                : "Add Student"}

                        </button>


                        {editId && (

                            <button
                                type="button"
                                className="cancel"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* ================================= */}
            {/* STUDENT LIST */}
            {/* ================================= */}

            <div className="card">

                <h2>
                    Student List
                </h2>


                {students.length === 0 ? (

                    <p>
                        No students found.
                    </p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Mobile</th>

                                <th>Course</th>

                                <th>City</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {students.map(
                                student => (

                                    <tr
                                        key={
                                            student.id
                                        }
                                    >

                                        <td>
                                            {student.id}
                                        </td>

                                        <td>
                                            {student.name}
                                        </td>

                                        <td>
                                            {student.email}
                                        </td>

                                        <td>
                                            {student.mobile}
                                        </td>

                                        <td>
                                            {student.course}
                                        </td>

                                        <td>
                                            {student.city}
                                        </td>

                                        <td>

                                            <button
                                                className="edit"
                                                onClick={() =>
                                                    editStudent(
                                                        student
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                className="delete"
                                                onClick={() =>
                                                    deleteStudent(
                                                        student.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}

export default App;