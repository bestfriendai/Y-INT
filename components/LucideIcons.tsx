import { icons, LucideProps } from 'lucide-react-native';

type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
    name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
    // eslint-disable-next-line import/namespace
    const LucideIcon = icons[name as IconName] ?? icons.Info; // Fallback
    return <LucideIcon {...props} />;
};

export default Icon;
