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
  Button,
  Chip,
  IconButton,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useKafkaList } from '../../../hooks/useKafka';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { Kafka } from '../../../types/crds';

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
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  mono: {
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '0.85rem',
  },
  resourceName: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
};

export const KafkaList: React.FC = () => {
  const { items, loading, error, refresh } = useKafkaList();

  if (error) {
    return (
      <Box p={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <ErrorOutlineIcon style={{ fontSize: 48, color: '#f44336', marginBottom: 16 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load Kafka clusters
        </Typography>
        <Typography color="textSecondary" style={{ marginBottom: 24 }}>
          {error.message}
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => refresh()} startIcon={<RefreshIcon />}>
          Retry Connection
        </Button>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar style={{ justifyContent: 'space-between', minHeight: 56, paddingLeft: 16, paddingRight: 16 }}>
        <Typography variant="h6" component="h2">
          Kafka Clusters
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={() => refresh()} size="small" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      
      {loading && <LinearProgress style={{ width: '100%' }} />}

      <TableContainer style={{ flexGrow: 1 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell style={styles.headerCell}>Name</TableCell>
              <TableCell style={styles.headerCell}>Namespace</TableCell>
              <TableCell style={styles.headerCell} align="center">Brokers</TableCell>
              <TableCell style={styles.headerCell}>Version</TableCell>
              <TableCell style={styles.headerCell}>Status</TableCell>
              <TableCell style={styles.headerCell}>Cluster ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ padding: 32 }}>
                  <Typography color="textSecondary">No Kafka clusters found</Typography>
                </TableCell>
              </TableRow>
            )}
            
            {items?.map((kafka: Kafka) => {
              const version = kafka.spec?.kafka?.version || 'Default';
              const replicas = kafka.spec?.kafka?.replicas ?? 0;
              const clusterId = kafka.status?.clusterId;

              return (
                <TableRow key={kafka.metadata.uid} hover>
                  <TableCell style={styles.cell}>
                    <Link
                      component={RouterLink}
                      to={`/kafka/${kafka.metadata.namespace}/${kafka.metadata.name}`}
                      color="primary"
                      style={styles.resourceName}
                    >
                      {kafka.metadata.name}
                    </Link>
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <Chip 
                      label={kafka.metadata.namespace} 
                      size="small" 
                      variant="outlined" 
                      style={styles.mono}
                    />
                  </TableCell>
                  <TableCell style={styles.cell} align="center">
                    <Typography style={styles.mono}>{replicas}</Typography>
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" style={{ marginRight: 8 }}>{version}</Typography>
                      {kafka.spec?.zookeeper && (
                         <Chip label="ZK" size="small" style={{ height: 20, fontSize: '0.65rem' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell style={styles.cell}>
                    <StatusIndicator conditions={kafka.status?.conditions} />
                  </TableCell>
                  <TableCell style={styles.cell}>
                     <Typography
                       variant="caption"
                       color="textSecondary"
                       style={{ ...styles.mono, display: 'block', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}
                       title={clusterId}
                     >
                       {clusterId || '-'}
                     </Typography>
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
