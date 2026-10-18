import type { PropertyAuditReport } from '@openbarrio/core';

export type ExtensionMessageType =
  | 'AUDIT_COORDS'
  | 'AUDIT_REFCAT'
  | 'GET_CONFIG'
  | 'SET_CONFIG'
  | 'CHECK_HEALTH';

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

export type ExtensionRequest =
  | AuditCoordsRequest
  | AuditRefcatRequest
  | GetConfigRequest
  | SetConfigRequest
  | CheckHealthRequest;

export interface ExtensionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

export type AuditResponse = ExtensionResponse<PropertyAuditReport>;

export interface ExtensionConfig {
  apiUrl: string;
  webUrl: string;
}
