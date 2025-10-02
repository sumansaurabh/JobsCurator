/**
 * Example usage of the Netlify DNS Manager SDK
 * This file demonstrates common use cases and patterns
 */

import NetlifyDNSClient, { DNSRecordType } from './index';

// Initialize the client
const client = new NetlifyDNSClient({
  accessToken: process.env.NETLIFY_ACCESS_TOKEN || 'your-token-here'
});

/**
 * Example 1: Basic DNS zone and record management
 */
async function basicExample() {
  try {
    // Get all DNS zones
    const zones = await client.getDNSZones();
    console.log('Available zones:', zones.map(z => z.name));

    if (zones.length === 0) {
      console.log('No DNS zones found');
      return;
    }

    const zone = zones[0];
    console.log(`Working with zone: ${zone.name}`);

    // Get all records in the zone
    const records = await client.getDNSRecords(zone.id);
    console.log(`Found ${records.length} DNS records`);

    // Create a new A record
    const newRecord = await client.createDNSRecord(zone.id, {
      type: DNSRecordType.A,
      hostname: 'api.example.com',
      value: '192.168.1.1',
      ttl: 3600
    });
    console.log('Created record:', newRecord);

    // Update the record
    const updatedRecord = await client.updateDNSRecord(zone.id, newRecord.id!, {
      value: '192.168.1.2',
      ttl: 7200
    });
    console.log('Updated record:', updatedRecord);

    // Delete the record
    await client.deleteDNSRecord(zone.id, newRecord.id!);
    console.log('Record deleted');

  } catch (error) {
    console.error('Error in basic example:', error);
  }
}

/**
 * Example 2: Working with different record types
 */
async function recordTypesExample() {
  try {
    const zones = await client.getDNSZones();
    if (zones.length === 0) return;

    const zone = zones[0];

    // Create various record types
    const records = [
      {
        type: DNSRecordType.A,
        hostname: 'www.example.com',
        value: '192.168.1.1',
        ttl: 3600
      },
      {
        type: DNSRecordType.CNAME,
        hostname: 'blog.example.com',
        value: 'www.example.com',
        ttl: 3600
      },
      {
        type: DNSRecordType.MX,
        hostname: 'example.com',
        value: 'mail.example.com',
        priority: 10,
        ttl: 3600
      },
      {
        type: DNSRecordType.TXT,
        hostname: 'example.com',
        value: 'v=spf1 include:_spf.google.com ~all',
        ttl: 3600
      }
    ];

    const createdRecords = await client.createMultipleDNSRecords(zone.id, records);
    console.log(`Created ${createdRecords.length} records`);

    // Clean up
    const recordIds = createdRecords.map(r => r.id!);
    await client.deleteMultipleDNSRecords(zone.id, recordIds);
    console.log('Cleaned up records');

  } catch (error) {
    console.error('Error in record types example:', error);
  }
}

/**
 * Example 3: Searching and filtering records
 */
async function searchExample() {
  try {
    const zones = await client.getDNSZones();
    if (zones.length === 0) return;

    const zone = zones[0];

    // Find records by hostname
    const apiRecords = await client.findRecordsByHostname(zone.id, 'api.example.com');
    console.log('API records:', apiRecords);

    // Find records by type
    const aRecords = await client.findRecordsByType(zone.id, 'A');
    console.log(`Found ${aRecords.length} A records`);

    // Get all records and filter manually
    const allRecords = await client.getDNSRecords(zone.id);
    const subdomainRecords = allRecords.filter(record =>
      record.hostname.includes('.example.com') && record.hostname !== 'example.com'
    );
    console.log(`Found ${subdomainRecords.length} subdomain records`);

  } catch (error) {
    console.error('Error in search example:', error);
  }
}

/**
 * Example 4: Error handling
 */
async function errorHandlingExample() {
  try {
    // This will likely fail
    await client.getDNSZone('non-existent-zone-id');
  } catch (error: any) {
    if (error.name === 'NetlifyDNSError') {
      console.log('Netlify DNS Error:', error.message);
      console.log('Status:', error.status);
      console.log('Code:', error.code);
    } else {
      console.log('Unknown error:', error.message);
    }
  }
}

/**
 * Example 5: Advanced zone management
 */
async function advancedExample() {
  try {
    const zones = await client.getDNSZones();

    for (const zone of zones) {
      console.log(`\n--- Zone: ${zone.name} ---`);
      console.log(`Domain: ${zone.domain}`);
      console.log(`Created: ${zone.created_at}`);
      console.log(`Supported record types: ${zone.supported_record_types.join(', ')}`);

      const records = await client.getDNSRecords(zone.id);
      const recordsByType = records.reduce((acc, record) => {
        acc[record.type] = (acc[record.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('Records by type:', recordsByType);
    }
  } catch (error) {
    console.error('Error in advanced example:', error);
  }
}

// Export examples for use in other files
export {
  basicExample,
  recordTypesExample,
  searchExample,
  errorHandlingExample,
  advancedExample
};

// Run examples if this file is executed directly
if (require.main === module) {
  console.log('Running Netlify DNS Manager examples...\n');

  async function runAllExamples() {
    await basicExample();
    await recordTypesExample();
    await searchExample();
    await errorHandlingExample();
    await advancedExample();
  }

  runAllExamples().catch(console.error);
}