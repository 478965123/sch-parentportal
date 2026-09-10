import schooneyLogo from "@/assets/schooney-logo.png";

interface LogoBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  imgClassName?: string;
}

export const LogoBadge = ({ className = "", imgClassName = "" }: LogoBadgeProps) => {
  return (
    <div className={className}>
      <img
        src={schooneyLogo}
        alt="Schooney"
        className={imgClassName}
      />
    </div>
  );
};
