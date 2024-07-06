import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Title,
  ActionIcon,
  Group,
  Text,
  Button,
  Modal,
  TextInput,
  Pagination,
  Select,
} from "@mantine/core";
import { IconEdit, IconEye, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import ViewCompanyInPDF from "./ViewCompanyInPDF";
import ViewCompanyInExcel from "./ViewCompanyInExcel";
import { Company, CompanySearchParams } from "./interface/company.interface";

const ListCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [searchParams, setSearchParams] = useState<CompanySearchParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, [searchParams]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3003/companies",
        { params: searchParams }
      );
      setCompanies(response.data.data.companies);
      setTotalPages(Math.ceil(response.data.data.total / 10));
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setViewModalOpened(true);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchParams({ ...searchParams, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handleDownloadPDF = async () => {
    if (selectedCompany) {
      const blob = await pdf(
        <ViewCompanyInPDF company={selectedCompany} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `company_${selectedCompany.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadExcel = () => {
    if (selectedCompany) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([
        ViewCompanyInExcel(selectedCompany),
      ]);
      XLSX.utils.book_append_sheet(wb, ws, "Company");
      XLSX.writeFile(wb, `company_${selectedCompany.id}.xlsx`);
    }
  };
  const handleEdit = (id: string) => {
    navigate(`/companies/edit/${id}`);
  };
  const rows = companies.map((company) => (
    <Table.Tr key={company.id}>
      <Table.Td>{company.name}</Table.Td>
      <Table.Td>{company.address}</Table.Td>
      <Table.Td>{company.contactPersonName}</Table.Td>
      <Table.Td>{company.contactPersonNumber}</Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => handleView(company)}
        >
          <IconEye size="1rem" />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="blue"
          onClick={() => handleEdit(company.id)}
        >
          <IconEdit size="1rem" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Companies</Title>
      </Group>

      <form onSubmit={handleSearch}>
        <Group mb="md">
          <TextInput
            placeholder="Search companies"
            value={searchParams.searchText || ""}
            onChange={(e) =>
              setSearchParams({ ...searchParams, searchText: e.target.value })
            }
            rightSection={<IconSearch size="1rem" />}
          />
          <Button type="submit">Search</Button>
        </Group>
      </form>

      <Table.ScrollContainer minWidth={500}>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          horizontalSpacing="xl"
          verticalSpacing="md"
        >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Contact Person</Table.Th>
            <Table.Th>Contact Number</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group justify="center" mt="xl">
        <Pagination
          total={totalPages}
          value={searchParams.page}
          onChange={handlePageChange}
        />
      </Group>

      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title="Company Details"
      >
        {selectedCompany && (
          <>
            <Text>Name: {selectedCompany.name}</Text>
            <Text>Address: {selectedCompany.address}</Text>
            <Text>Contact Person: {selectedCompany.contactPersonName}</Text>
            <Text>Contact Number: {selectedCompany.contactPersonNumber}</Text>
            <Group mt="md">
              <Button onClick={handleDownloadPDF}>Download PDF</Button>
              <Button onClick={handleDownloadExcel}>Download Excel</Button>
            </Group>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default ListCompanies;
