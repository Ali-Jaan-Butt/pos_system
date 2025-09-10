import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Select, Card, message } from "antd";

const AddProduct = ({ onProductAdded }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    const payload = {
      product_name: values.name,
      size: values.size,
      branded: values.branded,
      unit_per_box: values.unit_per_box,
      per_liter_value: values.per_liter_value,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/add-products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        message.success("✅ Product added successfully!");
        onProductAdded(); // refresh table
      } else {
        message.warning(data.message || "⚠️ Product already exists");
      }
    } catch (error) {
      console.error(error);
      message.error("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Card title="➕ Add New Product" className="w-full shadow-lg rounded-xl">
        <Form layout="vertical" onFinish={onFinish}>
          {/* Product Name */}
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          {/* Unit per Box */}
          <Form.Item
            label="Unit Per Box"
            name="unit_per_box"
            rules={[{ required: true, message: "Please enter units per box" }]}
          >
            <InputNumber className="w-full" min={1} placeholder="e.g., 12" />
          </Form.Item>

          {/* Per Liter Value */}
          <Form.Item
            label="Per Liter Value"
            name="per_liter_value"
            rules={[{ required: true, message: "Please enter per liter value" }]}
          >
            <InputNumber
              className="w-full"
              min={1}
              placeholder="Enter per liter value"
            />
          </Form.Item>

          {/* Size in ML */}
          <Form.Item
            label="Size (ML)"
            name="size"
            rules={[{ required: true, message: "Please enter size in ML" }]}
          >
            <InputNumber
              className="w-full"
              min={50}
              step={50}
              placeholder="Enter size in ML (e.g., 500)"
            />
          </Form.Item>

          {/* Branded Yes/No */}
          <Form.Item
            label="Branded"
            name="branded"
            rules={[{ required: true, message: "Please select option" }]}
          >
            <Select placeholder="Is this branded?">
              <Select.Option value="True">Yes</Select.Option>
              <Select.Option value="False">No</Select.Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="rounded-lg"
            >
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;
