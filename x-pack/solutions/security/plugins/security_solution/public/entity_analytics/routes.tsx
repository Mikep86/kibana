/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { Route, Routes } from '@kbn/shared-ux-router';

import { TrackApplicationView } from '@kbn/usage-collection-plugin/public';

import { SpyRoute } from '../common/utils/route/spy_routes';
import { NotFoundPage } from '../app/404';

import {
  ENTITY_ANALYTICS_ASSET_CRITICALITY_PATH,
  ENTITY_ANALYTICS_ENTITY_STORE_MANAGEMENT_PATH,
  ENTITY_ANALYTICS_LANDING_PATH,
  ENTITY_ANALYTICS_MANAGEMENT_PATH,
  ENTITY_ANALYTICS_PRIVILEGED_USER_MONITORING_PATH,
  SecurityPageName,
} from '../../common/constants';
import { EntityAnalyticsManagementPage } from './pages/entity_analytics_management_page';
import { PluginTemplateWrapper } from '../common/components/plugin_template_wrapper';
import { EntityStoreManagementPage } from './pages/entity_store_management_page';
import { EntityAnalyticsLandingPage } from './pages/entity_analytics_landing';
import { EntityAnalyticsPrivilegedUserMonitoringPage } from './pages/entity_analytics_privileged_user_monitoring_page';

const EntityAnalyticsManagementTelemetry = () => (
  <PluginTemplateWrapper>
    <TrackApplicationView viewId={SecurityPageName.entityAnalyticsManagement}>
      <EntityAnalyticsManagementPage />
      <SpyRoute pageName={SecurityPageName.entityAnalyticsManagement} />
    </TrackApplicationView>
  </PluginTemplateWrapper>
);

const EntityAnalyticsManagementContainer: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route
        path={ENTITY_ANALYTICS_MANAGEMENT_PATH}
        exact
        component={EntityAnalyticsManagementTelemetry}
      />
      <Route component={NotFoundPage} />
    </Routes>
  );
});
EntityAnalyticsManagementContainer.displayName = 'EntityAnalyticsManagementContainer';

const EntityAnalyticsAssetClassificationTelemetry = () => (
  <PluginTemplateWrapper>
    <TrackApplicationView viewId={SecurityPageName.entityAnalyticsAssetClassification}>
      <EntityStoreManagementPage />
      <SpyRoute pageName={SecurityPageName.entityAnalyticsAssetClassification} />
    </TrackApplicationView>
  </PluginTemplateWrapper>
);

const EntityAnalyticsAssetClassificationContainer: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route
        path={ENTITY_ANALYTICS_ASSET_CRITICALITY_PATH}
        exact
        component={EntityAnalyticsAssetClassificationTelemetry}
      />
      <Route component={NotFoundPage} />
    </Routes>
  );
});

EntityAnalyticsAssetClassificationContainer.displayName =
  'EntityAnalyticsAssetClassificationContainer';

const EntityAnalyticsEntityStoreTelemetry = () => (
  <PluginTemplateWrapper>
    <TrackApplicationView viewId={SecurityPageName.entityAnalyticsEntityStoreManagement}>
      <EntityStoreManagementPage />
      <SpyRoute pageName={SecurityPageName.entityAnalyticsEntityStoreManagement} />
    </TrackApplicationView>
  </PluginTemplateWrapper>
);

const EntityAnalyticsEntityStoreContainer: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route
        path={ENTITY_ANALYTICS_ENTITY_STORE_MANAGEMENT_PATH}
        exact
        component={EntityAnalyticsEntityStoreTelemetry}
      />
      <Route component={NotFoundPage} />
    </Routes>
  );
});

EntityAnalyticsEntityStoreContainer.displayName = 'EntityAnalyticsEntityStoreContainer';

const EntityAnalyticsLandingTelemetry = () => (
  <PluginTemplateWrapper>
    <TrackApplicationView viewId={SecurityPageName.entityAnalyticsLanding}>
      <EntityAnalyticsLandingPage />
      <SpyRoute pageName={SecurityPageName.entityAnalyticsLanding} />
    </TrackApplicationView>
  </PluginTemplateWrapper>
);

const EntityAnalyticsLandingContainer: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route
        path={ENTITY_ANALYTICS_LANDING_PATH}
        exact
        component={EntityAnalyticsLandingTelemetry}
      />
      <Route component={NotFoundPage} />
    </Routes>
  );
});

EntityAnalyticsLandingContainer.displayName = 'EntityAnalyticsLandingContainer';

const EntityAnalyticsPrivilegedUserMonitoringTelemetry = () => (
  <PluginTemplateWrapper>
    <TrackApplicationView viewId={SecurityPageName.privilegedUserMonitoring}>
      <EntityAnalyticsPrivilegedUserMonitoringPage />
      <SpyRoute pageName={SecurityPageName.privilegedUserMonitoring} />
    </TrackApplicationView>
  </PluginTemplateWrapper>
);

const EntityAnalyticsPrivilegedUserMonitoringContainer: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route
        path={ENTITY_ANALYTICS_PRIVILEGED_USER_MONITORING_PATH}
        exact
        component={EntityAnalyticsPrivilegedUserMonitoringTelemetry}
      />
      <Route component={NotFoundPage} />
    </Routes>
  );
});

EntityAnalyticsPrivilegedUserMonitoringContainer.displayName =
  'EntityAnalyticsPrivilegedUserMonitoringContainer';

export const routes = [
  {
    path: ENTITY_ANALYTICS_MANAGEMENT_PATH,
    component: EntityAnalyticsManagementContainer,
  },
  {
    path: ENTITY_ANALYTICS_ASSET_CRITICALITY_PATH,
    component: EntityAnalyticsAssetClassificationContainer,
  },
  {
    path: ENTITY_ANALYTICS_ENTITY_STORE_MANAGEMENT_PATH,
    component: EntityAnalyticsEntityStoreContainer,
  },
  {
    path: ENTITY_ANALYTICS_LANDING_PATH,
    component: EntityAnalyticsLandingContainer,
  },
  {
    path: ENTITY_ANALYTICS_PRIVILEGED_USER_MONITORING_PATH,
    component: EntityAnalyticsPrivilegedUserMonitoringContainer,
  },
];
