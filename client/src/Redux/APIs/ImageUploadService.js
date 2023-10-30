import toast from "react-hot-toast";
import Axios from "./Axios";

const uploadImageservice = async (file, setLoading) => {
  try {
    setLoading(true);
    const { data } = await Axios.post("/upload", file);
    setLoading(false);
    toast.success("Upload file successfully");
    return data;
  } catch (error) {
    setLoading(false);
    toast.error("Error! An error occurred. Please try again later");
  }
};

export { uploadImageservice };
