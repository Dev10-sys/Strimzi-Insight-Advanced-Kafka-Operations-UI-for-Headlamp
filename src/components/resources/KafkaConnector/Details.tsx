import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  LinearProgress,
  Card,
  CardContent,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { useKafkaConnectorDetails } from '../../../hooks/useKafkaConnector';
import { apiFactory } from '../../../api/factory';
import { ConditionTable } from '../../shared/ConditionTable';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { getResourceStatus, getStatusColor } from '../../../utils/status';

const client = apiFactory.getConnectorClient();

export const KafkaConnectorDetails: React.FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { item: connector, loading, error, refresh } = useKafkaConnectorDetails(namespace, name);
  const [actionLoading, setActionLoading] = React.useState(false);

  const handlePause = async () => {
    setActionLoading(true);
    await client.pause(namespace, name);
    await refresh();
    setActionLoading(false);
  };

  const handleResume = async () => {
    setActionLoading(true);
    await client.resume(namespace, name);
    await refresh();
    setActionLoading(false);
  };

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  if (!connector) return <Typography>Connector not found</Typography>;

  const status = getResourceStatus(connector.status?.conditions);
  const connectorStatus = connector.status?.connectorStatus;
  const isPaused = connector.spec.pause === true || connectorStatus?.connector?.state === 'PAUSED';

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Button
            component={RouterLink}
            to="/kafka-connectors"
            startIcon={<ArrowBackIcon />}
            size="small"
            style={{ marginRight: 16 }}
          >
            Back to Connectors
          </Button>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            {connector.metadata.name}
          </Typography>
          <Box ml={2}>
            <StatusIndicator status={status} />
          </Box>
        </Box>
        <Box>
          {isPaused ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={handleResume}
              disabled={actionLoading}
              disableElevation
            >
              Resume Connector
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PauseIcon />}
              onClick={handlePause}
              disabled={actionLoading}
            >
              Pause Connector
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                CONNECTOR DETAILS
              </Typography>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Class</Typography>
                <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                  {connector.spec.class}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Max Tasks</Typography>
                <Typography variant="body1" style={{ fontWeight: 600 }}>{connector.spec.tasksMax}</Typography>
              </Box>
              {connectorStatus?.type && (
                <Box mb={2}>
                  <Typography variant="caption" color="textSecondary">Type</Typography>
                  <Box mt={0.5}>
                    <Chip label={connectorStatus.type} size="small" variant="outlined" />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
          
          <Box mt={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  TASKS ({connectorStatus?.tasks.length || 0})
                </Typography>
                <Box>
                  {connectorStatus?.tasks.map((task, idx: number) => (
                    <Box key={idx} mb={1} p={1} bgcolor="#f8f9fa" borderRadius={4} border="1px solid #eee" display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>Task #{task.id}</Typography>
                        <Typography variant="caption" color="textSecondary" style={{ fontFamily: 'monospace' }}>Worker: {task.worker_id}</Typography>
                      </Box>
                      <Chip 
                        label={task.state} 
                        size="small" 
                        style={{ 
                          height: 20, 
                          fontSize: '0.65rem', 
                          backgroundColor: getStatusColor(task.state),
                          color: '#fff'
                        }} 
                      />
                    </Box>
                  )) || <Typography variant="body2" color="textSecondary">No tasks reported</Typography>}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card variant="outlined" style={{ marginBottom: 24 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                CONDITIONS
              </Typography>
              <ConditionTable conditions={connector.status?.conditions} />
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                CONFIGURATION
              </Typography>
              <Table size="small">
                <TableBody>
                  {Object.entries(connector.spec.config || {}).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#d32f2f' }}>{key}</TableCell>
                      <TableCell style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{String(value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
