import React from 'react';
import { Box, Typography, Tooltip } from '@material-ui/core';
import { parseResourceStatus, ResourceState } from '../../utils/status';
import { StrimziCondition } from '../../types/crds';

interface StatusIndicatorProps {
  /** Accepts either pre-parsed state or raw conditions for auto-parsing */
  status?: ResourceState | string;
  conditions?: StrimziCondition[];
  /** If true, shows only the indicator dot */
  minimal?: boolean;
}

/**
 * Subtle status badge for enterprise-grade infrastructure views.
 * Avoids heavy backgrounds and flashy animations in favor of high-density clarity.
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  conditions, 
  minimal = false 
}: StatusIndicatorProps) => {
  // Determine state: either use conditions (preferred) or direct status string
  const statusDetail = conditions 
    ? parseResourceStatus(conditions)
    : { 
        state: status as ResourceState,
        // Fallback mapping if only string is provided
        color: status === 'Healthy' || status === 'Ready' || status === 'True' ? '#2e7d32' : 
               status === 'Degraded' ? '#ed6c02' :
               status === 'Failed' || status === 'False' ? '#d32f2f' : '#757575',
        label: (status as string) || 'Unknown'
      };

  const { color, label, message } = statusDetail;

  const content = (
    <Box display="inline-flex" alignItems="center" style={{ verticalAlign: 'middle' }}>
      <Box
        component="span"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
          marginRight: minimal ? 0 : 8,
          flexShrink: 0,
        }}
      />
      {!minimal && (
        <Typography
          variant="body2"
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#444',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );

  if (message) {
    return (
      <Tooltip title={message} arrow placement="top">
        {content}
      </Tooltip>
    );
  }

  return content;
};
