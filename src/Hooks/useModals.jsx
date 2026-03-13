import { useState } from "react";

export default function useModals() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDeleteEmployeeModal, setShowDeleteEmployeeModal] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);

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
    showEditJobModal,
    setShowEditJobModal,
  };
}
