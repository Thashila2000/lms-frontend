import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaUserPlus } from "react-icons/fa";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom"; 

export default function LandingPage() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
    }),
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const instructors = [
    { name: "Dr. Annouchka Bayley", subject: "AI & ML", image: "https://st2.depositphotos.com/2208684/5184/i/450/depositphotos_51845625-stock-photo-teacher-with-notebook.jpg" },
    { name: "Mark Dawes", subject: "UI/UX Design", image: "https://img.freepik.com/free-photo/man-working-office-with-papers-laptop-desk_1150-52082.jpg?semt=ais_hybrid&w=740&q=80" },
    { name: "Clare Brooks", subject: "Software Engineer", image: "https://t4.ftcdn.net/jpg/02/37/57/11/360_F_237571142_VA5kg8IaT9F7kaCXZ5K9vaQLbcYYioX4.jpg" },
  ];

  const testimonials = [
    "This LMS transformed how I learn — intuitive and fast!",
    "The instructors are top-notch and the content is always fresh.",
    "I love the real-time feedback and smooth scheduling tools.",
  ];

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-white via-sky-50 to-blue-100">
     {/* Navbar */}
       <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 z-50 w-full shadow-md bg-white/80 backdrop-blur-lg"
>
  <div className="flex items-center justify-between max-w-6xl px-6 py-4 mx-auto">
    
 {/* Logo Only */}
<div className="flex items-center ml-[-150px]">
  <img
    src="https://www.harlow-college.ac.uk/images/harlow_college/study-options/course-areas/bright-futures/redesign/bright-futures-logo-large-cropped.png"
    alt="Bright Futures Logo"
    className="object-contain w-auto h-10 sm:h-14"
  />
</div>
    {/* Navigation Links */}
    <nav className="hidden space-x-8 text-base font-semibold md:flex">
      {["Home", "About Us", "Courses", "Blog", "Contact"].map((item, i) => (
        <a
          key={i}
          href={"#" + item.toLowerCase().replace(" ", "")}
          className="relative text-gray-800 transition-colors group hover:text-blue-600"
        >
          {item}
          <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
      ))}
    </nav>

   {/* Login Buttons */}
<div className="flex space-x-2">
  <Link to="/login">
    <button
      className="flex items-center px-4 py-2 text-sm text-white transition-transform transform rounded bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105"
      aria-label="Lecturer Login"
    >
      <FaChalkboardTeacher className="mr-2" /> Lecturer
    </button>
  </Link>

  <Link to="/login">
    <button
      className="flex items-center px-4 py-2 text-sm text-white transition-transform transform rounded bg-gradient-to-r from-green-500 to-green-700 hover:scale-105"
      aria-label="Student Login"
    >
      <FaUserGraduate className="mr-2" /> Student
    </button>
  </Link>

  <Link to="/register">
    <button
      className="flex items-center px-4 py-2 text-sm text-white transition-transform transform rounded bg-gradient-to-r from-purple-500 to-indigo-700 hover:scale-105"
      aria-label="Register"
    >
      <FaUserPlus className="mr-2" /> Register
    </button>
  </Link>
</div>
  </div>

        </motion.header>

    {/* Hero Section */}
  <section
  id="home"
  className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 pt-20 pb-15 overflow-visible bg-neutral-100"
>
  {/* Animated Background Blobs */}
  <motion.div
    animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
    className="absolute top-0 left-0 rounded-full w-72 h-72 filter blur-3xl opacity-40"
  />
 <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: -20, x: 20 }}
  transition={{ duration: 0.8 }}
  className="relative overflow-visible"

  />

  {/* Hero Content */}
  <div className="z-10 grid items-center w-full max-w-[1600px] grid-cols-1 gap-10 mx-auto text-center md:grid-cols-2 md:text-left px-4">
    {/* Left Side: Text */}
    <div className="relative overflow-visible md:-top-30 md:left-20">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mb-4 text-4xl font-extrabold leading-[1.25] md:text-6xl md:leading-[1.3] text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600"
      >
        Learn Smarter, Dream Bigger.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-xl mb-8 text-lg text-gray-700 md:text-xl"
      >
        Join over <span className="font-semibold text-blue-600">10,000+</span> students mastering new skills, guided by top instructors and real-world learning experiences.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 md:justify-start"
      >
        <button
          className="px-8 py-3 text-lg font-semibold text-white transition-transform duration-300 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl hover:scale-105"
          aria-label="Explore Courses"
        >
          Explore Courses
        </button>
        <button
          className="px-8 py-3 text-lg font-semibold text-blue-700 transition-transform duration-300 bg-white border-2 border-blue-600 rounded-full hover:bg-blue-50 hover:scale-105"
          aria-label="Join Free"
        >
          Join Free
        </button>
      </motion.div>
    </div>

   {/* Right Side: Image */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.5, duration: 1 }}
  className="relative flex items-center justify-center md:pl-4"
