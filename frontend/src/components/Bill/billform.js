import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  Spin,
  message,
} from "antd";
import { PlusOutlined, DollarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function BillForm({ onGenerateBill }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/get/product/data/");
        const data = await res.json();
        if (data.status === "success") {
          const formatted = data.data.map((p, index) => ({
            id: index + 1, // or p.id if available
            name: p.product_name,
            price: p.per_liter_value,
          }));
          setItemsList(formatted);
        }
      } catch (err) {
        message.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = () => {
    if (!selectedItem || !quantity) {
      message.warning("Please select an item and quantity!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const billItem = {
        id: selectedItem.id,
        name: selectedItem.name,
        qty: quantity,
        price: selectedItem.price,
      };

      onGenerateBill(billItem);

      form.resetFields();
      setSelectedItem(null);
      setQuantity(1);
    }, 500);
  };

  const price = selectedItem ? selectedItem.price * quantity : 0;

  return (
    <Card className="w-full shadow-xl rounded-md border" bordered>
      <Title level={3} className="text-center mb-4">
        🧾 Create Bill
      </Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Search Item"
          name="item"
          rules={[{ required: true, message: "Please select an item!" }]}
        >
          <Select
            showSearch
            placeholder="Select item"
            optionFilterProp="children"
            onChange={(value) =>
              setSelectedItem(itemsList.find((i) => i.id === value))
            }
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
            options={itemsList.map((item) => ({
              label: `${item.name} - Rs.${item.price}`,
              value: item.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Amount / pcs"
          name="quantity"
          initialValue={1}
          rules={[{ required: true, message: "Please enter quantity!" }]}
        >
          <InputNumber
            min={1}
            value={quantity}
            onChange={(val) => setQuantity(val)}
            className="w-full"
            prefix={<PlusOutlined />}
          />
        </Form.Item>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border mb-4">
          <Text strong>Total Price:</Text>
          <Text className="text-lg text-green-600 font-semibold flex items-center">
            <DollarOutlined className="mr-1" /> {price}
          </Text>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 text-lg rounded-xl"
            loading={loading}
          >
            {loading ? <Spin /> : "Add to Bill"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
