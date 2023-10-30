import { Toaster } from "react-hot-toast";

export default function ToasterContainer() {
  return (
    <Toaster
      position="bottom-left"
      reverseOrder={false}
      gutter={8}
      toastOptions={{ duration: 2000 }}
    />
  );
}
