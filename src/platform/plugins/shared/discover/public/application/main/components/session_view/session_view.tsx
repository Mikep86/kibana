/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { IKbnUrlStateStorage } from '@kbn/kibana-utils-plugin/public';
import { SavedObjectNotFound } from '@kbn/kibana-utils-plugin/public';
import { useParams } from 'react-router-dom';
import useLatest from 'react-use/lib/useLatest';
import type { DataView, DataViewSpec } from '@kbn/data-views-plugin/common';
import { useExecutionContext } from '@kbn/kibana-react-plugin/public';
import { useUrl } from '../../hooks/use_url';
import { useAlertResultsToast } from '../../hooks/use_alert_results_toast';
import { createDataViewDataSource } from '../../../../../common/data_sources';
import type { MainHistoryLocationState } from '../../../../../common';
import { useDiscoverServices } from '../../../../hooks/use_discover_services';
import type { DiscoverAppState } from '../../state_management/discover_app_state_container';
import { getDiscoverStateContainer } from '../../state_management/discover_state';
import type { DiscoverStateContainer } from '../../state_management/discover_state';
import {
  RuntimeStateProvider,
  internalStateActions,
  useInternalStateDispatch,
  useInternalStateSelector,
  useRuntimeState,
  useCurrentTabRuntimeState,
  useCurrentTabSelector,
  useCurrentTabAction,
} from '../../state_management/redux';
import type {
  CustomizationCallback,
  DiscoverCustomizationContext,
} from '../../../../customizations';
import type { InternalStateStore, RuntimeStateManager } from '../../state_management/redux';
import {
  DiscoverCustomizationProvider,
  useDiscoverCustomizationService,
} from '../../../../customizations';
import { DiscoverError } from '../../../../components/common/error_alert';
import { NoDataPage } from './no_data_page';
import { DiscoverMainProvider } from '../../state_management/discover_state_provider';
import { BrandedLoadingIndicator } from './branded_loading_indicator';
import { RedirectWhenSavedObjectNotFound } from './redirect_not_found';
import { DiscoverMainApp } from './main_app';
import { useAsyncFunction } from '../../hooks/use_async_function';

export interface DiscoverSessionViewProps {
  customizationContext: DiscoverCustomizationContext;
  customizationCallbacks: CustomizationCallback[];
  urlStateStorage: IKbnUrlStateStorage;
  internalState: InternalStateStore;
  runtimeStateManager: RuntimeStateManager;
}

export interface DiscoverSessionViewRef {
  stopSyncing: () => void;
}

type SessionInitializationState =
  | {
      showNoDataPage: true;
      stateContainer: undefined;
    }
  | {
      showNoDataPage: false;
      stateContainer: DiscoverStateContainer;
    };

type InitializeSession = (options?: {
  dataViewSpec?: DataViewSpec | undefined;
  defaultUrlState?: DiscoverAppState;
}) => Promise<SessionInitializationState>;

export const DiscoverSessionView = forwardRef<DiscoverSessionViewRef, DiscoverSessionViewProps>(
  (
    {
      customizationContext,
      customizationCallbacks,
      urlStateStorage,
      internalState,
      runtimeStateManager,
    },
    ref
  ) => {
    const dispatch = useInternalStateDispatch();
    const services = useDiscoverServices();
    const { core, history, getScopedHistory } = services;
    const { id: discoverSessionId } = useParams<{ id?: string }>();
    const currentTabId = useCurrentTabSelector((tab) => tab.id);
    const initializeSessionAction = useCurrentTabAction(internalStateActions.initializeSession);
    const [initializeSessionState, initializeSession] = useAsyncFunction<InitializeSession>(
      async ({ dataViewSpec, defaultUrlState } = {}) => {
        initializeSessionState.value?.stateContainer?.actions.stopSyncing();

        const stateContainer = getDiscoverStateContainer({
          tabId: currentTabId,
          services,
          customizationContext,
          stateStorageContainer: urlStateStorage,
          internalState,
          runtimeStateManager,
        });
        const { showNoDataPage } = await dispatch(
          initializeSessionAction({
            initializeSessionParams: {
              stateContainer,
              discoverSessionId,
              dataViewSpec,
              defaultUrlState,
            },
          })
        );

        return showNoDataPage ? { showNoDataPage } : { showNoDataPage, stateContainer };
      }
    );
    const initializeSessionWithDefaultLocationState = useLatest(() => {
      const historyLocationState = getScopedHistory<
        MainHistoryLocationState & { defaultState?: DiscoverAppState }
      >()?.location.state;
      initializeSession({
        dataViewSpec: historyLocationState?.dataViewSpec,
        defaultUrlState: historyLocationState?.defaultState,
      });
    });
    const customizationService = useDiscoverCustomizationService({
      customizationCallbacks,
      stateContainer: initializeSessionState.value?.stateContainer,
    });
    const initializationState = useInternalStateSelector((state) => state.initializationState);
    const currentDataView = useCurrentTabRuntimeState(
      runtimeStateManager,
      (tab) => tab.currentDataView$
    );
    const adHocDataViews = useRuntimeState(runtimeStateManager.adHocDataViews$);

    useImperativeHandle(
      ref,
      () => ({
        stopSyncing: () => initializeSessionState.value?.stateContainer?.actions.stopSyncing(),
      }),
      [initializeSessionState.value?.stateContainer]
    );

    useEffect(() => {
      initializeSessionWithDefaultLocationState.current();
    }, [discoverSessionId, initializeSessionWithDefaultLocationState]);

    useUrl({
      history,
      savedSearchId: discoverSessionId,
      onNewUrl: () => {
        initializeSessionWithDefaultLocationState.current();
      },
    });

    useAlertResultsToast();

    useExecutionContext(core.executionContext, {
      type: 'application',
      page: 'app',
      id: discoverSessionId || 'new',
    });

    if (initializeSessionState.loading) {
      return <BrandedLoadingIndicator />;
    }

    if (initializeSessionState.error) {
      if (initializeSessionState.error instanceof SavedObjectNotFound) {
        return (
          <RedirectWhenSavedObjectNotFound
            error={initializeSessionState.error}
            discoverSessionId={discoverSessionId}
          />
        );
      }

      return <DiscoverError error={initializeSessionState.error} />;
    }

    if (initializeSessionState.value.showNoDataPage) {
      return (
        <NoDataPage
          {...initializationState}
          onDataViewCreated={async (dataViewUnknown) => {
            await dispatch(internalStateActions.loadDataViewList());
            dispatch(
              internalStateActions.setInitializationState({
                hasESData: true,
                hasUserDataView: true,
              })
            );
            const dataView = dataViewUnknown as DataView;
            initializeSession({
              defaultUrlState: dataView.id
                ? { dataSource: createDataViewDataSource({ dataViewId: dataView.id }) }
                : undefined,
            });
          }}
          onESQLNavigationComplete={() => {
            initializeSession();
          }}
        />
      );
    }

    if (!customizationService || !currentDataView) {
      return <BrandedLoadingIndicator />;
    }

    return (
      <DiscoverCustomizationProvider value={customizationService}>
        <DiscoverMainProvider value={initializeSessionState.value.stateContainer}>
          <RuntimeStateProvider currentDataView={currentDataView} adHocDataViews={adHocDataViews}>
            <DiscoverMainApp stateContainer={initializeSessionState.value.stateContainer} />
          </RuntimeStateProvider>
        </DiscoverMainProvider>
      </DiscoverCustomizationProvider>
    );
  }
);
