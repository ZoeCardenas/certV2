// src/utils/swal.js
import Swal from 'sweetalert2';

export const showInfo = (title, html) =>
  Swal.fire({
    title,
    html,
    icon: 'info',
    background: '#0e1b2c',
    color: '#fff',
    confirmButtonColor: '#3085d6',
  });

export const showConfirm = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    background: '#0e1b2c',
    color: '#fff',
    confirmButtonColor: '#1cc88a',
    cancelButtonColor: '#e74a3b',
  }).then(result => result.isConfirmed);

export const showSuccess = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: 'success',
    background: '#0e1b2c',
    color: '#fff',
    confirmButtonColor: '#1cc88a',
  });

export const showError = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: 'error',
    background: '#0e1b2c',
    color: '#fff',
    confirmButtonColor: '#e74a3b',
  });
