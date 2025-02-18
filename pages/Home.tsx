import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface IconProps {
  className: string;
}

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-6">Premium Artificial Food Displays</h1>
            <p className="text-xl mb-8">Realistic food replicas for your business needs</p>
            <Link 
              to="/products" 
              className="inline-flex items-center bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              View Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <a 
                    href={`/products?category=${category.category_type.toLowerCase()}`}
                    className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                  >
                    Browse Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  {feature.icon({ className: "h-8 w-8 text-red-600" })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    name: "Japanese Cuisine",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    description: "Realistic sushi, ramen, and other Japanese dishes",
    category_type:"japanese"
  },
  {
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    description: "Mouth-watering cakes, pastries, and ice cream displays",
    category_type:"desserts"
  },
  {
    name: "Fast Food",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    description: "Burgers, pizzas, and other fast food favorites",
    category_type:"fastfood"
  },
  {
    name: "Breads",
    image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/bakery400x600.jpg",
    description: "All varieties of Breads",
    category_type:"breads"
  },
  {
    name: "Cakes",
    image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/cake.jpg",
    description: "All varieties of Cakes",
    category_type:"cakes"
  },
  {
    name: "Cookies",
    image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/cookies-more.jpg",
    description: "All varieties of Cookies",
    category_type:"cookies"
  }
  ,
  {
    name: "Carhop Trays",
    image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/carhops600x400.jpg",
    description: " Hot Dog Carhop Tray with Nachos, Popcorn ,Cola and many more  ",
    category_type:"Carhop_Trays"
  },
  // {
  //   name: "Cheese",
  //   image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/cheese600x400.jpg",
  //   description: "All varieties of Cheese",
  //   category_type:"cheeses"
  // },
  // {
  //   name: "Ice",
  //   image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/ice600-400.jpg",
  //   description: "Crushed Ice, Ice Cubes and many more",
  //   category_type:"ice"
  // },
  // {
  //   name: "Kids Education",
  //   image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/kids600-400.jpg",
  //   description: "Plastic toys and many more",
  //   category_type:"kids_education"
  // },
 
  // {
  //   name: "Baskets and Jars",
  //   image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/decor600-400.jpg",
  //   description: "Vegetable Basket , Fruit Basket and many more  ",
  //   category_type:"baskets_and_jars"
  // },
  // {
  //   name: "Green Lands",
  //   image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/garlands600-400.jpg",
  //   description: "Banana Bunch Garland , Red Onion Garland and many more  ",
  //   category_type:"green_lands"
  // },
  // {
  //   name: "Spills",
  //   image: "https://cdn11.bigcommerce.com/s-ek50668lzs/product_images/uploaded_images/spills600-400.jpg",
  //   description: "Red Snow Cone Spill , Energy Drink Spill and many more  ",
  //   category_type:"Spill"
  // }

];

const features = [
  {
    icon: (props: IconProps) => <span className={props.className}>🎨</span>,
    title: "Handcrafted Quality",
    description: "Each piece is carefully handcrafted by our skilled artisans"
  },
  {
    icon: (props: IconProps) => <span className={props.className}>✨</span>,
    title: "Realistic Appearance",
    description: "Our replicas look just like the real thing"
  },
  {
    icon: (props: IconProps) => <span className={props.className}>🔄</span>,
    title: "Custom Orders",
    description: "We can create custom displays to match your needs"
  }
];

export default Home;
