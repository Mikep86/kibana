/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

jest.mock('../epm/packages');

import type { PackagePolicy, RegistryDataStream } from '../../types';

import type { DataStreamMeta } from './package_policies_to_agent_permissions';
import {
  ELASTIC_CONNECTORS_INDEX_PERMISSIONS,
  getDataStreamPrivileges,
  storedPackagePoliciesToAgentPermissions,
  UNIVERSAL_PROFILING_PERMISSIONS,
} from './package_policies_to_agent_permissions';

const packageInfoCache = new Map();
packageInfoCache.set('test_package-0.0.0', {
  name: 'test_package',
  version: '0.0.0',
  latestVersion: '0.0.0',
  release: 'experimental',
  format_version: '1.0.0',
  title: 'Test Package',
  description: '',
  icons: [],
  owner: { github: '' },
  status: 'not_installed',
  assets: {
    kibana: {
      csp_rule_template: [],
      dashboard: [],
      visualization: [],
      search: [],
      index_pattern: [],
      map: [],
      lens: [],
      security_ai_prompt: [],
      security_rule: [],
      ml_module: [],
      tag: [],
      osquery_pack_asset: [],
      osquery_saved_query: [],
    },
    elasticsearch: {
      component_template: [],
      ingest_pipeline: [],
      ilm_policy: [],
      transform: [],
      index_template: [],
      data_stream_ilm_policy: [],
      ml_model: [],
    },
  },
  data_streams: [
    {
      type: 'logs',
      dataset: 'some-logs',
      title: '',
      release: '',
      package: 'test_package',
      path: '',
      ingest_pipeline: '',
      streams: [{ input: 'test-logs', title: 'Test Logs', template_path: '' }],
    },
    {
      type: 'metrics',
      dataset: 'some-metrics',
      title: '',
      release: '',
      package: 'test_package',
      path: '',
      ingest_pipeline: '',
      streams: [{ input: 'test-metrics', title: 'Test Logs', template_path: '' }],
    },
  ],
});
packageInfoCache.set('osquery_manager-0.3.0', {
  format_version: '1.0.0',
  name: 'osquery_manager',
  title: 'Osquery Manager',
  version: '0.3.0',
  license: 'basic',
  description:
    'Centrally manage osquery deployments, run live queries, and schedule recurring queries',
  type: 'integration',
  release: 'beta',
  categories: ['security', 'os_system', 'config_management'],
  icons: [
    {
      src: '/img/logo_osquery.svg',
      title: 'logo osquery',
      size: '32x32',
      type: 'image/svg+xml',
    },
  ],
  owner: { github: 'elastic/integrations' },
  readme: '/package/osquery_manager/0.3.0/docs/README.md',
  data_streams: [
    {
      dataset: 'osquery_manager.result',
      package: 'osquery_manager',
      ingest_pipeline: 'test',
      path: 'result',
      streams: [],
      title: 'Osquery Manager queries',
      type: 'logs',
      release: 'experimental',
    },
  ],
  latestVersion: '0.3.0',
  notice: undefined,
  status: 'not_installed',
  assets: {
    kibana: {
      csp_rule_template: [],
      dashboard: [],
      visualization: [],
      search: [],
      index_pattern: [],
      map: [],
      lens: [],
      security_ai_prompt: [],
      security_rule: [],
      ml_module: [],
      tag: [],
      osquery_pack_asset: [],
      osquery_saved_query: [],
    },
    elasticsearch: {
      component_template: [],
      ingest_pipeline: [],
      ilm_policy: [],
      transform: [],
      index_template: [],
      data_stream_ilm_policy: [],
      ml_model: [],
    },
  },
});
packageInfoCache.set('profiler_symbolizer-8.8.0-preview', {
  format_version: '2.7.0',
  name: 'profiler_symbolizer',
  title: 'Universal Profiling Symbolizer',
  version: '8.8.0-preview',
  license: 'basic',
  description:
    ' Fleet-wide, whole-system, continuous profiling with zero instrumentation. Symbolize native frames.',
  type: 'integration',
  release: 'beta',
  categories: ['monitoring', 'elastic_stack'],
  icons: [
    {
      src: '/img/logo_profiling_symbolizer.svg',
      title: 'logo symbolizer',
      size: '32x32',
      type: 'image/svg+xml',
    },
  ],
  owner: { github: 'elastic/profiling' },
  data_streams: [],
  latestVersion: '8.8.0-preview',
  notice: undefined,
  status: 'not_installed',
  assets: {
    kibana: {
      csp_rule_template: [],
      dashboard: [],
      visualization: [],
      search: [],
      index_pattern: [],
      map: [],
      lens: [],
      security_ai_prompt: [],
      security_rule: [],
      ml_module: [],
      tag: [],
      osquery_pack_asset: [],
      osquery_saved_query: [],
    },
    elasticsearch: {
      component_template: [],
      ingest_pipeline: [],
      ilm_policy: [],
      transform: [],
      index_template: [],
      data_stream_ilm_policy: [],
      ml_model: [],
    },
  },
});
packageInfoCache.set('profiler_collector-8.9.0-preview', {
  format_version: '2.7.0',
  name: 'profiler_collector',
  title: 'Universal Profiling Collector',
  version: '8.9.0-preview',
  license: 'basic',
  description:
    'Fleet-wide, whole-system, continuous profiling with zero instrumentation. Collect profiling data.',
  type: 'integration',
  release: 'beta',
  categories: ['monitoring', 'elastic_stack'],
  icons: [
    {
      src: '/img/logo_profiling_symbolizer.svg',
      title: 'logo symbolizer',
      size: '32x32',
      type: 'image/svg+xml',
    },
  ],
  owner: { github: 'elastic/profiling' },
  data_streams: [],
  latestVersion: '8.9.0-preview',
  notice: undefined,
  status: 'not_installed',
  assets: {
    kibana: {
      csp_rule_template: [],
      dashboard: [],
      visualization: [],
      search: [],
      index_pattern: [],
      map: [],
      lens: [],
      security_ai_prompt: [],
      security_rule: [],
      ml_module: [],
      tag: [],
      osquery_pack_asset: [],
      osquery_saved_query: [],
    },
    elasticsearch: {
      component_template: [],
      ingest_pipeline: [],
      ilm_policy: [],
      transform: [],
      index_template: [],
      data_stream_ilm_policy: [],
      ml_model: [],
    },
  },
});

