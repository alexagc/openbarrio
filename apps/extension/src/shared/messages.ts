import type { PropertyAuditReport, RemoteSelectorsBundle } from '@openbarrio/core';

export type ExtensionMessageType =
  | 'AUDIT_COORDS'
  | 'AUDIT_REFCAT'
  | 'GET_CONFIG'
  | 'SET_CONFIG'
  | 'CHECK_HEALTH'
  | 'GET_SELECTORS';

export interface AuditCoordsRequest {
  type: 'AUDIT_COORDS';
  payload: {
    lat: number;
    lon: number;
  };
}

export interface AuditRefcatRequest {
  type: 'AUDIT_REFCAT';
  payload: {
    refcat: string;
  };
}

export interface GetConfigRequest {
  type: 'GET_CONFIG';
}

export interface SetConfigRequest {
  type: 'SET_CONFIG';
  payload: {
    apiUrl?: string;
    webUrl?: string;
  };
}

export interface CheckHealthRequest {
  type: 'CHECK_HEALTH';
}

export interface GetSelectorsRequest {
  type: 'GET_SELECTORS';
}

export type ExtensionRequest =
  | AuditCoordsRequest
  | AuditRefcatRequest
  | GetConfigRequest
  | SetConfigRequest
  | CheckHealthRequest
  | GetSelectorsRequest;

export interface ExtensionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

export type AuditResponse = ExtensionResponse<PropertyAuditReport>;
export type SelectorsResponse = ExtensionResponse<RemoteSelectorsBundle>;

export interface ExtensionConfig {
  apiUrl: string;
  webUrl: string;
}
