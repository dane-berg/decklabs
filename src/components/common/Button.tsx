import React from "react";

interface Inputs {
  children: string;
  classes?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent | undefined) => void;
}

const Button = ({
  children,
  classes = "btn-outline-primary",
  disabled,
  onClick,
}: Inputs) => {
  return (
    <button
      type="button"
      className={"btn text-nowrap " + classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