packageInfoCache.set('apm-8.9.0-preview', {
  format_version: '2.7.0',
  name: 'apm',
  title: 'APM',
  version: '8.9.0-preview',
  license: 'basic',
  description: 'APM Server integration',
  type: 'integration',
  release: 'beta',
  categories: ['observability'],
  icons: [],
  owner: { github: 'elastic/apm-server' },
  data_streams: [],
  latestVersion: '8.9.0-preview',
  status: 'not_installed',
  assets: {
    kibana: {
      csp_rule_template: [],
      dashboard: [],
      visualization: [],
      search: [],
      index_pattern: [],
      map: [],
      lens: [],
      security_ai_prompt: [],
      security_rule: [],
      ml_module: [],
      tag: [],
      osquery_pack_asset: [],
      osquery_saved_query: [],
    },
    elasticsearch: {
      component_template: [],
      ingest_pipeline: [],
      ilm_policy: [],
      transform: [],
      index_template: [],
      data_stream_ilm_policy: [],
      ml_model: [],
    },
  },
});

packageInfoCache.set('elastic_connectors-1.0.0', {
  format_version: '2.7.0',
  name: 'elastic_connectors',
  title: 'Elastic Connectors',
  version: '1.0.0',
  license: 'basic',
  description: 'Sync data from source to the Elasticsearch index.',
  type: 'integration',
  release: 'beta',
  categories: ['connector'],
  icons: [],
  owner: { github: 'elastic/ingestion-team' },
  data_streams: [],
  latestVersion: '1.0.0',
  status: 'not_installed',
  assets: {
    kibana: {
      csp_rule_template: [],
      dashboard: [],
      visualization: [],
      search: [],
      index_pattern: [],
      map: [],
      lens: [],
      security_ai_prompt: [],
      security_rule: [],
      ml_module: [],
      tag: [],
      osquery_pack_asset: [],
      osquery_saved_query: [],
    },
    elasticsearch: {
      component_template: [],
      ingest_pipeline: [],
      ilm_policy: [],
      transform: [],
      index_template: [],
      data_stream_ilm_policy: [],
      ml_model: [],
    },
  },
});

