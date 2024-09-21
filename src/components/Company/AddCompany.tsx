import React, { useState } from 'react';
import { Container, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CompanyForm from './CompanyForm';
import { Company } from './interface/company.interface';

const AddCompany: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: Company) => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3003/companies', values);
      navigate('/companies');
    } catch (error) {
      console.error('Error creating company:', error);
      // Handle error (e.g., show error notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="lg">
      <Title order={1} mb="xl">Add New Company</Title>
      <CompanyForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default AddCompany;