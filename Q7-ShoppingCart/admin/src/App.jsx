import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {

    const [categories, setCategories] = useState([]);

    const [products, setProducts] = useState([]);

    const [categoryName, setCategoryName] = useState("");

    const [parentCategory, setParentCategory] = useState("");

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: ""
    });


    // ==========================================
    // GET CATEGORIES
    // ==========================================

    const loadCategories = async () => {

        const response = await fetch(
            `${API}/categories`
        );

        const data = await response.json();

        setCategories(data);

    };


    // ==========================================
    // GET PRODUCTS
    // ==========================================

    const loadProducts = async () => {

        const response = await fetch(
            `${API}/products`
        );

        const data = await response.json();

        setProducts(data);

    };


    useEffect(() => {

        loadCategories();

        loadProducts();

    }, []);


    // ==========================================
    // ADD CATEGORY
    // ==========================================

    const addCategory = async (e) => {

        e.preventDefault();


        if (!categoryName) {

            alert("Enter category name");

            return;

        }


        const response = await fetch(
            `${API}/categories`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: categoryName,

                    parentCategory:
                        parentCategory || null

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert("Category added successfully");

        setCategoryName("");

        setParentCategory("");

        loadCategories();

    };


    // ==========================================
    // DELETE CATEGORY
    // ==========================================

    const deleteCategory = async (id) => {

        if (!window.confirm(
            "Delete this category?"
        )) {

            return;

        }


        const response = await fetch(
            `${API}/categories/${id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        loadCategories();

    };


    // ==========================================
    // PRODUCT INPUT
    // ==========================================

    const handleProductChange = (e) => {

        setProduct({

            ...product,

            [e.target.name]: e.target.value

        });

    };


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    const addProduct = async (e) => {

        e.preventDefault();


        if (
            !product.name ||
            !product.price ||
            !product.category
        ) {

            alert(
                "Name, price and category are required"
            );

            return;

        }


        const response = await fetch(
            `${API}/products`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(product)
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert("Product added successfully");


        setProduct({

            name: "",
            description: "",
            price: "",
            image: "",
            category: "",
            stock: ""

        });


        loadProducts();

    };


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    const deleteProduct = async (id) => {

        if (!window.confirm(
            "Delete this product?"
        )) {

            return;

        }


        const response = await fetch(
            `${API}/products/${id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        loadProducts();

    };


    const mainCategories =
        categories.filter(
            category =>
                category.parentCategory === null
        );


    const subCategories =
        categories.filter(
            category =>
                category.parentCategory !== null
        );


    return (

        <div className="admin">

            <header>

                <h1>Admin Site</h1>

                <p>
                    Q7 Shopping Cart Management
                </p>

            </header>


            {/* ================================= */}
            {/* CATEGORY SECTION */}
            {/* ================================= */}

            <section className="card">

                <h2>Category Management</h2>


                <form onSubmit={addCategory}>

                    <input
                        type="text"
                        placeholder="Category / Subcategory Name"
                        value={categoryName}
                        onChange={
                            e =>
                                setCategoryName(
                                    e.target.value
                                )
                        }
                    />


                    <select
                        value={parentCategory}
                        onChange={
                            e =>
                                setParentCategory(
                                    e.target.value
                                )
                        }
                    >

                        <option value="">
                            Main Category
                        </option>


                        {mainCategories.map(
                            category => (

                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    Subcategory of {
                                        category.name
                                    }
                                </option>

                            )
                        )}

                    </select>


                    <button>
                        Add Category
                    </button>

                </form>


                <h3>Categories</h3>


                <table>

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Level</th>

                            <th>Parent</th>

                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        {categories.map(
                            category => (

                                <tr key={category._id}>

                                    <td>
                                        {category.name}
                                    </td>

                                    <td>

                                        {
                                            category.parentCategory
                                                ? "Level 2"
                                                : "Level 1"
                                        }

                                    </td>

                                    <td>

                                        {
                                            category.parentCategory
                                                ? category.parentCategory.name
                                                : "-"
                                        }

                                    </td>

                                    <td>

                                        <button
                                            className="delete"
                                            onClick={() =>
                                                deleteCategory(
                                                    category._id
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

            </section>


            {/* ================================= */}
            {/* PRODUCT SECTION */}
            {/* ================================= */}

            <section className="card">

                <h2>Product Management</h2>


                <form onSubmit={addProduct}>

                    <input
                        name="name"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={
                            handleProductChange
                        }
                    />


                    <textarea
                        name="description"
                        placeholder="Description"
                        value={product.description}
                        onChange={
                            handleProductChange
                        }
                    />


                    <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={product.price}
                        onChange={
                            handleProductChange
                        }
                    />


                    <input
                        name="image"
                        placeholder="Image URL"
                        value={product.image}
                        onChange={
                            handleProductChange
                        }
                    />


                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock"
                        value={product.stock}
                        onChange={
                            handleProductChange
                        }
                    />


                    <select
                        name="category"
                        value={product.category}
                        onChange={
                            handleProductChange
                        }
                    >

                        <option value="">
                            Select Subcategory
                        </option>


                        {subCategories.map(
                            category => (

                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.parentCategory.name}
                                    {" → "}
                                    {category.name}
                                </option>

                            )
                        )}

                    </select>


                    <button>
                        Add Product
                    </button>

                </form>


                <h3>Products</h3>


                <table>

                    <thead>

                        <tr>

                            <th>Image</th>

                            <th>Name</th>

                            <th>Category</th>

                            <th>Price</th>

                            <th>Stock</th>

                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        {products.map(
                            product => (

                                <tr key={product._id}>

                                    <td>

                                        {product.image ? (

                                            <img
                                                src={product.image}
                                                className="product-image"
                                            />

                                        ) : (

                                            "No Image"

                                        )}

                                    </td>


                                    <td>
                                        {product.name}
                                    </td>


                                    <td>
                                        {
                                            product.category?.name
                                        }
                                    </td>


                                    <td>
                                        ₹{product.price}
                                    </td>


                                    <td>
                                        {product.stock}
                                    </td>


                                    <td>

                                        <button
                                            className="delete"
                                            onClick={() =>
                                                deleteProduct(
                                                    product._id
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

            </section>

        </div>

    );

}

export default App;