describe('storedPackagePoliciesToAgentPermissions()', () => {
  it('Returns `undefined` if there are no package policies', async () => {
    const permissions = await storedPackagePoliciesToAgentPermissions(packageInfoCache, 'test', []);
    expect(permissions).toBeUndefined();
  });

  it('Throw an error if package policies is not an array', () => {
    expect(() =>
      storedPackagePoliciesToAgentPermissions(packageInfoCache, 'test', undefined)
    ).toThrow(/storedPackagePoliciesToAgentPermissions should be called with a PackagePolicy/);
  });

  it('Returns the default permissions if a package policy does not have a package', () => {
    expect(() =>
      storedPackagePoliciesToAgentPermissions(packageInfoCache, 'test', [
        { name: 'foo', package: undefined } as PackagePolicy,
      ])
    ).toThrow(/No package for package policy foo/);
  });

  it('Returns the permissions for the enabled inputs', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: 'test',
        enabled: true,
        package: { name: 'test_package', version: '0.0.0', title: 'Test Package' },
        inputs: [
          {
            type: 'test-logs',
            enabled: true,
            streams: [
              {
                id: 'test-logs',
                enabled: true,
                data_stream: { type: 'logs', dataset: 'some-logs' },
              },
            ],
          },
          {
            type: 'test-metrics',
            enabled: false,
            streams: [
              {
                id: 'test-logs',
                enabled: false,
                data_stream: { type: 'metrics', dataset: 'some-metrics' },
              },
            ],
          },
        ],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );
    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        indices: [
          {
            names: ['logs-some-logs-test'],
            privileges: ['auto_configure', 'create_doc'],
          },
        ],
      },
    });
  });

  it('Add additional_datastream_permissions', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: 'test',
        enabled: true,
        package: { name: 'test_package', version: '0.0.0', title: 'Test Package' },
        inputs: [
          {
            type: 'test-logs',
            enabled: true,
            streams: [
              {
                id: 'test-logs',
                enabled: true,
                data_stream: { type: 'logs', dataset: 'some-logs' },
              },
            ],
          },
          {
            type: 'test-metrics',
            enabled: false,
            streams: [
              {
                id: 'test-logs',
                enabled: false,
                data_stream: { type: 'metrics', dataset: 'some-metrics' },
              },
            ],
          },
        ],
        additional_datastreams_permissions: ['logs-test-default', 'metrics-test-default'],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );
    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        indices: [
          {
            names: ['logs-some-logs-test'],
            privileges: ['auto_configure', 'create_doc'],
          },
          {
            names: ['logs-test-default', 'metrics-test-default'],
            privileges: ['auto_configure', 'create_doc'],
          },
        ],
      },
    });
  });

  it('Returns the dataset for the compiled data_streams', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: 'test',
        enabled: true,
        package: { name: 'test_package', version: '0.0.0', title: 'Test Package' },
        inputs: [
          {
            type: 'test-logs',
            enabled: true,
            streams: [
              {
                id: 'test-logs',
                enabled: true,
                data_stream: { type: 'logs', dataset: 'some-logs' },
                compiled_stream: { data_stream: { dataset: 'compiled' } },
              },
            ],
          },
        ],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );
    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        indices: [
          {
            names: ['logs-compiled-test'],
            privileges: ['auto_configure', 'create_doc'],
          },
        ],
      },
    });
  });

  it('Returns the cluster privileges if there is one in the package policy', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: 'test',
        enabled: true,
        package: { name: 'test_package', version: '0.0.0', title: 'Test Package' },
        elasticsearch: {
          privileges: {
            cluster: ['monitor'],
          },
        },
        inputs: [
          {
            type: 'test-logs',
            enabled: true,
            streams: [
              {
                id: 'test-logs',
                enabled: true,
                data_stream: { type: 'logs', dataset: 'some-logs' },
                compiled_stream: { data_stream: { dataset: 'compiled' } },
              },
            ],
          },
        ],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );
    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        indices: [
          {
            names: ['logs-compiled-test'],
            privileges: ['auto_configure', 'create_doc'],
          },
        ],
        cluster: ['monitor'],
      },
    });
  });

  it('Returns the dataset for osquery_manager package', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: 'test',
        enabled: true,
        package: { name: 'osquery_manager', version: '0.3.0', title: 'Test Package' },
        inputs: [
          {
            type: 'osquery_manager',
            enabled: true,
            streams: [
              {
                id: 'test-logs',
                enabled: true,
                data_stream: { type: 'logs', dataset: 'some-logs' },
                compiled_stream: { data_stream: { dataset: 'compiled' } },
              },
            ],
          },
        ],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );
    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        indices: [
          {
            names: ['logs-osquery_manager.result-test'],
            privileges: ['auto_configure', 'create_doc'],
          },
        ],
      },
    });
  });

  it('Returns the Universal Profiling permissions for profiler_symbolizer package', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: '',
        enabled: true,
        package: { name: 'profiler_symbolizer', version: '8.8.0-preview', title: 'Test Package' },
        inputs: [
          {
            type: 'pf-elastic-symbolizer',
            enabled: true,
            streams: [],
          },
        ],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );

    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        indices: [
          {
            names: ['profiling-*'],
            privileges: UNIVERSAL_PROFILING_PERMISSIONS,
          },
        ],
      },
    });
  });
  it('Returns the Universal Profiling permissions for profiler_collector package', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: '',
        enabled: true,
        package: { name: 'profiler_collector', version: '8.9.0-preview', title: 'Test Package' },
        inputs: [
          {
            type: 'pf-elastic-collector',
            enabled: true,
            streams: [],
          },
        ],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );

    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        indices: [
          {
            names: ['profiling-*'],
            privileges: UNIVERSAL_PROFILING_PERMISSIONS,
          },
        ],
      },
    });
  });

  it('returns the correct permissions for the APM package', async () => {
    const packagePolicies: PackagePolicy[] = [
      {
        id: 'package-policy-uuid-test-123',
        name: 'test-policy',
        namespace: '',
        enabled: true,
        package: { name: 'apm', version: '8.9.0-preview', title: 'Test Package' },
        inputs: [
          {
            type: 'pf-elastic-collector',
            enabled: true,
            streams: [],
          },
        ],
        created_at: '',
        updated_at: '',
        created_by: '',
        updated_by: '',
        revision: 1,
        policy_id: '',
        policy_ids: [''],
      },
    ];

    const permissions = await storedPackagePoliciesToAgentPermissions(
      packageInfoCache,
      'test',
      packagePolicies
    );

    expect(permissions).toMatchObject({
      'package-policy-uuid-test-123': {
        cluster: ['cluster:monitor/main'],
        indices: [
          {
            names: ['traces-*', 'logs-*', 'metrics-*'],
            privileges: ['auto_configure', 'create_doc'],
          },
          {
            names: ['traces-apm.sampled-*'],
            privileges: ['auto_configure', 'create_doc', 'maintenance', 'monitor', 'read'],
          },
        ],
      },
    });
  });
});

