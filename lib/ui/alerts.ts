import Swal from 'sweetalert2';

export function toastSuccess(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#151d2e',
    color: '#f1f5f9',
    iconColor: '#34d399',
  });
}

export function toastError(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: '#151d2e',
    color: '#f1f5f9',
    iconColor: '#f87171',
  });
}

export function toastInfo(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#151d2e',
    color: '#f1f5f9',
    iconColor: '#818cf8',
  });
}

export async function confirmDanger(title: string, text: string): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#f87171',
    cancelButtonColor: '#475569',
    background: '#151d2e',
    color: '#f1f5f9',
    iconColor: '#fbbf24',
  });

  return result.isConfirmed;
}

export async function showModal(title: string, html: string): Promise<void> {
  await Swal.fire({
    title,
    html,
    confirmButtonText: 'Close',
    confirmButtonColor: '#818cf8',
    background: '#151d2e',
    color: '#f1f5f9',
    width: '600px',
  });
}
