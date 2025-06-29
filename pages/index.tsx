import React from 'react';
import { Container, Box } from '@mui/material';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Toolbar />
      <Box sx={{ mb: 2 }}>
        <SearchBar />
      </Box>
      <DataTable />
    </Container>
  );
};

export default HomePage;
