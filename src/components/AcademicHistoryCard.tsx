import React from 'react';
import { Theme, Card, Text, Inset, Box, Flex } from '@radix-ui/themes';
import styled, { css } from 'styled-components';

export interface AcademicHistoryCardProps {
  degree: string;
  faculty: string;
  school_name: string;
  start_date: string;
  end_date: string;
  status: 'Graduated' | 'In Progress' | 'Withdrawn';
  logo?: string;
}

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 480px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const StatusText = styled(Text)<{ status: 'Graduated' | 'In Progress' | 'Withdrawn' }>`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.76em;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #ecf0f1;
  ${({ status }) =>
    status === 'Graduated' && css`color: indigo;`}
  ${({ status }) =>
    status === 'In Progress' && css`color: jade;`}
  ${({ status }) =>
    status === 'Withdrawn' && css`color: tomato;`}
`;

const AcademicHistoryCard: React.FC<AcademicHistoryCardProps> = ({
  degree,
  faculty,
  school_name,
  start_date,
  end_date,
  status,
  logo,
}) => (

    <StyledCard>
      <Inset clip="padding-box" side="left" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
        {logo && (
          <Box style={{ width: '100%', height: '100%' }}>
            <img
              src={logo}
              alt={`${school_name} logo`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
      </Inset>
      <StatusText status={status}>
        {status}
      </StatusText>

      <Box style={{ flex: 1 }}>
        <Flex direction="column">
          <Text size="5" weight="bold" style={{ color: '#2c3e50', fontSize: '1.5em' }}>
            {school_name}
          </Text>
          <Text size="4" style={{ color: '#34495e', fontStyle: 'italic', fontSize: '1.1em' }}>
            {degree} in {faculty}
          </Text>
          <Text size="3" style={{ color: '#7f8c8d', fontSize: '0.9em' }}>
            {new Date(start_date).toLocaleDateString()} - {end_date ? new Date(end_date).toLocaleDateString() : 'Present'}
          </Text>
        </Flex>
      </Box>
    </StyledCard>

);

export default AcademicHistoryCard;
