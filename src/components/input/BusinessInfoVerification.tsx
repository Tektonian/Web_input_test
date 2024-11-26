import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

interface BusinessInfoVerificationProps {
  businessNumber: string;
  onNext: () => void;
}

const BusinessInfoVerification: React.FC<BusinessInfoVerificationProps> = ({ businessNumber, onNext }) => {
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 비즈니스 정보 가져오기
    const fetchBusinessInfo = async () => {
      setLoading(true);
      try {
        // 여기서 외부 API 호출을 수행합니다
        const response = await fetch(`https://api.example.com/business/${businessNumber}`);
        const data = await response.json();
        setBusinessInfo(data);
      } catch (err) {
        setError("Failed to fetch business information");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [businessNumber]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Business Information
      </Typography>
      {businessInfo ? (
        <Box>
          <Typography variant="body1">Company Name: {businessInfo.companyName}</Typography>
          <Typography variant="body1">Address: {businessInfo.address}</Typography>
          <Typography variant="body1">CEO: {businessInfo.ceo}</Typography>
          <Button variant="contained" color="primary" onClick={onNext} sx={{ mt: 2 }}>
            Confirm and Continue
          </Button>
        </Box>
      ) : (
        <Typography>No information available</Typography>
      )}
    </Box>
  );
};

export default BusinessInfoVerification;
