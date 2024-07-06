import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Title, Paper, LoadingOverlay, Text } from "@mantine/core";
import axios from "axios";
import CompanyForm from "./CompanyForm";
import { Company } from "./interface/company.interface";

const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3003/companies/${id}`
        );
        setCompany(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to fetch company data. Please try again.");
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleSubmit = async (values: Company) => {
    try {
      setLoading(true);
      const editData = {
        name: values.name,
        address: values.address,
        contactPersonName: values.contactPersonName,
        contactPersonNumber: values.contactPersonNumber,
        presentDaysCount: values.presentDaysCount,
        PF: values.PF,
        ESIC: values.ESIC,
        BONUS: values.BONUS,
        LWF: values.LWF,
        otherAllowance: values.otherAllowance,
        otherAllowanceRemark: values.otherAllowanceRemark,
      };
      await axios.put(`http://localhost:3003/companies/${id}`, editData);
      navigate("/companies/list"); // Redirect to the companies list page
    } catch (err) {
      console.error("Error updating company:", err);
      setError("Failed to update company. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="sm">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="sm">
        <Paper p="xl" withBorder>
          <Text c="red">{error}</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <Title order={2} mb="xl">
        Edit Company
      </Title>
      {company && (
        <CompanyForm onSubmit={handleSubmit} initialValues={company} />
      )}
    </Container>
  );
};

export default EditCompany;
