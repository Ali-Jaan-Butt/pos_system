import React, { useState } from "react";
import { Form, InputNumber, Select, Button, Card, Typography, Spin } from "antd";
import { PlusOutlined, DollarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const itemsList = [
  { id: 1, name: "Milk", price: 50 },
  { id: 2, name: "Bread", price: 80 },
  { id: 3, name: "Eggs (Dozen)", price: 200 },
  { id: 4, name: "Cheese", price: 500 },
];

export default function BillForm({ onGenerateBill }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    if (!selectedItem || !quantity) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const billItem = {
        name: selectedItem.name,
        qty: quantity,
        price: selectedItem.price,
      };

      onGenerateBill(billItem);

      // Reset form + state
      form.resetFields();
      setSelectedItem(null);
      setQuantity(1);
    }, 800);
  };

  const price = selectedItem ? selectedItem.price * quantity : 0;

  return (
    <div>
      <Card className="w-full shadow-xl rounded-md border" bordered={true}>
        <Title level={3} className="text-center mb-4">
          🧾 Create Bill
        </Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Item Selector */}
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

          {/* Quantity */}
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

          {/* Price Calculation */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border mb-4">
            <Text strong>Total Price:</Text>
            <Text className="text-lg text-green-600 font-semibold flex items-center">
              <DollarOutlined className="mr-1" /> {price}
            </Text>
          </div>

          {/* Submit Button */}
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
    </div>
  );
}
