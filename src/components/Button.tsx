const Button = ({
  children,
  extraClassName,
  isDisabled,
  ...props
}: {
  children: React.ReactNode;
  extraClassName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & { [key: string]: any }) => {
  //adding testing comment
  return (
    <button
      {...props}
      className={`uppercase p-2 pb-0 border-2 border-black rounded-lg -rotate-3 bg-secondary hover:rotate-0 ${extraClassName} ${
        isDisabled ? "!bg-gray-500 hover:-rotate-3 !cursor-not-allowed" : ""
      }`}
      disabled={isDisabled}
      style={{
        boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
