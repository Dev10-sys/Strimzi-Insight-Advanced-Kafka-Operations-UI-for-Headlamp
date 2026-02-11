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
  TableHead,
  TableRow,
  Button,
  LinearProgress,
  Link,
  Card,
  CardContent,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useKafkaConnectDetails } from '../../../hooks/useKafkaConnect';
import { useResourceList } from '../../../hooks/useResource';
import { apiFactory } from '../../../api/factory';
import { ConditionTable } from '../../shared/ConditionTable';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { getResourceStatus } from '../../../utils/status';
import { KafkaConnector } from '../../../types/crds';

const connectorClient = apiFactory.getConnectorClient();

export const KafkaConnectDetails: React.FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { item: connect, loading, error } = useKafkaConnectDetails(namespace, name);

  const relatedOptions = React.useMemo(() => ({
    namespace,
    labelSelector: `strimzi.io/cluster=${name}`,
  }), [namespace, name]);

  const { items: connectors, loading: connectorsLoading } = useResourceList(connectorClient, relatedOptions);

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  if (!connect) return <Typography>Connect cluster not found</Typography>;

  const status = getResourceStatus(connect.status?.conditions);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          component={RouterLink}
          to="/kafka-connect"
          startIcon={<ArrowBackIcon />}
          size="small"
          style={{ marginRight: 16 }}
        >
          Back to Connect
        </Button>
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          {connect.metadata.name}
        </Typography>
        <Box ml={2}>
          <StatusIndicator status={status} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                CONNECT DETAILS
              </Typography>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Namespace</Typography>
                <Typography variant="body2">{connect.metadata.namespace}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Bootstrap Servers</Typography>
                <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{connect.spec.bootstrapServers}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Replicas</Typography>
                <Typography variant="body1" style={{ fontWeight: 600 }}>{connect.status?.replicas ?? 0} / {connect.spec.replicas}</Typography>
              </Box>
              {connect.status?.url && (
                <Box mb={2}>
                  <Typography variant="caption" color="textSecondary">REST API URL</Typography>
                  <Typography variant="body2" style={{ fontFamily: 'monospace' }}>{connect.status.url}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          <Box mt={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  PLUGINS
                </Typography>
                <Box maxHeight={400} overflow="auto">
                  {connect.status?.connectorPlugins?.map((plugin, idx: number) => (
                    <Box key={idx} mb={1} p={1} bgcolor="#f8f9fa" borderRadius={4} border="1px solid #eee">
                      <Typography variant="caption" style={{ color: '#666', fontWeight: 'bold' }}>{plugin.type}</Typography>
                      <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                        {plugin.class}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">Version: {plugin.version}</Typography>
                    </Box>
                  )) || <Typography variant="body2" color="textSecondary">No plugins found</Typography>}
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
              <ConditionTable conditions={connect.status?.conditions} />
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="textSecondary">
                  MANAGED CONNECTORS
                </Typography>
                <Chip label={connectors?.length || 0} size="small" />
              </Box>
              <Box>
                {connectorsLoading ? <LinearProgress /> : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {connectors?.map((connector: KafkaConnector) => (
                        <TableRow key={connector.metadata.uid}>
                          <TableCell style={{ fontFamily: 'monospace' }}>
                            <Link component={RouterLink} to={`/kafka-connectors/${connector.metadata.namespace}/${connector.metadata.name}`}>
                              {connector.metadata.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Chip label={connector.status?.connectorStatus?.type || 'unknown'} size="small" variant="outlined" style={{ height: 20, fontSize: '0.65rem' }} />
                          </TableCell>
                          <TableCell>
                            <StatusIndicator status={getResourceStatus(connector.status?.conditions)} />
                          </TableCell>
                        </TableRow>
                      ))}
                      {!connectors?.length && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography variant="body2" color="textSecondary" style={{ padding: 16 }}>No connectors found for this cluster</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
