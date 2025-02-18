// import React, { useState } from 'react';
// import { Filter, ShoppingCart } from 'lucide-react';

// const FakeFruits = () => {
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   const filteredProducts = selectedCategory === 'all' 
//     ? products 
//     : products.filter(product => product.category === selectedCategory);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Hero Section */}
//       <div className="relative h-[400px] mb-12 rounded-xl overflow-hidden">
//         <div 
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage: 'url("https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")',
//           }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//         </div>
//         <div className="relative h-full flex items-center justify-center">
//           <div className="text-center text-white px-4">
//             <h1 className="text-5xl font-bold mb-4">Artificial Fruits</h1>
//             <p className="text-xl">Lifelike fruit replicas for stunning displays</p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//         <div className="flex items-center mb-4 md:mb-0">
//           <Filter className="h-5 w-5 mr-2" />
//           <span className="font-medium">Filter by:</span>
//           <select 
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="ml-4 p-2 border rounded-md"
//           >
//             <option value="all">All Fruits</option>
//             <option value="tropical">Tropical Fruits</option>
//             <option value="berries">Berries</option>
//             <option value="citrus">Citrus</option>
//             <option value="common">Common Fruits</option>
//           </select>
//         </div>
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
//             <div className="relative overflow-hidden">
//               <img 
//                 src={product.image} 
//                 alt={product.name}
//                 className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
//               />
//               {product.bestseller && (
//                 <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
//                   Bestseller
//                 </div>
//               )}
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
//               <p className="text-gray-600 mb-4">{product.description}</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-xl font-bold text-red-600">${product.price}</span>
//                 <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center">
//                   <ShoppingCart className="h-5 w-5 mr-2" />
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Benefits Section */}
//       <div className="mt-16 bg-gray-50 rounded-xl p-8">
//         <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Artificial Fruits?</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {benefits.map((benefit, index) => (
//             <div key={index} className="text-center">
//               <div className="text-4xl mb-4">{benefit.icon}</div>
//               <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
//               <p className="text-gray-600">{benefit.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const products = [
//   {
//     id: 1,
//     name: "Artificial Red Apple",
//     description: "Realistic red apple replica, perfect for displays",
//     price: 12.99,
//     category: "common",
//     bestseller: true,
//     image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
//   },
//   {
//     id: 2,
//     name: "Artificial Banana Bunch",
//     description: "Lifelike bunch of bananas",
//     price: 24.99,
//     category: "tropical",
//     bestseller: false,
//     image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
//   },
//   {
//     id: 3,
//     name: "Artificial Strawberries",
//     description: "Set of realistic strawberries",
//     price: 18.99,
//     category: "berries",
//     bestseller: true,
//     image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
//   },
//   {
//     id: 4,
//     name: "Artificial Orange",
//     description: "Realistic orange with detailed texture",
//     price: 14.99,
//     category: "citrus",
//     bestseller: false,
//     image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
//   },
//   {
//     id: 5,
//     name: "Artificial Mango",
//     description: "Lifelike mango replica",
//     price: 16.99,
//     category: "tropical",
//     bestseller: false,
//     image: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
//   },
//   {
//     id: 6,
//     name: "Artificial Blueberries",
//     description: "Set of realistic blueberries",
//     price: 19.99,
//     category: "berries",
//     bestseller: false,
//     image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
//   }
// ];

// const benefits = [
//   {
//     icon: "🎨",
//     title: "Handcrafted Quality",
//     description: "Each fruit is meticulously crafted by skilled artisans"
//   },
//   {
//     icon: "✨",
//     title: "Long-Lasting",
//     description: "Made with durable materials that maintain their appearance"
//   },
//   {
//     icon: "🎯",
//     title: "True-to-Life",
//     description: "Incredibly realistic appearance and texture"
//   }
// ];

// export default FakeFruits;