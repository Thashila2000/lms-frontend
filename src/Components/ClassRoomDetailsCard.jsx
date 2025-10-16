import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const controlOptions = [
  {
    name: "Attendance System",
    slug: "studenttracking",
    path: "studenttracking",
    color: "from-green-500 to-green-700",
  },
  {
    name: "Environmental details",
    slug: "air-quality",
    path: "airquality",
    color: "from-blue-500 to-blue-700",
  },

      
   {
    name: "Smart Control ",
    slug: "SmartControl",
    path: "smartcontrol",
    color: "from-pink-400 to-rose-500",
  },
    
    
    
];

const ClassroomDetailsCards = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleClick = (option) => {
    navigate(`/${option.path}/${slug}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {controlOptions.map((option) => (
        <motion.div
          key={option.slug}
          variants={cardVariants}
           
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
         
          onClick={() => handleClick(option)}
          className={`relative rounded-2xl shadow-lg cursor-pointer overflow-hidden p-6 sm:p-8 text-white transition-all duration-300 bg-gradient-to-br min-h-[200px] ${option.color}`}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-white opacity-10 blur-2xl"
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="relative z-10">
            <h2 className="mb-3 text-xl font-bold sm:text-2xl">
              {option.name}
            </h2>
            <p className="text-sm opacity-90 sm:text-base">
              Manage {option.name.toLowerCase()} for this classroom
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ClassroomDetailsCards;