// import React, { useState } from "react";
// import { useForm } from "@mantine/form";
// import {
//   TextInput,
//   Switch,
//   Button,
//   Paper,
//   Title,
//   Grid,
//   Stack,
//   Group,
//   Text,
//   NumberInput,
//   Select,
//   useMantineTheme,
//   ActionIcon,
// } from "@mantine/core";
// import {
//   Company,
//   SalaryTemplateField,
//   BasicDuty,
// } from "./interface/company.interface";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   IconGripVertical,
//   IconArrowUp,
//   IconArrowDown,
// } from "@tabler/icons-react";

// const salaryTemplateFields: SalaryTemplateField[] = [
//   { id: "name", label: "Employee Name", type: "text", required: true },
//   { id: "fatherName", label: "Father Name", type: "text" },
//   { id: "companyName", label: "Company Name", type: "text", required: true },
//   { id: "designation", label: "Designation", type: "text", required: true },
//   { id: "monthlyRate", label: "Monthly Rate", type: "number", required: true },
//   {
//     id: "basicDuty",
//     label: "Basic Duty",
//     type: "select",
//     options: Object.values(BasicDuty),
//     required: true,
//   },
//   { id: "dutyDone", label: "Duty Done", type: "number", required: true },
//   { id: "wagesPerDay", label: "Wages per Day", type: "number" },
//   { id: "basicPay", label: "Basic Pay", type: "number", required: true },
//   { id: "epfWages", label: "EPF Wages", type: "number" },
//   { id: "otherAllowance", label: "Other Allowance", type: "number" },
//   { id: "otherAllowanceRemark", label: "Other Allowance Remark", type: "text" },
//   { id: "bonus", label: "Bonus 8.33%", type: "number" },
//   { id: "grossSalary", label: "Gross Salary", type: "number", required: true },
//   { id: "pf", label: "PF 12%", type: "number", required: true },
//   { id: "esic", label: "ESIC 0.75%", type: "number", required: true },
//   { id: "advance", label: "Advance", type: "number" },
//   { id: "uniform", label: "Uniform", type: "number" },
//   { id: "advanceGivenBy", label: "Advance Given By", type: "text" },
//   { id: "penalty", label: "Penalty", type: "number" },
//   { id: "lwf", label: "LWF 10 rupees", type: "number" },
//   { id: "otherDeductions", label: "Other Deductions", type: "number" },
//   {
//     id: "otherDeductionsRemark",
//     label: "Other Deductions Remark",
//     type: "text",
//   },
//   {
//     id: "totalDeductions",
//     label: "Total Deductions",
//     type: "number",
//     required: true,
//   },
//   { id: "netSalary", label: "Net Salary", type: "number", required: true },
//   { id: "uanNumber", label: "UAN Number", type: "text" },
//   { id: "pfPaidStatus", label: "PF Paid Status", type: "text" },
//   { id: "esicNumber", label: "ESIC Number", type: "text" },
//   { id: "esicFilingStatus", label: "ESIC Filing Status", type: "text" },
// ];

// const CompanyForm = ({
//   initialValues = {},
//   onSubmit,
//   isLoading = false,
// }: any) => {
//   const theme = useMantineTheme();
//   const [fields, setFields] = useState(() => {
//     const initialFields = salaryTemplateFields.map((field) => ({
//       ...field,
//       enabled: field.required || false,
//       category: field.required ? 'required' : 'optional',
//     }));
//     return {
//       required: initialFields.filter((f) => f.category === 'required'),
//       optional: initialFields.filter((f) => f.category === 'optional'),
//     };
//   });
//   const form = useForm<Company>({
//     initialValues: {
//       name: "",
//       address: "",
//       contactPersonName: "",
//       contactPersonNumber: "",
//       salaryTemplate: Object.fromEntries(
//         salaryTemplateFields.map((field) => [
//           field.id,
//           {
//             enabled: field.required || false,
//             value: "",
//           },
//         ])
//       ) as Company["salaryTemplate"],
//       ...initialValues,
//     },
//     validate: {
//       name: (value) => (value ? null : "Company name is required"),
//       address: (value) => (value ? null : "Address is required"),
//       contactPersonName: (value) =>
//         value ? null : "Contact person name is required",
//       contactPersonNumber: (value) => {
//         if (!value) return "Contact number is required";
//         if (!/^\d{10}$/.test(value)) return "Contact number must be 10 digits";
//         return null;
//       },
//     },
//   });
//   const handleDragEnd = (result: any) => {
//     if (!result.destination) return;

