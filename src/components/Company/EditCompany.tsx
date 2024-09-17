import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, LoadingOverlay, Notification } from '@mantine/core';
import CompanyForm from './CompanyForm';

const EditCompanyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/companies/${id}`);
        setCompany(response.data.data);
      } catch (error) {
        console.error('Error fetching company:', error);
        // notifications.show({
        //   title: 'Error',
        //   message: 'Failed to fetch company data',
        //   color: 'red',
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:3003/companies/${id}`, values);
      // notifications.show({
      //   title: 'Success',
      //   message: 'Company updated successfully',
      //   color: 'green',
      // });
      navigate('/companies'); // Redirect to company list
    } catch (error) {
      console.error('Error updating company:', error);
      // notifications.show({
      //   title: 'Error',
      //   message: 'Failed to update company',
      //   color: 'red',
      // });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Edit Company</Title>
      {company && (
        <CompanyForm
          initialValues={company}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      )}
    </Container>
  );
};

export default EditCompanyPage;