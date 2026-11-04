const variantStyles = {
  default: "bg-surface border border-gray-100 shadow-sm",
  gold: "bg-accent text-white hover:bg-accent/90",
  interactive:
    "bg-surface border border-gray-200/80 shadow-sm hover:border-accent hover:shadow-md cursor-pointer transition-all duration-200",
  danger:
    "bg-danger/5 border border-danger/20 text-danger shadow-sm hover:bg-danger/10 hover:border-danger/40 transition-all duration-200",
};

const sizeStyles = {
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

const Card = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const classes = [
    "rounded-2xl",
    variantStyles[variant] || variantStyles.default,
    sizeStyles[size] || sizeStyles.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className = "", ...props }) => (
  <div
    className={`flex items-start justify-between gap-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Title = ({ children, className = "", ...props }) => (
  <h3 className={`text-base font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

Card.Description = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

Card.Content = ({ children, className = "", ...props }) => (
  <div className={`mt-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = "", ...props }) => (
  <div
    className={`mt-4 flex items-center justify-between border-t border-gray-100 pt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
