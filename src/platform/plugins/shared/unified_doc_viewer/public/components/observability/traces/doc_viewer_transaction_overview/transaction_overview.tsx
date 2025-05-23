/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useMemo } from 'react';
import { DocViewRenderProps } from '@kbn/unified-doc-viewer/types';
import { EuiPanel, EuiSpacer } from '@elastic/eui';
import {
  SERVICE_NAME_FIELD,
  TRACE_ID_FIELD,
  TRANSACTION_DURATION_FIELD,
  TRANSACTION_ID_FIELD,
  TRANSACTION_NAME_FIELD,
  getTraceDocumentOverview,
} from '@kbn/discover-utils';
import { FieldActionsProvider } from '../../../../hooks/use_field_actions';
import { transactionFields } from './resources/fields';
import { getTransactionFieldConfiguration } from './resources/get_transaction_field_configuration';
import { TransactionSummaryField } from './sub_components/transaction_summary_field';
import { TransactionDurationSummary } from './sub_components/transaction_duration_summary';
import { RootTransactionProvider } from './hooks/use_root_transaction';
import { Trace } from '../components/trace';

import { TransactionSummaryTitle } from './sub_components/transaction_summary_title';
export type TransactionOverviewProps = DocViewRenderProps & {
  tracesIndexPattern: string;
};

export function TransactionOverview({
  columns,
  hit,
  filter,
  onAddColumn,
  onRemoveColumn,
  tracesIndexPattern,
}: TransactionOverviewProps) {
  const parsedDoc = useMemo(() => getTraceDocumentOverview(hit), [hit]);
  const transactionDuration = parsedDoc[TRANSACTION_DURATION_FIELD];
  const traceId = parsedDoc[TRACE_ID_FIELD];
  const fieldConfigurations = useMemo(
    () => getTransactionFieldConfiguration(parsedDoc),
    [parsedDoc]
  );

  return (
    <RootTransactionProvider traceId={traceId} indexPattern={tracesIndexPattern}>
      <FieldActionsProvider
        columns={columns}
        filter={filter}
        onAddColumn={onAddColumn}
        onRemoveColumn={onRemoveColumn}
      >
        <EuiPanel color="transparent" hasShadow={false} paddingSize="none">
          <EuiSpacer size="m" />
          <TransactionSummaryTitle
            serviceName={parsedDoc[SERVICE_NAME_FIELD]}
            id={parsedDoc[TRANSACTION_ID_FIELD]!}
            name={parsedDoc[TRANSACTION_NAME_FIELD]!}
          />
          <EuiSpacer size="m" />
          {transactionFields.map((fieldId) => (
            <TransactionSummaryField
              key={fieldId}
              fieldId={fieldId}
              fieldConfiguration={fieldConfigurations[fieldId]}
            />
          ))}

          {transactionDuration && (
            <>
              <EuiSpacer size="m" />
              <TransactionDurationSummary duration={transactionDuration} />
            </>
          )}
          {traceId && (
            <>
              <EuiSpacer size="m" />
              <Trace
                fields={fieldConfigurations}
                serviceName={parsedDoc[SERVICE_NAME_FIELD]}
                traceId={traceId}
                transactionId={parsedDoc[TRANSACTION_ID_FIELD]}
                displayType="transaction"
              />
            </>
          )}
        </EuiPanel>
      </FieldActionsProvider>
    </RootTransactionProvider>
  );
}
