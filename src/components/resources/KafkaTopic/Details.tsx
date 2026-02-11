import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  LinearProgress,
  Link,
  Card,
  CardContent,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useKafkaTopicDetails } from '../../../hooks/useKafkaTopic';
import { ConditionTable } from '../../shared/ConditionTable';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { getResourceStatus } from '../../../utils/status';
import { makeKafkaUrl, getParentClusterName } from '../../../navigation/links';

export const KafkaTopicDetails: React.FC = () => {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { item: topic, loading, error } = useKafkaTopicDetails(namespace, name);

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  if (!topic) return <Typography>Topic not found</Typography>;

  const clusterName = getParentClusterName(topic.metadata.labels);
  const status = getResourceStatus(topic.status?.conditions);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          component={RouterLink}
          to="/kafka-topics"
          startIcon={<ArrowBackIcon />}
          size="small"
          style={{ marginRight: 16 }}
        >
          Back to Topics
        </Button>
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          {topic.metadata.name}
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
                TOPIC DETAILS
              </Typography>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Namespace</Typography>
                <Typography variant="body2">{topic.metadata.namespace}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Associated Cluster</Typography>
                <Box>
                  {clusterName ? (
                    <Link component={RouterLink} to={makeKafkaUrl(topic.metadata.namespace, clusterName)}>
                      {clusterName}
                    </Link>
                  ) : <Typography variant="body2">-</Typography>}
                </Box>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Partitions</Typography>
                <Typography variant="body1" style={{ fontWeight: 600 }}>{topic.spec.partitions}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary">Replication Factor</Typography>
                <Typography variant="body1" style={{ fontWeight: 600 }}>{topic.spec.replicas}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card variant="outlined" style={{ marginBottom: 24 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                CONDITIONS
              </Typography>
              <ConditionTable conditions={topic.status?.conditions} />
            </CardContent>
          </Card>

          {topic.spec.config && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  CONFIGURATION OVERRIDES
                </Typography>
                <Table size="small">
                  <TableBody>
                    {Object.entries(topic.spec.config).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#d32f2f' }}>{key}</TableCell>
                        <TableCell style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{String(value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
