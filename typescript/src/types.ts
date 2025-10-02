export interface NetlifyConfig {
  accessToken: string;
  baseUrl?: string;
}

export interface DNSRecord {
  id?: string;
  hostname: string;
  type: DNSRecordType;
  value: string;
  ttl?: number;
  priority?: number;
  weight?: number;
  port?: number;
  flag?: number;
  tag?: string;
}

export enum DNSRecordType {
  A = 'A',
  AAAA = 'AAAA',
  ALIAS = 'ALIAS',
  CNAME = 'CNAME',
  MX = 'MX',
  NS = 'NS',
  PTR = 'PTR',
  SPF = 'SPF',
  SRV = 'SRV',
  TXT = 'TXT',
  CAA = 'CAA',
}

export interface DNSZone {
  id: string;
  name: string;
  domain: string;
  created_at: string;
  updated_at: string;
  records: DNSRecord[];
  user_id: string;
  supported_record_types: DNSRecordType[];
  account_id: string;
  account_name: string;
  account_slug: string;
}

export interface CreateDNSRecordRequest {
  type: DNSRecordType;
  hostname: string;
  value: string;
  ttl?: number;
  priority?: number;
  weight?: number;
  port?: number;
  flag?: number;
  tag?: string;
}

export interface UpdateDNSRecordRequest extends Partial<CreateDNSRecordRequest> {
  id: string;
}

export interface NetlifyAPIResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface NetlifyError {
  message: string;
  code?: string;
  status?: number;
}

export class NetlifyDNSError extends Error {
  public code?: string;
  public status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'NetlifyDNSError';
    this.code = code;
    this.status = status;
  }
}