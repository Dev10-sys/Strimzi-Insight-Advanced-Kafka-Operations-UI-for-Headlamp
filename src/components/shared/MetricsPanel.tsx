import React from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@material-ui/core';

interface MetricItemProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, unit, color }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    p={2}
    border={1}
    borderColor="divider"
    borderRadius={1}
    minWidth={120}
  >
    <Typography variant="caption" color="textSecondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="h5" style={{ color: color || 'inherit', fontWeight: 'bold' }}>
      {value}
      {unit && (
        <Typography component="span" variant="body2" style={{ marginLeft: 4 }} color="textSecondary">
          {unit}
        </Typography>
      )}
    </Typography>
  </Box>
);

interface MetricsPanelProps {
  metrics: MetricItemProps[];
  title?: string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, title }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <MetricItem {...metric} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
