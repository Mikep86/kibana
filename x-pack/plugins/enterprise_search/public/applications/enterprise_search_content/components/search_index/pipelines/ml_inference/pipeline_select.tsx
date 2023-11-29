/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { useActions, useValues } from 'kea';

import { EuiSelectable } from '@elastic/eui';

import { MLInferenceLogic, MLInferencePipelineOption } from './ml_inference_logic';
import { PipelineSelectOption, PipelineSelectOptionProps } from './pipeline_select_option';

export const PipelineSelect: React.FC = () => {
  const { existingInferencePipelines } = useValues(MLInferenceLogic);
  const { selectExistingPipeline } = useActions(MLInferenceLogic);

  const getPipelineOptions = (
    pipelineOptions: MLInferencePipelineOption[]
  ): PipelineSelectOptionProps[] => {
    return pipelineOptions.map((pipelineOption) => ({
      label: pipelineOption.pipelineName,
      pipeline: pipelineOption,
    }));
  };

  const renderPipelineOption = (option: PipelineSelectOptionProps) => {
    // TODO: Remove explicitly passing label
    return <PipelineSelectOption label={option.label} pipeline={option.pipeline} />;
  };

  const onChange = (options: PipelineSelectOptionProps[]) => {
    const selectedOption = options.find((option) => option.checked === 'on');
    if (selectedOption) {
      selectExistingPipeline(selectedOption.pipeline.pipelineName);
    }
  };

  return (
    // TODO: Make list scrollable
    // TODO: Fix selection highlighting when using keyboard to select
    <EuiSelectable
      options={getPipelineOptions(existingInferencePipelines)}
      listProps={{
        bordered: true,
        rowHeight: 90,
        showIcons: false,
        onFocusBadge: false,
      }}
      height={360}
      singleSelection="always"
      onChange={onChange}
      renderOption={renderPipelineOption}
    >
      {(list) => list}
    </EuiSelectable>
  );
};
