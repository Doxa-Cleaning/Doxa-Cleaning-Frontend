import { useState } from "react";

function useModals() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDeleteEmployeeModal, setShowDeleteEmployeeModal] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  return {
    showJobModal,
    setShowJobModal,
    showDeleteJobModal,
    setShowDeleteJobModal,
    showEmployeeModal,
    setShowEmployeeModal,
    showDeleteEmployeeModal,
    setShowDeleteEmployeeModal,
    showEmployeeList,
    setShowEmployeeList,
  };
}

export default useModals;
