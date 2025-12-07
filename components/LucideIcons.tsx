import { icons } from 'lucide-react-native';

const Icon = ({ name, color, size }: { name: string; color: string; size: number }) => {
    const LucideIcon = icons[name as keyof typeof icons] || icons.Info; // Fallback
    return <LucideIcon color={color} size={size} />;
};

export default Icon;
