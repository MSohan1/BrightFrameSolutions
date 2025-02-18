import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-3xl font-bold mb-6">About Bright Frame Solutions Pvt Ltd</h1>
          <p className="text-gray-600 mb-6">
          Bright Frame Solutions Pvt Ltd proudly stands as a pioneer in India, introducing innovative and creative display products
          that redefine the art of presentation. From artificial cakes, burgers, and ice creams to a wide range of customized food display
          products, we specialize in catering to bakery shops, burger shops, and other food outlets looking to create eye-catching and unique 
          displays.

          </p>
          <p className="text-gray-600 mb-6">
          As the first company in India to offer such revolutionary solutions, we are excited to announce that our products are now available across all states in India. We understand the unique needs of businesses, 
          and our team is dedicated to providing customized solutions based on customer requirements,
          ensuring that each display aligns perfectly with your brand’s vision.
          </p>

          <p className="text-gray-600 mb-6">
          Whether you run a bakery, a burger shop, or any food-related business, our high-quality
          and visually stunning products will help you stand out in a competitive market and 
          leave a lasting impression on your customers.
          </p>

          <p className="text-gray-600 mb-6">
          Partner with Bright Frame Solutions Pvt Ltd today,
          and let us help you take your displays to the next level—tailored just for your business!

        </p>
        {/* 
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-red-600 mb-2">25+</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-red-600 mb-2">10k+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
          */}
        </div>
        
      {/*  <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
            alt="Our Workshop"
            className="rounded-lg shadow-lg"
          />
        </div>
        */}

<div className="relative">
  <video 
    controls 
    className="rounded-lg shadow-lg" 
    src="./src/assets/Advt.mp4" 
    // alt="Our Workshop"
  >
    Your browser does not support the video tag.
  </video>
</div>
      </div>

      {/* Our Process */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {process.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600 font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
        {/* Company Owner Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-20">
        <div className="relative flex justify-center items-center">
          <img 
            src="./src/assets/Profile2.jpeg" 
            alt="Company Owner" 
            className="rounded-lg shadow-lg h-80 w-auto"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Prasad Kamlikar</h2>
          <h3 className="text-xl text-gray-700">Managing Director & CEO</h3>
          <p className="text-gray-600 mt-4">
          Prasad Kamlikar is the Managing Director and CEO of Bright Frame Solutions Pvt Ltd. With an MBA qualification and over 14 years of experience across various industries, he has a strong background in business development, operations, and strategic 
          management. His leadership drives innovation and excellence in the display products industry, ensuring that Bright Frame Solutions stands out in the market.
          </p>
        </div>
      </div>
    </div>
  );
}

const process = [
  {
    title: "Design & Planning",
    description: "We work closely with you to understand your needs and create detailed designs."
  },
  {
    title: "Handcrafting",
    description: "Our skilled artisans carefully create each piece using premium materials."
  },
  {
    title: "Quality Check",
    description: "Every item undergoes rigorous quality checks before shipping."
  }
];

export default About;