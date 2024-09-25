// import React from 'react';
// import { Modal, Group, Button, NumberInput, TextInput, Text, Form } from '@mantine/core';
// import { FormApi } from '@mantine/form';
// import { Employee } from './types';

// interface SalaryCalculationModalProps {
//   opened: boolean;
//   onClose: () => void;
//   employee: Employee | null;
//   onSubmit: (values: typeof form.values) => void;
//   form: FormApi<typeof form.values>;
// }

// export const SalaryCalculationModal: React.FC<SalaryCalculationModalProps> = ({
//   opened,
//   onClose,
//   employee,
//   onSubmit,
//   form,
// }) => {
//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title={`Calculate Salary for ${employee?.firstName} ${employee?.lastName}`}
//       size="lg"
//     >
//       <Form onSubmit={form.onSubmit(onSubmit)}>
//         <Group grow>
//           <NumberInput
//             label="Duty Days"
//             {...form.getInputProps('dutyDone')}
//             min={0}
//             max={31}
//             required
//           />
//           <NumberInput
//             label="Advance"
//             {...form.getInputProps('advance')}
//             min={0}
//             leftSection={<Text size="xs">₹</Text>}
//           />
//         </Group>
//         <Group grow mt="sm">
//           <NumberInput
//             label="Uniform"
//             {...form.getInputProps('uniform')}
//             min={0}
//             leftSection={<Text size="xs">₹</Text>}
//           />
//           <NumberInput
//             label="Penalty"
//             {...form.getInputProps('penalty')}
//             min={0}
//             leftSection={<Text size="xs">₹</Text>}
//           />
//         </Group>
//         <Group grow mt="sm">
//           <NumberInput
//             label="Other Deductions"
//             {...form.getInputProps('otherDeductions')}
//             min={0}
//             leftSection={<Text size="xs">₹</Text>}
//           />
//           <TextInput
//             label="Other Deductions Remark"
//             {...form.getInputProps('otherDeductionsRemark')}
//           />
//         </Group>
//         <Group grow mt="sm">
//           <NumberInput
//             label="Allowance"
//             {...form.getInputProps('allowance')}
//             min={0}
//             leftSection={<Text size="xs">₹</Text>}
//           />
//           <TextInput
//             label="Allowance Remark"
//             {...form.getInputProps('allowanceRemark')}
//           />
//         </Group>
//         <Group align="right" mt="xl">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button type="submit" loading={form.isSubmitting}>
//             Calculate
//           </Button>
//         </Group>
//       </Form>
//     </Modal>
//   );
// };
const SalaryCalculationModal = {};
export default SalaryCalculationModal;