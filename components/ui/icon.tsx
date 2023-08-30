import dynamic from 'next/dynamic'
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { IconProps } from '@/types/globals';
import { useMemo } from 'react';


const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = useMemo(() => dynamic(dynamicIconImports[name]), [])

  return <LucideIcon {...props} />;
};

export default Icon;