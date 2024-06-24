import { Text } from '@mantine/core';

interface LabelWithAsteriskProps {
  label: string;
  required?: boolean;
}

function LabelWithAsterisk({ label, required = false }: LabelWithAsteriskProps) {
  return (
    <Text component="span">
      {label}
      {required && <span style={{ color: 'red' }}> *</span>}
    </Text>
  );
}

export default LabelWithAsterisk