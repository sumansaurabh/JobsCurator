# Netlify DNS Manager

A TypeScript SDK for managing Netlify DNS records with full type safety and comprehensive functionality.

## Installation

```bash
npm install netlify-dns-manager
```

## Quick Start

```typescript
import NetlifyDNSClient from 'netlify-dns-manager';

const client = new NetlifyDNSClient({
  accessToken: 'your-netlify-access-token'
});

// Get all DNS zones
const zones = await client.getDNSZones();

// Get records for a specific zone
const records = await client.getDNSRecords('zone-id');

// Create a new A record
const newRecord = await client.createDNSRecord('zone-id', {
  type: 'A',
  hostname: 'api.example.com',
  value: '192.168.1.1',
  ttl: 3600
});
```

## Features

- 🔒 **Full TypeScript Support** - Complete type safety with TypeScript definitions
- 🌐 **Complete DNS Management** - Create, read, update, and delete DNS records
- 🔍 **Advanced Filtering** - Find records by hostname, type, or custom criteria
- 🛡️ **Error Handling** - Comprehensive error handling with custom error types
- ⚡ **Batch Operations** - Create or delete multiple records efficiently
- 🔧 **Utility Functions** - Built-in validation and formatting utilities

## API Reference

### Client Configuration

```typescript
interface NetlifyConfig {
  accessToken: string;
  baseUrl?: string; // Optional, defaults to Netlify API
}
```

### DNS Record Types

The SDK supports all standard DNS record types:
- `A` - IPv4 address
- `AAAA` - IPv6 address
- `CNAME` - Canonical name
- `MX` - Mail exchange
- `TXT` - Text record
- `NS` - Name server
- `SRV` - Service record
- `CAA` - Certificate Authority Authorization
- `ALIAS` - Alias record
- `PTR` - Pointer record
- `SPF` - Sender Policy Framework

### Core Methods

#### Zone Management
```typescript
// Get all DNS zones
getDNSZones(): Promise<DNSZone[]>

// Get specific zone
getDNSZone(zoneId: string): Promise<DNSZone>
```

#### Record Management
```typescript
// Get all records in a zone
getDNSRecords(zoneId: string): Promise<DNSRecord[]>

// Get specific record
getDNSRecord(zoneId: string, recordId: string): Promise<DNSRecord>

// Create new record
createDNSRecord(zoneId: string, record: CreateDNSRecordRequest): Promise<DNSRecord>

// Update existing record
updateDNSRecord(zoneId: string, recordId: string, record: Partial<CreateDNSRecordRequest>): Promise<DNSRecord>

// Delete record
deleteDNSRecord(zoneId: string, recordId: string): Promise<void>
```

#### Search and Filter
```typescript
// Find records by hostname
findRecordsByHostname(zoneId: string, hostname: string): Promise<DNSRecord[]>

// Find records by type
findRecordsByType(zoneId: string, type: string): Promise<DNSRecord[]>
```

#### Batch Operations
```typescript
// Create multiple records
createMultipleDNSRecords(zoneId: string, records: CreateDNSRecordRequest[]): Promise<DNSRecord[]>

// Delete multiple records
deleteMultipleDNSRecords(zoneId: string, recordIds: string[]): Promise<void>
```

### Utility Functions

The SDK includes a comprehensive set of utility functions:

```typescript
import { DNSUtils } from 'netlify-dns-manager';

// Validation
DNSUtils.isValidHostname('api.example.com'); // true
DNSUtils.isValidIPv4('192.168.1.1'); // true
DNSUtils.validateRecord(record); // { isValid: boolean, errors: string[] }

// TTL formatting
DNSUtils.formatTTL(3600); // "1 hours"
DNSUtils.parseTTL("1 hour"); // 3600

// Record organization
DNSUtils.sortRecords(records);
DNSUtils.groupRecordsByType(records);
DNSUtils.findDuplicateRecords(records);
```

## Examples

### Creating Different Record Types

```typescript
// A Record
await client.createDNSRecord('zone-id', {
  type: 'A',
  hostname: 'api.example.com',
  value: '192.168.1.1',
  ttl: 3600
});

// CNAME Record
await client.createDNSRecord('zone-id', {
  type: 'CNAME',
  hostname: 'www.example.com',
  value: 'example.com',
  ttl: 3600
});

// MX Record
await client.createDNSRecord('zone-id', {
  type: 'MX',
  hostname: 'example.com',
  value: 'mail.example.com',
  priority: 10,
  ttl: 3600
});

// TXT Record
await client.createDNSRecord('zone-id', {
  type: 'TXT',
  hostname: 'example.com',
  value: 'v=spf1 include:_spf.google.com ~all',
  ttl: 3600
});
```

### Batch Operations

```typescript
// Create multiple records at once
const records = [
  {
    type: 'A' as const,
    hostname: 'api1.example.com',
    value: '192.168.1.1',
    ttl: 3600
  },
  {
    type: 'A' as const,
    hostname: 'api2.example.com',
    value: '192.168.1.2',
    ttl: 3600
  }
];

const createdRecords = await client.createMultipleDNSRecords('zone-id', records);
```

### Error Handling

```typescript
import { NetlifyDNSError } from 'netlify-dns-manager';

try {
  const record = await client.createDNSRecord('zone-id', {
    type: 'A',
    hostname: 'api.example.com',
    value: '192.168.1.1'
  });
} catch (error) {
  if (error instanceof NetlifyDNSError) {
    console.error('Netlify DNS Error:', error.message);
    console.error('Status Code:', error.status);
    console.error('Error Code:', error.code);
  }
}
```

## Authentication

You'll need a Netlify access token to use this SDK. You can create one in your Netlify dashboard:

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click on your profile picture
3. Go to "User settings"
4. Navigate to "Applications"
5. Click "New access token"
6. Give it a name and copy the token

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT License

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Support

If you encounter any issues or have questions, please file an issue on GitHub.