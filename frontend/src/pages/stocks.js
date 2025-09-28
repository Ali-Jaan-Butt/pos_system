import { useEffect, useState } from "react";
import { AutoComplete, Button, Card, message } from "antd";
import AddStockForm from "../components/Stock/addStock";
import StockTable from "../components/Stock/StockTable";

function ProductStock() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/get/product/data/");
        const data = await res.json();
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

  // ✅ Fetch stock data
  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/get-pending-inventory/");
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setStockData(data.data);
      } else {
        message.error("Invalid stock data format");
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
      message.error("Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch stock on mount
  useEffect(() => {
    fetchStock();
  }, []);

  // ✅ Options for dropdown
  const productOptions = products.map((p) => ({
    id: p.id,
    value: p.product_name,
    size: p.size,
    label: `${p.product_name} - ${p.size} ML`,
    product: p,
  }));

  // ✅ Filter stock data for selected product
  const filteredStock = selectedProduct
    ? stockData.filter(
        (entry) =>
          entry.product_name === selectedProduct.product_name &&
          entry.size === selectedProduct.size
      )
    : [];

  // ✅ Handle product selection
  const handleSelectProduct = (value, option) => {
    setSelectedProduct(option.product);
    setSearch(option.label);
    setShowForm(false);
  };

  console.log("Selected Product:", selectedProduct);
  console.log("Filtered Stock Data:", filteredStock);
  console.log("All Stock Data:", stockData);

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
              String(option.label)
                .toLowerCase()
                .includes(inputValue.toLowerCase())
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
          <AddStockForm product={selectedProduct} fetchStock={fetchStock} />
        </Card>
      )}

      {/* ✅ Stock Table */}
      {selectedProduct && (
        <StockTable
          stockData={filteredStock}
          loading={loading}
          fetchStock={fetchStock}
        />
      )}
    </div>
  );
}

export default ProductStock;
