import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import LocationCityIcon from '@mui/icons-material/LocationCity';

interface UserTypeInputProps {
  control: any;
  onNext: () => void;
}

const UserTypeInput: React.FC<UserTypeInputProps> = ({ control, onNext }) => {
  return (
    <Box
      sx={{
        Width: 1024, 
        minHeight: 500, 
        margin: '50px auto', 
        padding: 6, 
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', 
      }}
    >
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Select User Type
      </Typography>
      <Controller
        name="userType"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <Box
              flexDirection="row"
              display="flex"
              gap={3} 
              justifyContent="center" 
              marginY={4} 
            >
              <Box
                onClick={() => field.onChange('student')}
                sx={{
                  padding: 4, 
                  border: field.value === 'student' ? '1px solid #3f51b5' : '1px solid #ccc',
                  backgroundColor: field.value === 'student' ? '#e3f2fd' : '#f9f9f9',
                  cursor: 'pointer',
                  textAlign: 'center',
                  width: '150px', 
                  height: '150px', 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#dceefb',
                  },
                }}
              >
                <SchoolIcon fontSize="large" sx={{ marginBottom: 1, color: field.value === 'student' ? '#3f51b5' : '#666' }} />
                <Typography>학생</Typography>
              </Box>
              <Box
                onClick={() => field.onChange('company')}
                sx={{
                  padding: 4,
                  border: field.value === 'company' ? '1px solid #3f51b5' : '1px solid #ccc',
                  backgroundColor: field.value === 'company' ? '#e3f2fd' : '#f9f9f9',
                  cursor: 'pointer',
                  textAlign: 'center',
                  width: '150px',
                  height: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#dceefb',
                  },
                }}
              >
                <BusinessIcon fontSize="large" sx={{ marginBottom: 1, color: field.value === 'company' ? '#3f51b5' : '#666' }} />
                <Typography>기업</Typography>
              </Box>
              <Box
                onClick={() => field.onChange('government')}
                sx={{
                  padding: 4,
                  border: field.value === 'government' ? '1px solid #3f51b5' : '1px solid #ccc',
                  backgroundColor: field.value === 'government' ? '#e3f2fd' : '#f9f9f9',
                  cursor: 'pointer',
                  textAlign: 'center',
                  width: '150px',
                  height: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#dceefb',
                  },
                }}
              >
                <LocationCityIcon fontSize="large" sx={{ marginBottom: 1, color: field.value === 'government' ? '#3f51b5' : '#666' }} />
                <Typography>국가기관</Typography>
              </Box>
            </Box>
            <Box
              onClick={field.value ? onNext : undefined}
              sx={{
                marginTop: 4,
                padding: 2,
                borderRadius: 1,
                border: '1px solid #ccc',
                backgroundColor: field.value ? '#3f51b5' : '#f5f5f5',
                color: field.value ? '#ffffff' : '#666',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: field.value ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: field.value ? '#303f9f' : '#f5f5f5',
                },
                width: '150px',
                margin: '0 auto', 
              }}
            >
              Next
            </Box>
          </>
        )}
      />
    </Box>
  );
};

export default UserTypeInput;
