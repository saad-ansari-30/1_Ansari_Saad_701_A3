import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {

    const [categories, setCategories] = useState([]);

    const [products, setProducts] = useState([]);

    const [selectedCategory, setSelectedCategory] =
        useState("");

    const [cart, setCart] = useState(() => {

        const saved =
            localStorage.getItem("shoppingCart");

        return saved
            ? JSON.parse(saved)
            : [];

    });


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        loadCategories();

        loadProducts();

    }, []);


    // ==========================================
    // SAVE CART
    // ==========================================

    useEffect(() => {

        localStorage.setItem(
            "shoppingCart",
            JSON.stringify(cart)
        );

    }, [cart]);


    // ==========================================
    // CATEGORIES
    // ==========================================

    const loadCategories = async () => {

        const response = await fetch(
            `${API}/categories`
        );

        const data = await response.json();

        setCategories(data);

    };


    // ==========================================
    // PRODUCTS
    // ==========================================

    const loadProducts = async () => {

        const response = await fetch(
            `${API}/products`
        );

        const data = await response.json();

        setProducts(data);

    };


    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = (product) => {

        setCart(previousCart => {

            const existing =
                previousCart.find(
                    item =>
                        item._id === product._id
                );


            if (existing) {

                return previousCart.map(item =>

                    item._id === product._id

                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1
                        }

                        : item

                );

            }


            return [

                ...previousCart,

                {
                    ...product,
                    quantity: 1
                }

            ];

        });

    };


    // ==========================================
    // INCREASE
    // ==========================================

    const increaseQuantity = (id) => {

        setCart(

            cart.map(item =>

                item._id === id

                    ? {
                        ...item,
                        quantity:
                            item.quantity + 1
                    }

                    : item

            )

        );

    };


    // ==========================================
    // DECREASE
    // ==========================================

    const decreaseQuantity = (id) => {

        setCart(

            cart

                .map(item =>

                    item._id === id

                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1
                        }

                        : item

                )

                .filter(
                    item =>
                        item.quantity > 0
                )

        );

    };


    // ==========================================
    // REMOVE
    // ==========================================

    const removeFromCart = (id) => {

        setCart(

            cart.filter(
                item =>
                    item._id !== id
            )

        );

    };


    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    const filteredProducts =
        selectedCategory

            ? products.filter(
                product =>
                    product.category?._id ===
                    selectedCategory
            )

            : products;


    // ==========================================
    // CART TOTAL
    // ==========================================

    const cartTotal = cart.reduce(

        (total, item) =>

            total +
            item.price *
            item.quantity,

        0

    );


    const cartItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


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

        <div className="shop">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <header className="header">

                <div>

                    <h1>
                        My Shopping Cart
                    </h1>

                    <p>
                        Q7 MERN Shopping Application
                    </p>

                </div>


                <div className="cart-count">

                    🛒 Cart:
                    {" "}
                    {cartItems}

                </div>

            </header>


            {/* ================================= */}
            {/* CATEGORY SECTION */}
            {/* ================================= */}

            <section className="categories">

                <button
                    className={
                        selectedCategory === ""
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setSelectedCategory("")
                    }
                >
                    All Products
                </button>


                {mainCategories.map(
                    main => (

                        <div
                            className="category-group"
                            key={main._id}
                        >

                            <h3>
                                {main.name}
                            </h3>


                            {subCategories

                                .filter(
                                    sub =>
                                        sub.parentCategory
                                            ?._id ===
                                        main._id
                                )

                                .map(
                                    sub => (

                                        <button
                                            key={
                                                sub._id
                                            }
                                            className={
                                                selectedCategory ===
                                                sub._id
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setSelectedCategory(
                                                    sub._id
                                                )
                                            }
                                        >

                                            {sub.name}

                                        </button>

                                    )
                                )}

                        </div>

                    )
                )}

            </section>


            {/* ================================= */}
            {/* PRODUCTS */}
            {/* ================================= */}

            <section>

                <h2>
                    Products
                </h2>


                <div className="products">

                    {filteredProducts.map(
                        product => (

                            <div
                                className="product"
                                key={product._id}
                            >

                                {product.image ? (

                                    <img
                                        src={
                                            product.image
                                        }
                                        alt={
                                            product.name
                                        }
                                    />

                                ) : (

                                    <div className="no-image">
                                        No Image
                                    </div>

                                )}


                                <div className="product-content">

                                    <h3>
                                        {product.name}
                                    </h3>


                                    <p>
                                        {
                                            product.description
                                        }
                                    </p>


                                    <h2>
                                        ₹{product.price}
                                    </h2>


                                    <p>
                                        Stock:
                                        {" "}
                                        {product.stock}
                                    </p>


                                    <button
                                        disabled={
                                            product.stock <= 0
                                        }
                                        onClick={() =>
                                            addToCart(
                                                product
                                            )
                                        }
                                    >

                                        {product.stock > 0
                                            ? "Add to Cart"
                                            : "Out of Stock"}

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* ================================= */}
            {/* CART */}
            {/* ================================= */}

            <section className="cart">

                <h2>
                    🛒 Shopping Cart
                </h2>


                {cart.length === 0 ? (

                    <p>
                        Your cart is empty.
                    </p>

                ) : (

                    <>

                        {cart.map(
                            item => (

                                <div
                                    className="cart-item"
                                    key={
                                        item._id
                                    }
                                >

                                    <div>

                                        <strong>
                                            {item.name}
                                        </strong>

                                        <p>
                                            ₹{item.price}
                                            {" × "}
                                            {item.quantity}
                                        </p>

                                    </div>


                                    <div className="quantity">

                                        <button
                                            onClick={() =>
                                                decreaseQuantity(
                                                    item._id
                                                )
                                            }
                                        >
                                            -
                                        </button>


                                        <span>
                                            {item.quantity}
                                        </span>


                                        <button
                                            onClick={() =>
                                                increaseQuantity(
                                                    item._id
                                                )
                                            }
                                        >
                                            +
                                        </button>


                                        <button
                                            className="remove"
                                            onClick={() =>
                                                removeFromCart(
                                                    item._id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            )
                        )}


                        <div className="total">

                            Total:
                            {" "}
                            ₹{cartTotal}

                        </div>

                    </>

                )}

            </section>

        </div>

    );

}

export default App;