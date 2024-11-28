import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animate, setAnimate] = useState(false);

    // Array of image URLs
    const images = [
       
        "li.jpg",
       
        "oi.jpg",
        
        "t.jpg",
        
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/products');
                if (!response.ok) {
                    throw new Error('Error fetching products: ' + response.statusText);
                }
                const productsData = await response.json();
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(true); // Start animation
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
                setAnimate(false); // Reset animation state
            }, 1000); // Match this duration with your CSS animation duration
        }, 6000); // Duration to change each image

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [images.length]);

    const calculateTotalStockValue = () => {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0).toFixed(2);
    };

    const barData = {
        labels: products.map(product => product.name),
        datasets: [
            {
                label: 'Quantity Available',
                data: products.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Total Cost',
                data: products.map(product => product.price * product.quantity),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <section style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '62vw',
            height: '100vh',
            transition: 'background-image 1s ease-in-out',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white'
        }}>
            <h2 style={{ marginTop: '20px' }}>Dashboard</h2>
            <h3>Total Stock Value: M{calculateTotalStockValue()}</h3>
            
            {/* Bar Chart Component */}
            <div style={{ width: '90%', padding: '20px' }}>
                <Bar data={barData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </div>
            
            {/* Stock Inventory Table */}
            <div style={{ width: '90%' }}>
                <h3>Stock Inventory</h3>
                <table style={{ width: '100%', marginTop: '10px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity Remaining</th>
                            <th>Price</th>
                            <th>Stock Level</th>
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
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>No Products Available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Dashboard;