>
  

  {/* Image with blend mode */}
  <img
    src="https://www.kindpng.com/picc/m/57-573808_students-png-transparent-png.png" 
    alt="Students learning"
className="object-cover w-full max-w-4xl md:max-w-[1200px] rounded-3xl hover:scale-[1.03] transition-transform duration-700"
  />

 
</motion.div>
  </div>
</section>

      {/* Featured Image Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl"
          >
            A Glimpse Into Our Learning Experience
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-gray-600"
          >
            Experience dynamic classrooms, real-time collaboration, and hands-on learning with instructors who care about your growth.
          </motion.p>
          <motion.img
           src="https://s39613.pcdn.co/wp-content/uploads/2025/04/iStock-925033026-scaled.jpg"
            alt="Learning Environment"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="object-cover w-full max-w-5xl mx-auto rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 bg-white">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-3xl font-bold text-center text-gray-900 md:text-4xl"
        >
          What Our Students Say
        </motion.h2>

        <div className="grid max-w-5xl gap-8 mx-auto md:grid-cols-3">
          {testimonials.map((text, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="p-6 text-gray-700 transition-all bg-white border border-blue-100 shadow-md rounded-3xl hover:shadow-2xl backdrop-blur-sm"
            >
              <p className="italic text-gray-600">“{text}”</p>
              <div className="mt-4 text-sm font-semibold text-blue-600">⭐ ⭐ ⭐ ⭐ ⭐</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section id="instructors" className="px-6 py-20 bg-gradient-to-b from-blue-50 to-sky-100">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 text-3xl font-bold text-center text-gray-900 md:text-4xl"
        >
          Meet Our Top Instructors
        </motion.h2>

        <div className="grid max-w-6xl gap-8 mx-auto sm:grid-cols-2 md:grid-cols-3">
          {instructors.map((inst, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden transition-all bg-white shadow-lg rounded-3xl hover:shadow-2xl"
            >
              <img
                src={inst.image}
                alt={inst.name}
                className="object-cover w-full h-56 transition-transform duration-700 hover:scale-105"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{inst.name}</h3>
                <p className="text-sm text-blue-500">{inst.subject}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
<footer className="px-6 py-10 text-gray-100 bg-gradient-to-r from-blue-700 to-indigo-700">
  <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto text-sm text-left sm:grid-cols-3">
    
    {/* Contact Info */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
      <p className="flex items-center gap-2 mb-2">
        <FaMapMarkerAlt className="text-blue-200" />
        123 Bright Lane, Colombo, Sri Lanka
      </p>
      <p className="flex items-center gap-2 mb-2">
        <FaPhoneAlt className="text-blue-200" />
        +94 77 123 4567
      </p>
      <p className="flex items-center gap-2">
        <FaEnvelope className="text-blue-200" />
        support@brightfuturelms.com
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
      <ul className="space-y-2 text-blue-100">
        <li><a href="#terms" className="hover:underline">Terms & Conditions</a></li>
        <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
        <li><a href="#newsletter" className="hover:underline">Newsletter</a></li>
      </ul>
    </div>

    {/* Social Media */}
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
      <div className="flex gap-4 text-blue-100">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <FaFacebookF />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <FaTwitter />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
          <FaLinkedin />
        </a>
      </div>
    </div>
  </div>

  {/* Bottom Line */}
  <div className="mt-10 text-xs text-center text-blue-100">
    &copy; 2025 Bright Future LMS. All rights reserved.
  </div>
</footer>



    </div>
  );
}
