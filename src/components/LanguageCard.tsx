import React from 'react';
import { Theme, Box, Card, Text, Inset } from '@radix-ui/themes';
import styled from 'styled-components';
import "@radix-ui/themes/styles.css";

export interface LanguageCardProps {
  level: number;
  exam_result: string;
  exam_name: string;
  language: string;
}

type LevelColorProps = 'purple' | 'cyan' | 'crimson';

const level_to_color = (level: number): LevelColorProps =>  {
  switch (level) {
    case 1:
      return 'purple';
    case 2:
      return 'cyan';
    case 3:
      return 'crimson';
    default:
      return 'purple';
  }
};

const StyledCard = styled(Card)<{ borderColor: LevelColorProps }>`
  width: fit-content;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 2px solid ${({ borderColor }) => borderColor};
  color: ${({ borderColor }) => borderColor};
`;

const LanguageCard: React.FC<LanguageCardProps> = ({
  level,
  exam_result,
  exam_name,
  language
}) => {
  const color = level_to_color(level);

  return (
    <Theme>
      <StyledCard borderColor={color}>
        <Inset>
          <Box style={{ display: 'inline-flex', textAlign: 'center' }}>
            <Text as="div" size="4" weight="bold" style={{ color: color, fontSize: '0.6em' }}>
              {language}
            </Text>
          </Box>
        </Inset>
        <Box style={{ display: 'inline-flex', textAlign: 'center' }}>
          <Text as="p" style={{ color: color, fontSize: '1.4em', transform: 'scale(1.0, 1.2)'}}>
            <strong>{exam_name}: {exam_result}</strong>
          </Text>
        </Box>
      </StyledCard>
    </Theme>
  );
};

export default LanguageCard;
