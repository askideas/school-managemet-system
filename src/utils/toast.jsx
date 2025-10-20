import { toast } from 'react-toastify'
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react'
import React from 'react'

const ToastContent = ({ icon, message, onClose }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
    {icon}
    <span style={{ flex: 1 }}>{message}</span>
    <button className="toast-close-btn" onClick={onClose}>
      <X size={16} />
    </button>
  </div>
)

export const showSuccessToast = (message) => {
  toast.dismiss() // Clear any existing toasts
  
  toast.success(
    ({ closeToast }) => (
      <ToastContent
        // icon={<CheckCircle size={18} />}
        message={message}
        onClose={closeToast}
      />
    ),
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  )
}

export const showErrorToast = (message) => {
  toast.dismiss() // Clear any existing toasts
  
  toast.error(
    ({ closeToast }) => (
      <ToastContent
        icon={<X size={18} />}
        message={message}
        onClose={closeToast}
      />
    ),
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  )
}

export const showWarningToast = (message) => {
  toast.dismiss() // Clear any existing toasts
  
  toast.warning(
    ({ closeToast }) => (
      <ToastContent
        icon={<AlertTriangle size={18} />}
        message={message}
        onClose={closeToast}
      />
    ),
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  )
}

export const showInfoToast = (message) => {
  toast.dismiss() // Clear any existing toasts
  
  toast.info(
    ({ closeToast }) => (
      <ToastContent
        icon={<Info size={18} />}
        message={message}
        onClose={closeToast}
      />
    ),
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  )
}
