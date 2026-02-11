import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  LinearProgress,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DescriptionIcon from '@material-ui/icons/Description';
import StorageIcon from '@material-ui/icons/Storage';
import GroupIcon from '@material-ui/icons/Group';
import TopicIcon from '@material-ui/icons/LibraryBooks';
import { useKafkaDetails } from '../../../hooks/useKafka';
import { useResourceList } from '../../../hooks/useResource';
import { apiFactory } from '../../../api/factory';
import { StatusIndicator } from '../../shared/StatusIndicator';
import { ConditionTable } from '../../shared/ConditionTable';
import { KafkaTopic, KafkaUser } from '../../../types/crds';

const topicClient = apiFactory.getTopicClient();
const userClient = apiFactory.getUserClient();

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Box mb={1.5}>
    <Typography variant="caption" style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography variant="body2" style={{ fontFamily: 'Consolas, Monaco, monospace', color: '#333', marginTop: 2 }}>
      {value || '-'}
    </Typography>
  </Box>
);

const SectionHeader: React.FC<{ icon: React.ReactElement; title: string }> = ({ icon, title }) => (
  <Box display="flex" alignItems="center" mb={1.5}>
    {React.cloneElement(icon, { fontSize: 'small', style: { marginRight: 8, color: '#555' } })}
    <Typography variant="subtitle2" style={{ fontWeight: 600, color: '#333' }}>
      {title}
    </Typography>
  </Box>
);

interface KafkaDetailsProps {
  namespace: string;
  name: string;
}

export const KafkaDetails: React.FC<KafkaDetailsProps> = ({ namespace, name }) => {
  const { item: kafka, loading, error } = useKafkaDetails(namespace, name);
  const [showYaml, setShowYaml] = React.useState(false);

  const relatedOptions = React.useMemo(() => ({
    namespace,
    labelSelector: `strimzi.io/cluster=${name}`,
  }), [namespace, name]);

  const { items: topics, loading: topicsLoading } = useResourceList(topicClient, relatedOptions);
  const { items: users, loading: usersLoading } = useResourceList(userClient, relatedOptions);

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error" style={{ padding: 24 }}>System Fault: {error.message}</Typography>;
  if (!kafka) return <Typography style={{ padding: 24 }}>Resource &quot;{name}&quot; not found in namespace &quot;{namespace}&quot;</Typography>;

  const replicas = kafka.spec?.kafka?.replicas || 0;
  // status and config were unused here as per lint
  const listeners = kafka.status?.listeners || [];

  return (
    <Box height="100%" display="flex" flexDirection="column" p={3} style={{ backgroundColor: '#fdfdfd' }}>
      {/* Primary Infrastructure Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" mb={0.5} style={{ gap: '8px' }}>
            <Typography variant="h5" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              {kafka.metadata?.name}
            </Typography>
            <StatusIndicator conditions={kafka.status?.conditions} />
          </Box>
          <Typography variant="caption" color="textSecondary" style={{ fontFamily: 'monospace' }}>
            ID: {kafka.status?.clusterId || 'Awaiting Provisioning'}
          </Typography>
        </Box>
        <Box display="flex" style={{ gap: '8px' }}>
           <FormControlLabel
            control={<Switch checked={showYaml} onChange={() => setShowYaml(!showYaml)} size="small" />}
            label={<Typography variant="caption">EXPOSE RAW</Typography>}
          />
        </Box>
      </Box>

      {showYaml ? (
        <Paper variant="outlined" style={{ padding: 16, backgroundColor: '#1e1e1e', color: '#d4d4d4', overflow: 'auto', flexGrow: 1 }}>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {JSON.stringify(kafka, null, 2)}
          </pre>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {/* Node 1: Spec Summary */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" style={{ padding: 20, height: '100%', borderRadius: 4 }}>
              <SectionHeader icon={<DescriptionIcon />} title="Infrastructure Spec" />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <DetailItem label="Version" value={kafka.spec?.kafka?.version} />
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Brokers" value={replicas} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Storage" value={`${kafka.spec?.kafka?.storage?.type} (${kafka.spec?.kafka?.storage?.size || 'N/A'})`} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Entity Operator" value={kafka.spec?.entityOperator ? 'Active' : 'Inactive'} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Node 2: Network Topo */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" style={{ padding: 20, height: '100%', borderRadius: 4 }}>
              <SectionHeader icon={<StorageIcon />} title="Network Topology / Listeners" />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: '#888', fontWeight: 600, fontSize: '0.7rem' }}>TYPE</TableCell>
                    <TableCell style={{ color: '#888', fontWeight: 600, fontSize: '0.7rem' }}>BOOTSTRAP ADDRESS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listeners.length > 0 ? listeners.map((l, i: number) => (
                    <TableRow key={i}>
                      <TableCell><Chip label={l.type} size="small" variant="outlined" style={{ height: 20, fontSize: '0.65rem' }} /></TableCell>
                      <TableCell style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{l.addresses?.[0]?.host || l.bootstrapServers || '-'}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center" style={{ color: '#999', padding: 20 }}>No active listeners reported</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* Node 3: Health Matrix */}
          <Grid item xs={12}>
            <Accordion variant="outlined" elevation={0} style={{ borderRadius: 4 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" style={{ fontWeight: 600 }}>Provisioning History & Conditions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box width="100%">
                  <ConditionTable conditions={kafka.status?.conditions} />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Node 4: Related Assets */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" style={{ borderRadius: 4 }}>
               <CardContent>
                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <SectionHeader icon={<TopicIcon />} title="Linked Topics" />
                    <Chip label={topics?.length || 0} size="small" style={{ borderRadius: 4 }} />
                 </Box>
                  <Box maxHeight={240} overflow="auto">
                    {topicsLoading ? <LinearProgress /> : (
                      <Table size="small">
                        <TableBody>
                          {topics && topics.length > 0 ? topics.map((topic: KafkaTopic) => (
                            <TableRow key={topic.metadata?.uid} hover>
                              <TableCell style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{topic.metadata?.name}</TableCell>
                              <TableCell align="right" style={{ fontSize: '0.8rem', color: '#666' }}>
                                {topic.spec?.partitions || '?'}P / {topic.spec?.replicas || '?'}R
                              </TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell align="center" style={{ color: '#999', padding: 16 }}>No managed topics detected</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </Box>
               </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" style={{ borderRadius: 4 }}>
               <CardContent>
                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <SectionHeader icon={<GroupIcon />} title="Provisioned Users" />
                    <Chip label={users?.length || 0} size="small" style={{ borderRadius: 4 }} />
                 </Box>
                 <Box maxHeight={240} overflow="auto">
                   {usersLoading ? <LinearProgress /> : (
                     <Table size="small">
                       <TableBody>
                         {users && users.length > 0 ? users.map((user: KafkaUser) => (
                           <TableRow key={user.metadata?.uid} hover>
                             <TableCell style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{user.metadata?.name}</TableCell>
                             <TableCell align="right">
                               <Chip 
                                 label={user.spec?.authentication?.type || 'No Auth'} 
                                 size="small" 
                                 style={{ height: 18, fontSize: '0.65rem' }} 
                               />
                             </TableCell>
                           </TableRow>
                         )) : (
                           <TableRow>
                             <TableCell align="center" style={{ color: '#999', padding: 16 }}>No ACL-managed users detected</TableCell>
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
      )}
    </Box>
  );
};
