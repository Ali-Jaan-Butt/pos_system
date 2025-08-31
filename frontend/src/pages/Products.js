import ProductTable from "../components/Tables/productTable";
import AddProduct from "../components/Products/addProduct";

function ProductsPage() {
    return (
        <div className="flex gap-x-4 w-full h-full p-4">
            {/* Left: Product Table */}
            <div className="h-full w-3/5">
                <ProductTable />
            </div>

            {/* Right: Add Product Form */}
            <div className="w-2/5 h-full">
                <AddProduct />
            </div>
        </div>
    );
}

export default ProductsPage;
