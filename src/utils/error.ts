export type ApiError = {
  response: {
    data: {
      message: string;
    };
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as ApiError;
    return err.response?.data?.message ?? "Something went wrong";
  }
  return "Something went wrong!!";
};
