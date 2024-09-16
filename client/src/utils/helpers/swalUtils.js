import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showAlert = (title, text, icon, time) => {
  const timer = time || 1500;
  MySwal.fire({
    title,
    text,
    icon,
    showConfirmButton: false,
    timer: timer,
  });
};

export const showDeleteConfirmation = (
  title,
  text,
  icon,
  confirmButtonText,
  cancelButtonText,
  onConfirm
) => {
  MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || "Yes, delete it!",
    cancelButtonText: cancelButtonText || "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      MySwal.fire({
        title: "Đã xóa!",
        text: "Mục đã được xóa thành công.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
};
