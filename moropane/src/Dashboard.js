import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Load products from local storage
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(storedProducts);

        // Load transactions from local storage
        const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
        setTransactions(storedTransactions);
    }, []);

    const calculateSoldStock = (product) => {
        return product.quantity < 20 ? 20 - product.quantity : 0;
    };

    // Calculate total price of all available stock
    const calculateTotalStockValue = () => {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0).toFixed(2); // Fixed to two decimal points
    };

    return (
        <section>
            <h2>Dashboard</h2>

            {/* Total stock value */}
            <h3>Total Stock Value: M{calculateTotalStockValue()}</h3>

            {/* Product Table */}
            <h3>Product Inventory</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Remaining</th>
                        <th>Price</th>
                        <th>Stock Level</th>
                        <th>Sold Stock</th>
                        <th>Sold Products</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>M{product.price.toFixed(2)}</td>
                                <td>{product.quantity < 5 ? "Low Stock" : "Available"}</td>
                                <td>{calculateSoldStock(product)}</td>
                                <td>{calculateSoldStock(product) > 0 ? "Yes" : "No"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>No Products Available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Transaction Table */}
            <h3>Transaction History</h3>
            <table>
                <thead>
                    <tr>
                        <th>Stock Name</th>
                        <th>Quantity Changed</th>
                        <th>Action</th>
                        <th>Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.productName}</td>
                                <td>{transaction.quantityChanged}</td>
                                <td>{transaction.action === 'add' ? "Added" : "Deducted"}</td>
                                <td>{transaction.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No Transactions Available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default Dashboard;