import React from 'react';
import { Container, Title } from '@mantine/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CompanyForm from './CompanyForm';

const AddCompany: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      await axios.post('http://localhost:3003/companies', values);
      // Optionally show a success notification here
      navigate('/companies/list'); // Redirect to the companies list page
    } catch (error) {
      console.error('Error creating company:', error);
      // Optionally show an error notification here
    }
  };

  return (
    <Container size="sm">
      <Title order={2} mb="xl">
        Add New Company
      </Title>
      <CompanyForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default AddCompany;