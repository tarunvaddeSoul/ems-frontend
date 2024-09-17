import { Box, Container, Center } from "@mantine/core";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Box h="100vh" bg="brandColor.0">
      <Center h="100%">
        <Container size="xl">
          <Outlet />
        </Container>
      </Center>
    </Box>
  );
};

export default AuthLayout;