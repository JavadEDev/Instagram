'use client';

import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

type VariantTypes =
  | 'solid'
  | 'shadow'
  | 'flat'
  | 'bordered'
  | 'light'
  | 'faded'
  | 'ghost'
  | undefined;

type colorTypes = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type sizeTypes = 'sm' | 'md' | 'lg';
type radiusTypes = 'none' | 'sm' | 'md' | 'lg' | 'full';
type isIconType = boolean;
const Submit = ({
  label,
  variant,
  color,
  size,
  radius,
  isIconOnly,
  ...btnProps
}: {
  label: any;
  variant: VariantTypes;
  color: colorTypes;
  size: sizeTypes;
  radius: radiusTypes;
  isIconOnly?: isIconType;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      {...btnProps}
      color={color}
      isIconOnly={isIconOnly}
      isLoading={pending}
      radius={radius}
      size={size}
      type="submit"
      variant={variant}
    >
      {label}
    </Button>
  );
};

export default Submit;
