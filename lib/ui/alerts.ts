import Swal from 'sweetalert2';

// Toast configuration for success messages
export function toastSuccess(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#171717',
    iconColor: '#10b981',
  });
}

// Toast configuration for error messages
export function toastError(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#171717',
    iconColor: '#ef4444',
  });
}

// Toast configuration for info messages
export function toastInfo(message: string): void {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#171717',
    iconColor: '#3b82f6',
  });
}

// Confirmation dialog for dangerous actions
export async function confirmDanger(title: string, text: string): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#737373',
    background: '#ffffff',
    color: '#171717',
    iconColor: '#f59e0b',
  });
  
  return result.isConfirmed;
}

// Modal for displaying content
export async function showModal(title: string, html: string): Promise<void> {
  await Swal.fire({
    title,
    html,
    confirmButtonText: 'Close',
    confirmButtonColor: '#3b82f6',
    background: '#ffffff',
    color: '#171717',
    width: '600px',
  });
}
