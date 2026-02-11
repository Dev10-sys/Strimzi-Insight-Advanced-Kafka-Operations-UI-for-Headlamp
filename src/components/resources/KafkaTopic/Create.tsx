import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { apiFactory } from '../../../api/factory';
import { KafkaTopic } from '../../../types/crds';

const client = apiFactory.getTopicClient();

interface ConfigPair {
  key: string;
  value: string;
}

interface FormState {
  name: string;
  namespace: string;
  partitions: number;
  replicas: number;
  config: ConfigPair[];
}

interface FormErrors {
  name?: string;
  namespace?: string;
  partitions?: string;
  replicas?: string;
  config?: string;
  submit?: string;
}

export const KafkaTopicCreate: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    namespace: 'default',
    partitions: 3,
    replicas: 3,
    config: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = 'Topic name is required';
      isValid = false;
    } else if (!/^[a-z0-9.-]+$/.test(form.name)) {
      newErrors.name = 'Name must contain only lowercase alphanumeric characters, ., or -';
      isValid = false;
    }

    if (!form.namespace.trim()) {
      newErrors.namespace = 'Namespace is required';
      isValid = false;
    }

    if (form.partitions < 1) {
      newErrors.partitions = 'Partitions must be at least 1';
      isValid = false;
    }

    if (form.replicas < 1) {
      newErrors.replicas = 'Replication factor must be at least 1';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfigChange = (index: number, field: keyof ConfigPair, value: string) => {
    const newConfig = [...form.config];
    newConfig[index][field] = value;
    setForm({ ...form, config: newConfig });
  };

  const addConfig = () => {
    setForm({ ...form, config: [...form.config, { key: '', value: '' }] });
  };

  const removeConfig = (index: number) => {
    const newConfig = form.config.filter((_, i: number) => i !== index);
    setForm({ ...form, config: newConfig });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const configMap: Record<string, string> = {};
      form.config.forEach((pair: ConfigPair) => {
        if (pair.key.trim()) {
          configMap[pair.key] = pair.value;
        }
      });

      const topic: KafkaTopic = {
        apiVersion: 'kafka.strimzi.io/v1beta2',
        kind: 'KafkaTopic',
        metadata: {
          name: form.name,
          namespace: form.namespace,
          labels: {
            'strimzi.io/cluster': 'my-cluster', // Ideally this should be selectable or inferred
          },
        },
        spec: {
          partitions: Number(form.partitions),
          replicas: Number(form.replicas),
          topicName: form.name, // Explicitly set topicName to match metadata
          config: Object.keys(configMap).length > 0 ? configMap : undefined,
        },
      };

      const result = await client.create(topic, { namespace: form.namespace });

      if (result.error) {
        setErrors({ submit: result.error.message });
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Unknown error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper variant="outlined" style={{ padding: 24, maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#2c3e50' }}>
        Create Kafka Topic
      </Typography>
      <Divider style={{ marginBottom: 24 }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Metadata Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{ color: '#7f8c8d', marginBottom: 12, fontWeight: 600 }}>
              METADATA
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  size="small"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Namespace"
                  variant="outlined"
                  size="small"
                  value={form.namespace}
                  onChange={(e) => setForm({ ...form, namespace: e.target.value })}
                  error={!!errors.namespace}
                  helperText={errors.namespace}
                  required
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Configuration Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{ color: '#7f8c8d', marginTop: 12, marginBottom: 12, fontWeight: 600 }}>
              CONFIGURATION
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Partitions"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={form.partitions}
                  onChange={(e) => setForm({ ...form, partitions: parseInt(e.target.value) || 0 })}
                  error={!!errors.partitions}
                  helperText={errors.partitions || "Number of partitions for the topic"}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Replicas"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={form.replicas}
                  onChange={(e) => setForm({ ...form, replicas: parseInt(e.target.value) || 0 })}
                  error={!!errors.replicas}
                  helperText={errors.replicas || "Replication factor must not exceed available brokers"}
                  required
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Overrides Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
              <Typography variant="subtitle2" style={{ color: '#7f8c8d', fontWeight: 600 }}>
                OVERRIDES
              </Typography>
              <Button
                startIcon={<AddIcon />}
                size="small"
                onClick={addConfig}
                style={{ textTransform: 'none' }}
              >
                Add Option
              </Button>
            </Box>
            
            <Box bgcolor="#f8f9fa" p={2} borderRadius={4} border="1px solid #eee">
              {form.config.length === 0 && (
                <Typography variant="body2" color="textSecondary" align="center" style={{ padding: 16 }}>
                  No configuration overrides defined.
                </Typography>
              )}
              {form.config.map((pair: ConfigPair, index: number) => (
                <Box key={index} display="flex" mb={2} alignItems="flex-start">
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        placeholder="Key (e.g. retention.ms)"
                        size="small"
                        variant="outlined"
                        value={pair.key}
                        onChange={(e) => handleConfigChange(index, 'key', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={5}>
                       <TextField
                        fullWidth
                        placeholder="Value"
                        size="small"
                        variant="outlined"
                        value={pair.value}
                        onChange={(e) => handleConfigChange(index, 'value', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton size="small" onClick={() => removeConfig(index)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            {errors.submit && (
              <Box mb={2} p={2} bgcolor="#ffebee" color="#c62828" borderRadius={4}>
                <Typography variant="body2">Error: {errors.submit}</Typography>
              </Box>
            )}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disableElevation
              >
                {submitting ? 'Creating...' : 'Create Topic'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
