export { NetlifyDNSClient } from './client';
export {
  NetlifyConfig,
  DNSRecord,
  DNSRecordType,
  DNSZone,
  CreateDNSRecordRequest,
  UpdateDNSRecordRequest,
  NetlifyAPIResponse,
  NetlifyError,
  NetlifyDNSError,
} from './types';

// Default export for convenience
export { NetlifyDNSClient as default } from './client';