//     const sourceCategory = result.source.droppableId;
//     const destCategory = result.destination.droppableId;

//     const newFields = { ...fields };
//     const [reorderedItem] = newFields[sourceCategory].splice(
//       result.source.index,
//       1
//     );
//     newFields[destCategory].splice(result.destination.index, 0, reorderedItem);

//     reorderedItem.category = destCategory;
//     setFields(newFields);
//     form.setFieldValue(
//       `salaryTemplate.${reorderedItem.id}.enabled`,
//       destCategory === "required"
//     );
//   };

//   const toggleFieldCategory = (
//     fieldId: string,
//     currentCategory: "required" | "optional"
//   ) => {
//     const newFields = { ...fields };
//     const fieldIndex = newFields[currentCategory].findIndex(
//       (f) => f.id === fieldId
//     );
//     const [movedField] = newFields[currentCategory].splice(fieldIndex, 1);

//     const newCategory =
//       currentCategory === "required" ? "optional" : "required";
//     movedField.category = newCategory;
//     newFields[newCategory].push(movedField);

//     setFields(newFields);
//     form.setFieldValue(
//       `salaryTemplate.${fieldId}.enabled`,
//       newCategory === "required"
//     );
//   };

//   const renderField = (field: any, index: any, category: any) => (
//     <Draggable key={field.id} draggableId={field.id} index={index}>
//       {(provided: any) => (
//         <Group
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           mb="xs"
//           noWrap
//         >
//           <ActionIcon {...provided.dragHandleProps}>
//             <IconGripVertical size={16} />
//           </ActionIcon>
//           <Switch
//             label={field.label}
//             checked={form.values.salaryTemplate[field.id].enabled}
//             onChange={() =>
//               form.setFieldValue(
//                 `salaryTemplate.${field.id}.enabled`,
//                 !form.values.salaryTemplate[field.id].enabled
//               )
//             }
//             styles={{ label: { flex: 1 } }}
//           />
//           <ActionIcon onClick={() => toggleFieldCategory(field.id, category)}>
//             {category === "required" ? (
//               <IconArrowDown size={16} />
//             ) : (
//               <IconArrowUp size={16} />
//             )}
//           </ActionIcon>
//         </Group>
//       )}
//     </Draggable>
//   );

//   const handleSubmit = form.onSubmit(async (values) => {
//     try {
//       await onSubmit(values);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       // Handle error (e.g., show error notification)
//     }
//   });

//   return (
//     <Paper shadow="sm" p="xl" withBorder>
//       <form onSubmit={handleSubmit}>
//         <Stack gap="xl">
//           <Title order={2}>Company Registration</Title>
//           <Grid gutter="md">
//             <Grid.Col span={6}>
//               <TextInput
//                 required
//                 label="Company Name"
//                 {...form.getInputProps("name")}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 required
//                 label="Address"
//                 {...form.getInputProps("address")}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 required
//                 label="Contact Person Name"
//                 {...form.getInputProps("contactPersonName")}
//               />
//             </Grid.Col>
//             <Grid.Col span={6}>
//               <TextInput
//                 required
//                 label="Contact Person Number"
//                 {...form.getInputProps("contactPersonNumber")}
//               />
//             </Grid.Col>
//           </Grid>

//           <Title order={2}>Salary Template Configuration</Title>
//           <Text size="sm" mb="md">
//             Customize your salary template by dragging fields between categories
//             and toggling their inclusion:
//           </Text>

//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Grid>
//               <Grid.Col span={6}>
//                 <Paper withBorder p="md" bg={theme.colors.blue[0]}>
//                   <Title order={3} mb="sm">
//                     Required Fields
//                   </Title>
//                   <Droppable droppableId="required">
//                     {(provided) => (
//                       <div {...provided.droppableProps} ref={provided.innerRef}>
//                         {fields.required.map((field, index) =>
//                           renderField(field, index, "required")
//                         )}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </Paper>
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <Paper withBorder p="md" bg={theme.colors.gray[0]}>
//                   <Title order={3} mb="sm">
//                     Optional Fields
//                   </Title>
//                   <Droppable droppableId="optional">
//                     {(provided) => (
//                       <div {...provided.droppableProps} ref={provided.innerRef}>
//                         {fields.optional.map((field, index) =>
//                           renderField(field, index, "optional")
//                         )}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </Paper>
//               </Grid.Col>
//             </Grid>
//           </DragDropContext>