describe('getDataStreamPrivileges()', () => {
  it('returns defaults for a datastream with no privileges', () => {
    const dataStream = { type: 'logs', dataset: 'test' } as RegistryDataStream;
    const privileges = getDataStreamPrivileges(dataStream);

    expect(privileges).toMatchObject({
      names: ['logs-test-*'],
      privileges: ['auto_configure', 'create_doc'],
    });
  });

  it('adds the namespace to the index name', () => {
    const dataStream = { type: 'logs', dataset: 'test' } as RegistryDataStream;
    const privileges = getDataStreamPrivileges(dataStream, 'namespace');

    expect(privileges).toMatchObject({
      names: ['logs-test-namespace'],
      privileges: ['auto_configure', 'create_doc'],
    });
  });

  it('appends a wildcard if dataset is prefix', () => {
    const dataStream = {
      type: 'logs',
      dataset: 'test',
      dataset_is_prefix: true,
    } as RegistryDataStream;
    const privileges = getDataStreamPrivileges(dataStream, 'namespace');

    expect(privileges).toMatchObject({
      names: ['logs-test.*-namespace'],
      privileges: ['auto_configure', 'create_doc'],
    });
  });

  it('prepends a dot if datastream is hidden', () => {
    const dataStream = {
      type: 'logs',
      dataset: 'test',
      hidden: true,
    } as DataStreamMeta;
    const privileges = getDataStreamPrivileges(dataStream, 'namespace');

    expect(privileges).toMatchObject({
      names: ['.logs-test-namespace'],
      privileges: ['auto_configure', 'create_doc'],
    });
  });

  it('uses custom privileges if they are present in the datastream', () => {
    const dataStream = {
      type: 'logs',
      dataset: 'test',
      elasticsearch: {
        privileges: { indices: ['read', 'monitor'] },
      },
    } as DataStreamMeta;
    const privileges = getDataStreamPrivileges(dataStream, 'namespace');

    expect(privileges).toMatchObject({
      names: ['logs-test-namespace'],
      privileges: ['read', 'monitor'],
    });
  });

  it('sets a wildcard namespace when dynamic_namespace: true', () => {
    const dataStream = {
      type: 'logs',
      dataset: 'test',
      elasticsearch: {
        dynamic_namespace: true,
      },
    } as DataStreamMeta;
    const privileges = getDataStreamPrivileges(dataStream, 'namespace');

    expect(privileges).toMatchObject({
      names: ['logs-test-*'],
      privileges: ['auto_configure', 'create_doc'],
    });
  });

  it('sets a wildcard dataset when dynamic_dataset: true', () => {
    const dataStream = {
      type: 'logs',
      dataset: 'test',
      elasticsearch: {
        dynamic_dataset: true,
      },
    } as DataStreamMeta;
    const privileges = getDataStreamPrivileges(dataStream, 'namespace');

    expect(privileges).toMatchObject({
      names: ['logs-*-namespace'],
      privileges: ['auto_configure', 'create_doc'],
    });
  });

  it('sets a wildcard namespace and dataset when dynamic_namespace: true and dynamic_dataset: true', () => {
    const dataStream = {
      type: 'logs',
      dataset: 'test',
      elasticsearch: {
        dynamic_dataset: true,
        dynamic_namespace: true,
      },
    } as DataStreamMeta;
    const privileges = getDataStreamPrivileges(dataStream, 'namespace');

    expect(privileges).toMatchObject({
      names: ['logs-*-*'],
      privileges: ['auto_configure', 'create_doc'],
    });
  });
});

