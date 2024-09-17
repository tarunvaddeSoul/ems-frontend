import React from 'react';
import { Grid, Title, Paper, Text, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconDownload, IconEye, IconFileDescription } from '@tabler/icons-react';
import { IEmployeeDocumentUploads } from './interface/employee.interface';
import { jsPDF } from 'jspdf';

interface DocumentItem {
  label: string;
  value: string;
}

interface DocumentDisplayProps {
  documents: IEmployeeDocumentUploads;
}

const DocumentCard: React.FC<DocumentItem> = ({ label, value }) => {
    const handleDownload = async () => {
        try {
          // Fetch the content from the S3 URL
          const response = await fetch(value);
          const blob = await response.blob();
    
          // Create a new jsPDF instance
          const pdf = new jsPDF();
    
          // Convert the blob to base64
          const reader = new FileReader();
          reader.onloadend = function() {
            const base64data = reader.result as string;
            
            // Add the image to the PDF
            pdf.addImage(base64data, 'JPEG', 10, 10, 190, 277);
    
            // Save the PDF
            pdf.save(`${label}.pdf`);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error downloading file:', error);
          // Handle error (e.g., show an error message to the user)
        }
      };

  const handleView = () => {
    window.open(value, '_blank');
  };

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Group gap="apart">
        <div>
          <Text size="sm" fw={500}>
            {label}
          </Text>
        </div>
        <Group>
          <Tooltip label="View">
            <ActionIcon onClick={handleView} color="blue" variant="light">
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download">
            <ActionIcon onClick={handleDownload} color="green" variant="light">
              <IconDownload size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
};

const EnhancedDocumentDisplay: React.FC<DocumentDisplayProps> = ({ documents }) => {
    const documentItems: DocumentItem[] = Object.entries(documents)
      .filter(([key, value]) => 
        value && 
        typeof value === 'string' && 
        value.trim() !== '' && 
        key !== 'id' && 
        key !== 'employeeId' && 
        key !== 'createdAt' && 
        key !== 'otherDocumentRemarks' && 
        key !== 'updatedAt'
      )
      .map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        value: value as string
      }));
  
    return (
      <div>
        <Title order={4} mb="md">Document Uploads</Title>
        <Grid>
          {documentItems.map((item, index) => (
            <Grid.Col key={index} span={6}>
              <DocumentCard label={item.label} value={item.value} />
            </Grid.Col>
          ))}
        </Grid>
        {documents.otherDocumentRemarks && (
          <Paper shadow="xs" p="md" mt="md" withBorder>
            <Group align="flex-start">
              <IconFileDescription size={24} />
              <div>
                <Text size="sm" fw={500}>Other Document Remarks</Text>
                <Text size="xs">{documents.otherDocumentRemarks}</Text>
              </div>
            </Group>
          </Paper>
        )}
      </div>
    );
  };
  
  export default EnhancedDocumentDisplay;