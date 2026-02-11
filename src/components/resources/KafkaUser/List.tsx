import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Link,
  LinearProgress,
  Chip,
  IconButton,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useKafkaUserList } from '../../../hooks/useKafkaUser';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { makeKafkaUrl, getParentClusterName } from '../../../navigation/links';
import { KafkaUser } from '../../../types/crds';

const styles = {
  headerCell: {
    fontWeight: 600,
    color: '#6c757d',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  cell: {
    fontSize: '0.875rem',
  },
  mono: {
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: '0.85rem',
  },
};

export const KafkaUserList: React.FC = () => {
  const { items, loading, error, refresh } = useKafkaUserList();

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Kafka Users</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={() => refresh()} size="small" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      
      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={styles.headerCell}>Name</TableCell>
              <TableCell style={styles.headerCell}>Namespace</TableCell>
              <TableCell style={styles.headerCell}>Cluster</TableCell>
              <TableCell style={styles.headerCell}>Authentication</TableCell>
              <TableCell style={styles.headerCell}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((user: KafkaUser) => {
              const clusterName = getParentClusterName(user.metadata.labels);

              return (
                <TableRow key={user.metadata.uid} hover>
                  <TableCell style={styles.cell}>
                    <Typography style={{ fontWeight: 600 }}>{user.metadata.name}</Typography>
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <Chip label={user.metadata.namespace} size="small" variant="outlined" style={styles.mono} />
                  </TableCell>
                  <TableCell style={styles.cell}>
                    {clusterName ? (
                      <Link component={RouterLink} to={makeKafkaUrl(user.metadata.namespace, clusterName)}>
                        {clusterName}
                      </Link>
                    ) : '-'}
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <Chip label={user.spec.authentication.type} size="small" style={{ fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <StatusIndicator conditions={user.status?.conditions} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
