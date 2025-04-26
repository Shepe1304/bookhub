import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = ({ size = "default", text = "" }) => {
  const sizeClass =
    {
      small: "w-6 h-6",
      default: "w-12 h-12",
      large: "w-16 h-16",
    }[size] || "w-12 h-12";

  return (
    <div className="flex flex-col items-center">
      <FaSpinner className={`animate-spin text-blue-500 ${sizeClass}`} />
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
