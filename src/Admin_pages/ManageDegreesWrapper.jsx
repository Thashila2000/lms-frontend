import React from "react";
import { CategoryProvider } from "../Context/CategoryContext";
import ManageDegreesInner from "./ManageDegreesInner";

const ManageDegreesWrapper = () => (
  <CategoryProvider>
    <ManageDegreesInner />
  </CategoryProvider>
);

export default ManageDegreesWrapper;