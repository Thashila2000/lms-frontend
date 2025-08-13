import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/Admin_navbar";

const classrooms = [
  { id: 1, name: "Hall-1", image: "https://media.istockphoto.com/id/170036780/photo/large-group-of-students-at-university-amphitheatre.jpg?s=612x612&w=0&k=20&c=i8IWDCnPQzG80mnFpVWzsGoIp9vYcCVjeRrS8unikj0=" },
  { id: 2, name: "Hall-2", image: "https://static.vecteezy.com/system/resources/thumbnails/028/095/684/small_2x/spacious-lecture-hall-ai-generated-photo.jpg" },
  { id: 3, name: "Lab-2", image: "https://www.lancaster.ac.uk/media/lancaster-university/content-assets/images/facilities/conferences/ManagementSchool-Featurebox1.jpg" },
  { id: 4, name: "Hall-4", image: "https://www.lancaster.ac.uk/media/lancaster-university/content-assets/images/events/featureboxes/Howcancompaniesbeaforceforgood.PNG" },
  { id: 5, name: "Hall-5", image: "https://ol-content-api.global.ssl.fastly.net/sites/default/files/styles/scale_890_no_upsize/public/2019-09/feature-article-are-lectures-worth-attending-838x484-2018.jpg?itok=lK4kCpKm" },
  { id: 6, name: "Hall-6", image: "https://datavideo-virtualset.s3.amazonaws.com/product-image/1181/video.jpg" },
];

export default function ClassroomsPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } },
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen p-4 mt-16 ml-0 sm:p-6 md:p-8 lg:p-12 md:ml-64 bg-gradient-to-b from-gray-100 to-gray-200">
        {/* Title */}
        <motion.h1
          className="mb-8 text-3xl font-bold text-center text-gray-800 sm:mb-10 sm:text-4xl md:text-5xl md:text-left"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Classrooms
        </motion.h1>

        {/* Classroom Cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {classrooms.map((room) => (
            <motion.div
              key={room.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/classrooms/${room.id}`)}
              className="overflow-hidden transition-all duration-300 bg-white shadow-md cursor-pointer rounded-2xl hover:shadow-xl"
            >
              <div className="h-48 overflow-hidden sm:h-56 md:h-64 rounded-t-2xl">
                <motion.img
                  src={room.image}
                  alt={room.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl">{room.name}</h2>
                <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">
                  Click to view more details about {room.name}.
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
