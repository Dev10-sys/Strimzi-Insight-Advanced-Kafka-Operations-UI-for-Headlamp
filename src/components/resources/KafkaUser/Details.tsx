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
  Paper,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SecurityIcon from '@material-ui/icons/Security';
import { useKafkaUserDetails } from '../../../hooks/useKafkaUser';
import { apiFactory } from '../../../api/factory';
import { ConditionTable } from '../../shared/ConditionTable';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { makeKafkaUrl, getParentClusterName } from '../../../navigation/links';

const userClient = apiFactory.getUserClient();

export const KafkaUserDetails: React.FC = () => {
  const { namespace = '', name = '' } = useParams<{ namespace: string; name: string }>();
  const { item: user, loading, error, refresh } = useKafkaUserDetails(namespace, name);
  const [actionLoading, setActionLoading] = React.useState(false);

  const handleRegenerate = async () => {
    if (!window.confirm('Trigger Strimzi credential rotation for this user? This will re-issue secrets.')) return;
    setActionLoading(true);
    try {
      if (!namespace || !name) return;
      await userClient.regenerateCredentials(namespace, name);
      await refresh();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error" style={{ padding: 24 }}>Fault: {error.message}</Typography>;
  if (!user) return <Typography style={{ padding: 24 }}>User Resource Not Found</Typography>;

  const clusterName = getParentClusterName(user.metadata?.labels);
  // status was unused

  return (
    <Box p={3} style={{ backgroundColor: '#fdfdfd', height: '100%' }}>
      {/* Header Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" style={{ gap: '16px' }}>
          <Button
            component={RouterLink}
            to="/kafka-users"
            startIcon={<ArrowBackIcon />}
            size="small"
            style={{ color: '#666', textTransform: 'none' }}
          >
            Users
          </Button>
          <Box>
            <Box display="flex" alignItems="center" style={{ gap: '8px' }}>
              <Typography variant="h5" style={{ fontWeight: 700 }}>{user.metadata?.name}</Typography>
              <StatusIndicator conditions={user.status?.conditions} />
            </Box>
            <Typography variant="caption" color="textSecondary" style={{ fontFamily: 'monospace' }}>
              NS: {user.metadata?.namespace}
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RotateLeftIcon />}
          onClick={handleRegenerate}
          disabled={actionLoading}
          style={{ textTransform: 'none', fontWeight: 600, borderRadius: 4 }}
        >
          Rotate Credentials
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Identity Pane */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" style={{ padding: 20, borderRadius: 4 }}>
            <Box display="flex" alignItems="center" mb={2} color="#555">
              <SecurityIcon fontSize="small" style={{ marginRight: 8 }} />
              <Typography variant="subtitle2" style={{ fontWeight: 600 }}>Security Identity</Typography>
            </Box>
            
            {[
              { label: 'Authentication', value: <Chip label={user.spec?.authentication?.type || 'none'} size="small" /> },
              { label: 'Associated Cluster', value: clusterName ? (
                  <Link component={RouterLink} to={makeKafkaUrl(user.metadata.namespace || '', clusterName)} style={{ fontWeight: 600 }}>
                    {clusterName}
                  </Link>
                ) : 'standalone' 
              },
              { label: 'Secret Store', value: user.status?.secret || 'pending' },
              { label: 'Username', value: user.status?.username || '-' },
            ].map((item, idx) => (
              <Box key={idx} mb={idx === 3 ? 0 : 2}>
                <Typography variant="caption" style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>
                  {item.label}
                </Typography>
                <Box mt={0.5} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {item.value}
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Permissions Pane */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined" style={{ borderRadius: 4, marginBottom: 16 }}>
            <CardContent>
              <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: 12, display: 'block' }}>
                Access Control Matrix (ACLs)
              </Typography>
              {user.spec?.authorization?.acls ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: '#888', fontSize: '0.7rem', fontWeight: 700 }}>RESOURCE</TableCell>
                      <TableCell style={{ color: '#888', fontSize: '0.7rem', fontWeight: 700 }}>OPERATION</TableCell>
                      <TableCell style={{ color: '#888', fontSize: '0.7rem', fontWeight: 700 }}>HOST</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.spec.authorization.acls.map((acl: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            <span style={{ color: '#888' }}>{acl.resource.type}:</span> {acl.resource.name || '*'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={acl.operation} size="small" style={{ height: 18, fontSize: '0.6rem', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {acl.host || '*'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Box py={3} textAlign="center">
                  <Typography variant="body2" color="textSecondary">No ACLs defined for this identity.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" style={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: 12, display: 'block' }}>
                Condition Log
              </Typography>
              <ConditionTable conditions={user.status?.conditions} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
