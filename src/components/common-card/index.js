import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const CommonCard = ({
  title,
  skills,
  footerContent,
  location,
  description,
  status,
  id,
  interviewDate,
}) => {
  return (
    <Card className="bg-white border border-gray-100 rounded-xl shadow-sm mt-3 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="p-0 space-y-3">
        {title && (
          <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-1">
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className="text-sm text-gray-600 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0 mt-4 space-y-2">
        {skills && (
          <div className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Skills: </span>
            {skills}
          </div>
        )}
        {location && (
          <div className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Location: </span>
            {location}
          </div>
        )}
        {status === "Selected" &&  (
          interviewDate && (
            <div className="text-sm text-gray-700">
            <Link
              href={{ pathname: "/interview", query: { id } }}
              className={`rounded-md text-lg p-2 ${
                interviewDate && new Date(interviewDate) <= new Date()
                  ? "bg-gray-900 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-none"
              }`}
            >
              Join Interview
            </Link>
          </div>
          )
        )}

        {interviewDate && (
          <div className="text-sm text-gray-700 ">
            <span className="font-medium text-gray-900 ">
              Interview Date:{" "}
              {new Date(interviewDate).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        )}
      </CardContent>
      {footerContent && (
        <CardFooter className="p-0 mt-5">
          <div className="w-full">{footerContent}</div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommonCard;
