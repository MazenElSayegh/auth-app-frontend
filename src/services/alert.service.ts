import Swal from "sweetalert2";

export const AlertService = {
  success: (title: string, message?: string) => {
    Swal.fire({
      icon: "success",
      title,
      text: message || "",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      width: "300px",
    });
  },
  error: (title: string, errorMessage: string | null) => {
    Swal.fire({
      icon: "error",
      title,
      text: errorMessage || "Unexpected error, please try again.",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      width: "300px",
    });
  },
};