it('Returns the Elastic Connectors permissions for elastic_connectors package', async () => {
  const packagePolicies: PackagePolicy[] = [
    {
      id: 'package-policy-uuid-test-123',
      name: 'test-policy',
      namespace: '',
      enabled: true,
      package: { name: 'elastic_connectors', version: '1.0.0', title: 'Elastic Connectors' },
      inputs: [
        {
          type: 'connectors-py',
          enabled: true,
          streams: [],
        },
      ],
      created_at: '',
      updated_at: '',
      created_by: '',
      updated_by: '',
      revision: 1,
      policy_id: '',
      policy_ids: [''],
    },
  ];

  const permissions = await storedPackagePoliciesToAgentPermissions(
    packageInfoCache,
    'test',
    packagePolicies
  );

  expect(permissions).toMatchObject({
    'package-policy-uuid-test-123': {
      cluster: ['manage_connector'],
      indices: [
        {
          names: ['.elastic-connectors*'],
          privileges: ELASTIC_CONNECTORS_INDEX_PERMISSIONS,
        },
        {
          names: ['content-*', '.search-acl-filter-*'],
          privileges: ELASTIC_CONNECTORS_INDEX_PERMISSIONS,
        },
        {
          names: ['logs-elastic_agent*'],
          privileges: ['auto_configure', 'create_doc'],
        },
      ],
    },
  });
});
