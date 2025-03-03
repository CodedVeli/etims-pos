'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [items, setItems] = useState([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Calculate total whenever items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [items]);
  
  const addItem = () => {
    if (!product || !price) return;
    
    const newItem = {
      id: Date.now(),
      product,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    };
    
    setItems([...items, newItem]);
    setProduct("");
    setPrice("");
    setQuantity(1);
  };
  
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/etims/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, total }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to generate receipt');
      
      setReceipt(data);
      // Clear items after successful checkout
      setItems([]);
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* <Image 
              src="/receipt.svg" 
              alt="ETIMS Logo" 
              width={32} 
              height={32}
              className="mr-3 text-blue-600"
            /> */}
            <h1 className="text-2xl font-bold text-gray-800">ETIMS <span className="text-blue-600">Sales System</span></h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add Items</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                  placeholder="Enter product name"
                  style={{ '::placeholder': { color: '#9CA3AF' } }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
            
            <button
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition font-medium shadow-sm"
            >
              Add Item
            </button>
            
            {/* Items Table */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Current Transaction</h3>
              {items.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center rounded-md border border-dashed border-gray-300">
                  <p className="text-gray-500">No items added to this transaction</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Price</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Qty</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Subtotal</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-gray-800">{item.product}</td>
                          <td className="text-right p-3 text-gray-800">{item.price.toFixed(2)}</td>
                          <td className="text-right p-3 text-gray-800">{item.quantity}</td>
                          <td className="text-right p-3 text-gray-800 font-medium">{(item.price * item.quantity).toFixed(2)}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800 font-medium hover:underline"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Summary & Receipt */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Items Count:</span>
                  <span className="font-medium text-gray-800">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between py-2 text-xl bg-gray-50 p-2 rounded">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="font-bold text-blue-600">{total.toFixed(2)} KES</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || loading}
                className={`w-full py-3 rounded-md text-white font-bold transition shadow-sm ${
                  items.length === 0 || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span> : 
                  'Generate ETIMS Receipt'
                }
              </button>
            </div>
            
            {/* Receipt Card */}
            {receipt && (
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">ETIMS Receipt</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {receipt.status}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 border-b border-gray-100 py-2">
                    <span className="text-gray-700">Receipt ID:</span>
                    <span className="font-medium text-gray-800">{receipt.receiptId}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 border-b border-gray-100 py-2">
                    <span className="text-gray-700">Date:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(receipt.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 border-b border-gray-100 py-2">
                    <span className="text-gray-700">ETIMS Code:</span>
                    <span className="font-mono bg-gray-100 p-1 rounded text-xs text-gray-800">
                      {receipt.etimsCode}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 border-b border-gray-100 py-2">
                    <span className="text-gray-700">Total Amount:</span>
                    <span className="font-medium text-gray-800">{receipt.totalAmount.toFixed(2)} KES</span>
                  </div>
                  
                  <div className="grid grid-cols-2 py-2">
                    <span className="text-gray-700">Total Tax:</span>
                    <span className="font-medium text-gray-800">{receipt.totalTax.toFixed(2)} KES</span>
                  </div>
                </div>
                
                <button 
                  className="mt-4 w-full border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  onClick={() => window.print()}
                >
                  Print Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}