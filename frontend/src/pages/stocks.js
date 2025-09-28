import { useEffect, useState } from "react";
import { AutoComplete, Button, Card, message } from "antd";
import AddStockForm from "../components/Stock/addStock";
import StockTable from "../components/Stock/StockTable";

function ProductStock() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);

  // ✅ Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/get/product/data/");
        const data = await res.json();
        console.log("Fetched products:", data);
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          message.error("Invalid product data format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  // ✅ Options for dropdown
  const productOptions = products.map((p) => ({
    id: p.id,
    value: p.product_name, // what appears in the input
    label: `${p.product_name} - ${p.size} ML`, // dropdown display
    product: p,
  }));

  // Dummy stock data (replace with backend API)
  const allStockEntries = [
    {
      key: 1,
      product_id: 1,
      product_name: "Product A",
      boxes: 5,
      extra_units: 3,
      total_units: 63,
      total_value: 3150,
      timestamp: "2025-09-28 11:20",
    },
    {
      key: 2,
      product_id: 2,
      product_name: "Product B",
      boxes: 2,
      extra_units: 6,
      total_units: 54,
      total_value: 1620,
      timestamp: "2025-09-28 11:30",
    },
  ];

  // ✅ Filter stock data for selected product
  const filteredStock = allStockEntries.filter(
    (entry) => entry.product_id === selectedProduct?.id
  );

  // ✅ Handle product selection
  const handleSelectProduct = (value, option) => {
    setSelectedProduct(option.product);
    setSearch(option.label); 
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="shadow-lg rounded-xl mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <AutoComplete
            style={{ width: "100%" }}
            className="md:w-1/2"
            options={productOptions}
            value={search}
            onChange={(val) => setSearch(val)}
            onSelect={handleSelectProduct}
            placeholder="Search and select product..."
            filterOption={(inputValue, option) =>
              String(option.label).toLowerCase().includes(inputValue.toLowerCase())
            }
          />

          {selectedProduct && (
            <Button
              type="dashed"
              className="bg-green-500 text-white"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Hide Form" : "➕ Add Stock"}
            </Button>
          )}
        </div>
      </Card>

      {/* ✅ Show form if toggled */}
      {showForm && selectedProduct && (
        <Card className="mb-6 shadow-lg rounded-xl">
          <AddStockForm product={selectedProduct} />
        </Card>
      )}

      {/* ✅ Stock Table */}
      {selectedProduct && (
        <StockTable
          stockData={filteredStock}
          loading={false}
          fetchStock={() => console.log("Fetch stock from backend")}
        />
      )}
    </div>
  );
}

export default ProductStock;
