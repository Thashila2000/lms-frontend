import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/Admin_navbar";

const classrooms = [
  { id: 1, name: "Class Room-1", slug: "class-1", image: "https://media.istockphoto.com/id/170036780/photo/large-group-of-students-at-university-amphitheatre.jpg?s=612x612&w=0&k=20&c=i8IWDCnPQzG80mnFpVWzsGoIp9vYcCVjeRrS8unikj0=" },
  { id: 2, name: "Class Room-2", slug: "class-2", image: "https://static.vecteezy.com/system/resources/thumbnails/028/095/684/small_2x/spacious-lecture-hall-ai-generated-photo.jpg" },
  { id: 3, name: "Class Room-3", slug: "class-3", image: "https://www.lancaster.ac.uk/media/lancaster-university/content-assets/images/facilities/conferences/ManagementSchool-Featurebox1.jpg" },
  { id: 4, name: "Class Room-4", slug: "class-4", image: "https://www.lancaster.ac.uk/media/lancaster-university/content-assets/images/events/featureboxes/Howcancompaniesbeaforceforgood.PNG" },
  { id: 5, name: "Class Room-5", slug: "class-5", image: "https://ol-content-api.global.ssl.fastly.net/sites/default/files/styles/scale_890_no_upsize/public/2019-09/feature-article-are-lectures-worth-attending-838x484-2018.jpg?itok=lK4kCpKm" },
  { id: 6, name: "Class Room-6", slug: "class-6", image: "https://datavideo-virtualset.s3.amazonaws.com/product-image/1181/video.jpg" },
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
      <div className="min-h-screen p-4 mt-16 sm:p-6 md:p-8 lg:p-12 sm:mt-32 md:mt-12 md:ml-64 bg-gradient-to-b from-gray-100 to-gray-200">

        <motion.h1
          className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-3xl md:text-4xl md:text-left"
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
              key={room.slug}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col overflow-hidden transition-all duration-300 bg-white shadow-md rounded-2xl hover:shadow-xl"
            >
              {/* Image */}
              <div className="overflow-hidden h-36 xs:h-40 sm:h-48 md:h-56 lg:h-64 rounded-t-2xl">
                <motion.img
                  src={room.image}
                  alt={room.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-5">
                <h2 className="text-base font-semibold text-gray-800 xs:text-lg sm:text-xl md:text-2xl">
                  {room.name}
                </h2>
                <p className="mt-1 text-xs text-gray-500 xs:text-sm sm:mt-2 sm:text-base">
                  Choose a control option for {room.name}.
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-3 sm:flex-row sm:mt-4">
                  <button
                    onClick={() => navigate(`/classrooms/${room.slug}`)}
                    className="w-full px-3 py-2 text-xs font-medium text-white transition bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    Air Quality
                  </button>
                  <button
                    onClick={() => navigate(`/light-control/${room.slug}`)}
                    className="w-full px-3 py-2 text-xs font-medium text-white transition bg-green-600 rounded-lg sm:w-auto hover:bg-green-700 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    Light Control
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