//           {/* <Paper withBorder p="md" bg="gray.1">
//               <Title order={3} mb="sm">
//                 Optional Fields
//               </Title>
//               <Grid gutter="md">
//                 {salaryTemplateFields
//                   .filter((field) => !field.required)
//                   .map((field) => (
//                     <Grid.Col span={6} key={field.id}>
//                       <Group grow align="center">
//                         <Switch
//                           label={field.label}
//                           checked={form.values.salaryTemplate[field.id].enabled}
//                           onChange={(event) =>
//                             form.setFieldValue(
//                               `salaryTemplate.${field.id}.enabled`,
//                               event.currentTarget.checked
//                             )
//                           }
//                           labelPosition="left"
//                         />
//                       </Group>
//                     </Grid.Col>
//                   ))}
//               </Grid>
//             </Paper> */}
//           <Button type="submit" loading={isLoading}>
//             {initialValues.name ? "Update Company" : "Register Company"}
//           </Button>
//         </Stack>
//       </form>
//     </Paper>
//   );
// };

// export default CompanyForm;

import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Switch,
  Button,
  Paper,
  Title,
  Grid,
  Stack,
  Group,
  Text,
  NumberInput,
  Select,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import {
  IconGripVertical,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";

import {
  Company,
  SalaryTemplateField,
  BasicDuty,
} from "./interface/company.interface";

const salaryTemplateFields: SalaryTemplateField[] = [
  { id: "name", label: "Employee Name", type: "text", required: true },
  { id: "fatherName", label: "Father Name", type: "text" },
  { id: "companyName", label: "Company Name", type: "text", required: true },
  { id: "designation", label: "Designation", type: "text", required: true },
  { id: "monthlyRate", label: "Monthly Rate", type: "number", required: true },
  {
    id: "basicDuty",
    label: "Basic Duty",
    type: "select",
    options: Object.values(BasicDuty),
    required: true,
  },
  { id: "dutyDone", label: "Duty Done", type: "number", required: true },
  { id: "wagesPerDay", label: "Wages per Day", type: "number" },
  { id: "basicPay", label: "Basic Pay", type: "number", required: true },
  { id: "epfWages", label: "EPF Wages", type: "number" },
  { id: "otherAllowance", label: "Other Allowance", type: "number" },
  { id: "otherAllowanceRemark", label: "Other Allowance Remark", type: "text" },
  { id: "bonus", label: "Bonus 8.33%", type: "number" },
  { id: "grossSalary", label: "Gross Salary", type: "number", required: true },
  { id: "pf", label: "PF 12%", type: "number", required: true },
  { id: "esic", label: "ESIC 0.75%", type: "number", required: true },
  { id: "advance", label: "Advance", type: "number" },
  { id: "uniform", label: "Uniform", type: "number" },
  { id: "advanceGivenBy", label: "Advance Given By", type: "text" },
  { id: "penalty", label: "Penalty", type: "number" },
  { id: "lwf", label: "LWF 10 rupees", type: "number" },
  { id: "otherDeductions", label: "Other Deductions", type: "number" },
  {
    id: "otherDeductionsRemark",
    label: "Other Deductions Remark",
    type: "text",
  },
  {
    id: "totalDeductions",
    label: "Total Deductions",
    type: "number",
    required: true,
  },
  { id: "netSalary", label: "Net Salary", type: "number", required: true },
  { id: "uanNumber", label: "UAN Number", type: "text" },
  { id: "pfPaidStatus", label: "PF Paid Status", type: "text" },
  { id: "esicNumber", label: "ESIC Number", type: "text" },
  { id: "esicFilingStatus", label: "ESIC Filing Status", type: "text" },
];

interface CompanyFormProps {
  initialValues?: Partial<Company>;
  onSubmit: (values: Company) => Promise<void>;
  isLoading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
}) => {
  const theme = useMantineTheme();
  const [fields, setFields] = useState(() => {
    const initialFields = salaryTemplateFields.map((field) => ({
      ...field,
      enabled: field.required || false,
      category: field.required ? 'required' : 'optional',
    }));
    return {
      required: initialFields.filter((f) => f.category === 'required'),
      optional: initialFields.filter((f) => f.category === 'optional'),
    };
  });
  
  const form = useForm<Company>({
    initialValues: {
      name: "",
      address: "",
      contactPersonName: "",
      contactPersonNumber: "",
      salaryTemplate: Object.fromEntries(
        salaryTemplateFields.map((field) => [
          field.id,
          {
            enabled: field.required || false,
            value: "",
          },
        ])
      ) as Company["salaryTemplate"],
      ...initialValues,
    },
    validate: {
      name: (value) => (value ? null : "Company name is required"),
      address: (value) => (value ? null : "Address is required"),
      contactPersonName: (value) =>
        value ? null : "Contact person name is required",
      contactPersonNumber: (value) => {
        if (!value) return "Contact number is required";
        if (!/^\d{10}$/.test(value)) return "Contact number must be 10 digits";
        return null;
      },
    },
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceCategory = result.source.droppableId as "required" | "optional";
    const destCategory = result.destination.droppableId as "required" | "optional";

    const newFields = { ...fields };
    const [reorderedItem] = newFields[sourceCategory].splice(
      result.source.index,
      1
    );
    newFields[destCategory].splice(result.destination.index, 0, reorderedItem);

    reorderedItem.category = destCategory;
    setFields(newFields);
    form.setFieldValue(
      `salaryTemplate.${reorderedItem.id}.enabled`,
      destCategory === "required"
    );
  };

  const toggleFieldCategory = (
    fieldId: string,
    currentCategory: "required" | "optional"
  ) => {
    const newFields = { ...fields };
    const fieldIndex = newFields[currentCategory].findIndex(
      (f) => f.id === fieldId
    );
    const [movedField] = newFields[currentCategory].splice(fieldIndex, 1);

    const newCategory =
      currentCategory === "required" ? "optional" : "required";
    movedField.category = newCategory;
    newFields[newCategory].push(movedField);

    setFields(newFields);
    form.setFieldValue(
      `salaryTemplate.${fieldId}.enabled`,
      newCategory === "required"
    );
  };

  const renderField = (field: SalaryTemplateField, index: number, category: "required" | "optional") => (
    <Draggable key={field.id} draggableId={field.id} index={index}>
      {(provided) => (
        <Group
          ref={provided.innerRef}
          {...provided.draggableProps}
          mb="xs"
          
        >
          <ActionIcon {...provided.dragHandleProps}>
            <IconGripVertical size={16} />
          </ActionIcon>
          <Switch
            label={field.label}
            checked={form.values.salaryTemplate[field.id].enabled}
            onChange={() =>
              form.setFieldValue(
                `salaryTemplate.${field.id}.enabled`,
                !form.values.salaryTemplate[field.id].enabled
              )
            }
            styles={{ label: { flex: 1 } }}
          />
          <ActionIcon onClick={() => toggleFieldCategory(field.id, category)}>
            {category === "required" ? (
              <IconArrowDown size={16} />
            ) : (
              <IconArrowUp size={16} />
            )}
          </ActionIcon>
        </Group>
      )}
    </Draggable>
  );

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error notification)
    }
  });

  return (
    <Paper shadow="sm" p="xl" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack gap="xl">
          <Title order={2}>Company Registration</Title>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <TextInput
                required
                label="Company Name"
                {...form.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                required
                label="Address"
                {...form.getInputProps("address")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                required
                label="Contact Person Name"
                {...form.getInputProps("contactPersonName")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                required
                label="Contact Person Number"
                {...form.getInputProps("contactPersonNumber")}
              />
            </Grid.Col>
          </Grid>
          <Title order={3}>Salary Template</Title>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid>
              <Grid.Col span={6}>
                <Text>Required Fields</Text>
                <Droppable droppableId="required">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {fields.required.map((field, index) =>
                        renderField(field, index, "required")
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text>Optional Fields</Text>
                <Droppable droppableId="optional">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {fields.optional.map((field, index) =>
                        renderField(field, index, "optional")
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Grid.Col>
            </Grid>
          </DragDropContext>
          <Group gap="right" mt="md">
            <Button type="submit" loading={isLoading}>
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default CompanyForm;
