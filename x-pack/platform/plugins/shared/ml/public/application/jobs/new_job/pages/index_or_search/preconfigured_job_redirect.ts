/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ApplicationStart } from '@kbn/core/public';
import type { DataViewsContract } from '@kbn/data-views-plugin/public';
import { jobCloningService } from '../../../../services/job_cloning_service';
import type { Job, Datafeed } from '../../../../../../common/types/anomaly_detection_jobs';
import { CREATED_BY_LABEL, JOB_TYPE } from '../../../../../../common/constants/new_job';

export async function preConfiguredJobRedirect(
  dataViewsService: DataViewsContract,
  basePath: string,
  navigateToUrl: ApplicationStart['navigateToUrl']
) {
  const { createdBy, job, datafeed } = jobCloningService;

  if (job && datafeed) {
    const dataViewId = await getDataViewIdFromDatafeed(job, datafeed, dataViewsService);
    if (dataViewId === null) {
      return Promise.resolve();
    }

    try {
      const redirectUrl = await getWizardUrlFromCloningJob(createdBy, dataViewId);
      await navigateToUrl(`${basePath}/app/management/ml/anomaly_detection/${redirectUrl}`);
      return Promise.reject();
    } catch (error) {
      return Promise.resolve();
    }
  } else {
    // no job to clone
    // don't redirect
    return Promise.resolve();
  }
}

async function getWizardUrlFromCloningJob(createdBy: string | undefined, dataViewId: string) {
  const created = createdBy;
  let page = '';

  switch (created) {
    case CREATED_BY_LABEL.SINGLE_METRIC:
    case CREATED_BY_LABEL.SINGLE_METRIC_FROM_LENS:
      page = JOB_TYPE.SINGLE_METRIC;
      break;
    case CREATED_BY_LABEL.MULTI_METRIC:
    case CREATED_BY_LABEL.MULTI_METRIC_FROM_LENS:
      page = JOB_TYPE.MULTI_METRIC;
      break;
    case CREATED_BY_LABEL.POPULATION:
      page = JOB_TYPE.POPULATION;
      break;
    case CREATED_BY_LABEL.CATEGORIZATION:
    case CREATED_BY_LABEL.CATEGORIZATION_FROM_PATTERN_ANALYSIS:
      page = JOB_TYPE.CATEGORIZATION;
      break;
    case CREATED_BY_LABEL.RARE:
      page = JOB_TYPE.RARE;
      break;
    case CREATED_BY_LABEL.GEO:
    case CREATED_BY_LABEL.GEO_FROM_LENS:
      page = JOB_TYPE.GEO;
      break;
    case CREATED_BY_LABEL.ADVANCED:
    default:
      page = JOB_TYPE.ADVANCED;
      break;
  }

  return `jobs/new_job/${page}?index=${dataViewId}&_g=()`;
}

async function getDataViewIdFromDatafeed(
  job: Job,
  datafeed: Datafeed,
  dataViewsService: DataViewsContract
): Promise<string | null> {
  if (dataViewsService === null) {
    throw new Error('Data views are not initialized!');
  }

  const indexPattern = datafeed.indices.join(',');

  const dataViews = await dataViewsService?.find(indexPattern);
  const dataView = dataViews.find((dv) => dv.getIndexPattern() === indexPattern);
  if (dataView === undefined) {
    // create a temporary data view if we can't find one
    // matching the index pattern
    const tempDataView = await dataViewsService.create({
      id: undefined,
      name: indexPattern,
      title: indexPattern,
      timeFieldName: job.data_description.time_field!,
    });
    return tempDataView.id ?? null;
  }
  return dataView.id ?? null;
}
