import { useNavigate, useParams } from "react-router-dom";
import StudentTeacherBatch from "./../../components/StudentTeacherBatch";

const AddTeacherAndAdmin = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();

  function goBack(e) {
    navigate(-1);
  }

  return (
    <div>
      {/* <Button onClick={(e) => goBack(e)}>go back</Button> */}

      <StudentTeacherBatch></StudentTeacherBatch>
    </div>
  );
};

export default AddTeacherAndAdmin;
