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
import { useKafkaConnectorList } from '../../../hooks/useKafkaConnector';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { KafkaConnector } from '../../../types/crds';
import { getParentClusterName } from '../../../navigation/links';

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

export const KafkaConnectorList: React.FC = () => {
  const { items, loading, error, refresh } = useKafkaConnectorList();

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
        <Typography variant="h6">Kafka Connectors</Typography>
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
              <TableCell style={styles.headerCell}>Connect Cluster</TableCell>
              <TableCell style={styles.headerCell}>Class</TableCell>
              <TableCell style={styles.headerCell} align="center">Tasks</TableCell>
              <TableCell style={styles.headerCell}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((connector: KafkaConnector) => {
              const connectName = getParentClusterName(connector.metadata.labels);
              const runningTasks = connector.status?.connectorStatus?.tasks.filter((t) => t.state === 'RUNNING').length || 0;
              const totalTasks = connector.status?.connectorStatus?.tasks.length || 0;

              return (
                <TableRow key={connector.metadata.uid} hover>
                  <TableCell style={styles.cell}>
                    <Link component={RouterLink} to={`/kafka-connectors/${connector.metadata.namespace}/${connector.metadata.name}`} style={{ fontWeight: 600 }}>
                      {connector.metadata.name}
                    </Link>
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <Chip label={connector.metadata.namespace} size="small" variant="outlined" style={styles.mono} />
                  </TableCell>
                  <TableCell style={styles.cell}>
                    {connectName ? (
                      <Link component={RouterLink} to={`/kafka-connect/${connector.metadata.namespace}/${connectName}`}>
                        {connectName}
                      </Link>
                    ) : '-'}
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <Typography variant="caption" style={{ ...styles.mono, fontSize: '0.7rem' }}>
                      {connector.spec?.class?.split('.').pop() || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell style={styles.cell} align="center">
                    <Typography style={styles.mono}>{runningTasks} / {totalTasks}</Typography>
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <StatusIndicator conditions={connector.status?.conditions} />
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
