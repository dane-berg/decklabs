import React, { ReactNode } from "react";

interface Inputs {
  children: ReactNode;
  dismissible?: boolean;
  onClose?: (event: React.MouseEvent) => void;
}

const Alert = ({ children, dismissible = true, onClose }: Inputs) => {
  return (
    <div
      className={
        "alert alert-warning fade show " +
        (dismissible ? "alert-dismissible" : null)
      }
      role="alert"
    >
      {children}
      {dismissible ? (
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onClose}
        ></button>
      ) : null}
    </div>
  );
};

export default Alert;
