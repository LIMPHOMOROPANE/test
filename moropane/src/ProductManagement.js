import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
    const navigate = useNavigate(); // Use hook to get navigate function
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [errors, setErrors] = useState({}); // Track errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error message
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Product name is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price is required";
        if (!formData.quantity || isNaN(formData.quantity)) newErrors.quantity = "Valid quantity is required";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const products = JSON.parse(localStorage.getItem("products")) || [];
        const newProduct = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity), id: Date.now() };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        alert('Product added successfully');
        setFormData({ name: '', description: '', category: '', price: '', quantity: '' });
    };

    const handleViewProducts = () => {
        navigate('/product-list'); // Navigate to Product List instead
    };

    return (
        <section>
            <h2>Product Management</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Product Name" required value={formData.name} onChange={handleChange} className={errors.name ? 'error' : ''} />
                <span className="error-message">{errors.name}</span>
                <input type="text" name="description" placeholder="Product Description" required value={formData.description} onChange={handleChange} className={errors.description ? 'error' : ''} />
                <span className="error-message">{errors.description}</span>
                <input type="text" name="category" placeholder="Product Category" required value={formData.category} onChange={handleChange} className={errors.category ? 'error' : ''} />
                <span className="error-message">{errors.category}</span>
                <input type="number" name="price" placeholder="Product Price" required value={formData.price} onChange={handleChange} className={errors.price ? 'error' : ''} />
                <span className="error-message">{errors.price}</span>
                <input type="number" name="quantity" placeholder="Product Quantity" required value={formData.quantity} onChange={handleChange} className={errors.quantity ? 'error' : ''} />
                <span className="error-message">{errors.quantity}</span>
                <button type="submit">Add Product</button>
            </form>
            <button onClick={handleViewProducts}>View Products</button>
        </section>
    );
};

export default ProductManagement;