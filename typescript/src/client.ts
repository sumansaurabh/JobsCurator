import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  NetlifyConfig,
  DNSZone,
  DNSRecord,
  CreateDNSRecordRequest,
  UpdateDNSRecordRequest,
  NetlifyDNSError,
  NetlifyAPIResponse,
} from './types';

export class NetlifyDNSClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(config: NetlifyConfig) {
    this.accessToken = config.accessToken;

    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.netlify.com/api/v1',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new NetlifyDNSError(
            error.response.data?.message || error.message,
            error.response.data?.code,
            error.response.status
          );
        }
        throw new NetlifyDNSError(error.message);
      }
    );
  }

  /**
   * Get all DNS zones for the authenticated user
   */
  async getDNSZones(): Promise<DNSZone[]> {
    try {
      const response: AxiosResponse<DNSZone[]> = await this.client.get('/dns_zones');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific DNS zone by ID
   */
  async getDNSZone(zoneId: string): Promise<DNSZone> {
    try {
      const response: AxiosResponse<DNSZone> = await this.client.get(`/dns_zones/${zoneId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all DNS records for a specific zone
   */
  async getDNSRecords(zoneId: string): Promise<DNSRecord[]> {
    try {
      const response: AxiosResponse<DNSRecord[]> = await this.client.get(`/dns_zones/${zoneId}/dns_records`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific DNS record
   */
  async getDNSRecord(zoneId: string, recordId: string): Promise<DNSRecord> {
    try {
      const response: AxiosResponse<DNSRecord> = await this.client.get(
        `/dns_zones/${zoneId}/dns_records/${recordId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new DNS record
   */
  async createDNSRecord(zoneId: string, record: CreateDNSRecordRequest): Promise<DNSRecord> {
    try {
      const response: AxiosResponse<DNSRecord> = await this.client.post(
        `/dns_zones/${zoneId}/dns_records`,
        record
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing DNS record
   */
  async updateDNSRecord(zoneId: string, recordId: string, record: Partial<CreateDNSRecordRequest>): Promise<DNSRecord> {
    try {
      const response: AxiosResponse<DNSRecord> = await this.client.put(
        `/dns_zones/${zoneId}/dns_records/${recordId}`,
        record
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a DNS record
   */
  async deleteDNSRecord(zoneId: string, recordId: string): Promise<void> {
    try {
      await this.client.delete(`/dns_zones/${zoneId}/dns_records/${recordId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find DNS records by hostname
   */
  async findRecordsByHostname(zoneId: string, hostname: string): Promise<DNSRecord[]> {
    try {
      const records = await this.getDNSRecords(zoneId);
      return records.filter(record => record.hostname === hostname);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find DNS records by type
   */
  async findRecordsByType(zoneId: string, type: string): Promise<DNSRecord[]> {
    try {
      const records = await this.getDNSRecords(zoneId);
      return records.filter(record => record.type === type);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Batch create multiple DNS records
   */
  async createMultipleDNSRecords(zoneId: string, records: CreateDNSRecordRequest[]): Promise<DNSRecord[]> {
    try {
      const createdRecords: DNSRecord[] = [];

      for (const record of records) {
        const createdRecord = await this.createDNSRecord(zoneId, record);
        createdRecords.push(createdRecord);
      }

      return createdRecords;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Batch delete multiple DNS records
   */
  async deleteMultipleDNSRecords(zoneId: string, recordIds: string[]): Promise<void> {
    try {
      for (const recordId of recordIds) {
        await this.deleteDNSRecord(zoneId, recordId);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): NetlifyDNSError {
    if (error instanceof NetlifyDNSError) {
      return error;
    }
    return new NetlifyDNSError(error.message || 'An unknown error occurred');
  }
}