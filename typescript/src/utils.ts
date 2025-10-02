import { DNSRecord, DNSRecordType } from './types';

/**
 * Utility functions for DNS management
 */
export class DNSUtils {
  /**
   * Validate if a hostname is properly formatted
   */
  static isValidHostname(hostname: string): boolean {
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    return hostnameRegex.test(hostname) && hostname.length <= 253;
  }

  /**
   * Validate if an IP address is valid (both IPv4 and IPv6)
   */
  static isValidIP(ip: string): boolean {
    return this.isValidIPv4(ip) || this.isValidIPv6(ip);
  }

  /**
   * Validate if an IPv4 address is valid
   */
  static isValidIPv4(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  }

  /**
   * Validate if an IPv6 address is valid
   */
  static isValidIPv6(ip: string): boolean {
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  }

  /**
   * Validate DNS record based on its type
   */
  static validateRecord(record: Partial<DNSRecord>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!record.hostname) {
      errors.push('Hostname is required');
    } else if (!this.isValidHostname(record.hostname)) {
      errors.push('Invalid hostname format');
    }

    if (!record.type) {
      errors.push('Record type is required');
    }

    if (!record.value) {
      errors.push('Record value is required');
    }

    // Type-specific validation
    if (record.type && record.value) {
      switch (record.type) {
        case DNSRecordType.A:
          if (!this.isValidIPv4(record.value)) {
            errors.push('A record must contain a valid IPv4 address');
          }
          break;
        case DNSRecordType.AAAA:
          if (!this.isValidIPv6(record.value)) {
            errors.push('AAAA record must contain a valid IPv6 address');
          }
          break;
        case DNSRecordType.CNAME:
          if (!this.isValidHostname(record.value)) {
            errors.push('CNAME record must contain a valid hostname');
          }
          break;
        case DNSRecordType.MX:
          if (record.priority === undefined) {
            errors.push('MX record must have a priority value');
          }
          if (!this.isValidHostname(record.value)) {
            errors.push('MX record must contain a valid hostname');
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format TTL value to human readable format
   */
  static formatTTL(ttl: number): string {
    if (ttl < 60) {
      return `${ttl} seconds`;
    } else if (ttl < 3600) {
      return `${Math.floor(ttl / 60)} minutes`;
    } else if (ttl < 86400) {
      return `${Math.floor(ttl / 3600)} hours`;
    } else {
      return `${Math.floor(ttl / 86400)} days`;
    }
  }

  /**
   * Parse TTL from human readable format to seconds
   */
  static parseTTL(ttlString: string): number {
    const match = ttlString.match(/^(\d+)\s*(s|sec|seconds?|m|min|minutes?|h|hr|hours?|d|days?)$/i);
    if (!match) {
      throw new Error('Invalid TTL format');
    }

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
      case 'sec':
      case 'second':
      case 'seconds':
        return value;
      case 'm':
      case 'min':
      case 'minute':
      case 'minutes':
        return value * 60;
      case 'h':
      case 'hr':
      case 'hour':
      case 'hours':
        return value * 3600;
      case 'd':
      case 'day':
      case 'days':
        return value * 86400;
      default:
        return value;
    }
  }

  /**
   * Sort DNS records by type and hostname
   */
  static sortRecords(records: DNSRecord[]): DNSRecord[] {
    return records.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.hostname.localeCompare(b.hostname);
    });
  }

  /**
   * Group DNS records by type
   */
  static groupRecordsByType(records: DNSRecord[]): Record<string, DNSRecord[]> {
    return records.reduce((groups, record) => {
      const type = record.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(record);
      return groups;
    }, {} as Record<string, DNSRecord[]>);
  }

  /**
   * Find duplicate records (same hostname and type)
   */
  static findDuplicateRecords(records: DNSRecord[]): DNSRecord[][] {
    const duplicates: DNSRecord[][] = [];
    const seen = new Map<string, DNSRecord[]>();

    for (const record of records) {
      const key = `${record.hostname}-${record.type}`;
      if (!seen.has(key)) {
        seen.set(key, []);
      }
      seen.get(key)!.push(record);
    }

    for (const [, recordGroup] of seen) {
      if (recordGroup.length > 1) {
        duplicates.push(recordGroup);
      }
    }

    return duplicates;
  }
}