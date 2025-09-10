import React, { useState, useEffect } from "react";
import { message } from "antd";
import AddProduct from "../components/Products/addProduct";
import ProductTable from "../components/Tables/productTable";

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch products from backend
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/get/product/data/");
            const data = await res.json();
            if (res.ok && data.status === "success") {
                setProducts(data.data);
            } else {
                message.error("Failed to load products");
            }
        } catch (error) {
            console.error(error);
            message.error("Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="flex gap-4 ">

            <div className="w-2/3 min-h-full">
                <ProductTable
                    products={products}
                    loading={loading}
                    fetchProducts={fetchProducts}
                />
            </div>

            <div className="w-1/3">
                <AddProduct onProductAdded={fetchProducts} />
            </div>

        </div>
    );
};

export default ProductManager;
