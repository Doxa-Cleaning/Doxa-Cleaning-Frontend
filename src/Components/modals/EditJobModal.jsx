export default function EditJobModal({
  selectedJobId,
  jobs,
  hanldeEditJob,
  onClose,
}) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <h2>Edit Job</h2>
        <div className="form-group">
          <label></label>
        </div>
      </div>
    </>
  );
}
