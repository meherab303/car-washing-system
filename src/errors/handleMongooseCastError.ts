import mongoose from "mongoose";
import { TErrorSources } from "../errorInterface/errorInterface";
import { TGenericReturnError } from "../errorInterface/TgenericReturnError";

const handleMongooseCastError = (
  err: mongoose.Error.CastError,
): TGenericReturnError => {
  const statusCode = 400;
  const errorSource: TErrorSources = [
    {
      path: err?.path,
      message: `${err?.message}
     ${err?.value} is not valid id`,
    },
  ];
  return {
    statusCode,
    message: "Invalid Id",
    errorSource,
  };
};
export default handleMongooseCastError;
