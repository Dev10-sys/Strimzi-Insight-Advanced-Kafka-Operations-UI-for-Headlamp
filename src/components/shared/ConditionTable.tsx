import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@material-ui/core';
import { StrimziCondition } from '../../types/crds';
import { sortConditions, formatConditionDate } from '../../utils/conditions';
import { StatusIndicator } from './StatusIndicator';

interface ConditionTableProps {
  conditions?: StrimziCondition[];
  title?: string;
}

export const ConditionTable: React.FC<ConditionTableProps> = ({
  conditions = [],
}) => {
  const sortedConditions = sortConditions(conditions);

  if (!sortedConditions.length) {
    return <Typography variant="body2" color="textSecondary">No conditions found.</Typography>;
  }

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Transition</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedConditions.map((condition, index) => (
            <TableRow key={index}>
              <TableCell>{condition.type}</TableCell>
              <TableCell>
                <StatusIndicator status={condition.status} />
              </TableCell>
              <TableCell>{formatConditionDate(condition.lastTransitionTime)}</TableCell>
              <TableCell>{condition.reason || '-'}</TableCell>
              <TableCell>{condition.message || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
