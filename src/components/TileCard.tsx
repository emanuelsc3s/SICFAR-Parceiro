import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface TileCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const TileCard = ({ title, description, icon: Icon, gradient = false, disabled = false, onClick }: TileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`tile-card p-6 transition-all duration-300 ${
        isHovered && !disabled ? 'hero-gradient scale-105' : ''
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full relative z-10">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
          isHovered && !disabled ? 'bg-white/20' : 'bg-primary/10'
        }`}>
          <Icon className={`h-6 w-6 transition-all duration-300 ${
            isHovered && !disabled ? 'text-white' : 'text-primary'
          }`} />
        </div>

        <h3 className={`font-semibold text-lg mb-2 transition-all duration-300 ${
          isHovered && !disabled ? 'text-white' : 'text-foreground'
        }`}>
          {title}
        </h3>

        <p className={`text-sm flex-1 transition-all duration-300 ${
          isHovered && !disabled ? 'text-white/80' : 'text-muted-foreground'
        }`}>
          {description}
        </p>
      </div>
    </Card>
  );
};

export default TileCard;