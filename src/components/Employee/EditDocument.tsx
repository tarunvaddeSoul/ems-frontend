import React, { useState } from 'react';
import { Group, Text, Paper, FileInput, ActionIcon, Anchor, Button } from '@mantine/core';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';

interface DocumentUploadProps {
  label: string;
  value: string | null;
  onChange: (value: File | null) => void;
  onRemove: () => void;
}

export function DocumentUpload({ label, value, onChange, onRemove }: DocumentUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName(null);
      onChange(null);
    }
  };

  return (
    <Paper p="xs" withBorder>
      <Group align="apart" mb="xs">
        <Text size="sm" fw={500}>{label}</Text>
        {value && (
          <Button
            size="xs"
            color="red"
            variant="light"
            // compact
            onClick={() => { setFileName(null); onRemove(); }}
            rightSection={<IconX size={14} />}
          >
            Remove File
          </Button>
        )}
      </Group>

      {value ? (
        <Anchor
          href={typeof value === 'string' ? value : '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => !value && e.preventDefault()} // Prevent invalid link
        >
          <Group gap="xs">
            <IconFile size={16} />
            <Text size="sm">{fileName || "View Document"}</Text>
          </Group>
        </Anchor>
      ) : (
        <FileInput
          placeholder="Upload document"
          accept="image/png,image/jpeg,application/pdf"
          leftSection={<IconUpload size={14} />}
          onChange={handleFileChange}
        />
      )}
    </Paper>
  );
}
