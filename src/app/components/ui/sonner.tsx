import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          color: '#1a1a1a',
          border: '1px solid #e5e7eb',
          fontSize: '14px',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        },
        className: 'sonner-toast',
        duration: 3000,
      }}
      style={{
        zIndex: 99999,
      }}
      {...props}
    />
  );
};

export { Toaster };