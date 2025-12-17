// src/components/UI/Icon.tsx
import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconName, icons } from '../../utils/icons';

interface IconProps extends Omit<FontAwesomeIconProps, 'icon'> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  return <FontAwesomeIcon icon={icons[name]} {...props} />;
};