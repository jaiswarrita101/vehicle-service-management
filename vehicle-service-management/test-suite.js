const fs = require('fs');
const path = require('path');

const root = __dirname;
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    console.error('  ❌ FAIL: ' + message);
  }
}

console.log('====================================================');
console.log('  VSMS AUTOMATED TEST SUITE & DEPLOYMENT VERIFICATION');
console.log('====================================================\n');

// 1. Check all HTML files
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
console.log(`[TEST 1] Verifying ${htmlFiles.length} HTML files for tags, links & scripts...`);

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');

  // Check doctype
  assert(content.includes('<!DOCTYPE html>') || content.includes('<!doctype html>'), `${file} missing DOCTYPE`);

  // Check style.css reference
  assert(content.includes('css/style.css'), `${file} missing css/style.css link`);

  // Check db.js and main.js reference
  assert(content.includes('js/db.js'), `${file} missing js/db.js script`);
  assert(content.includes('js/main.js'), `${file} missing js/main.js script`);

  // Check script tags exist
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/g;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.startsWith('http://') && !src.startsWith('https://')) {
      const scriptPath = path.join(root, src.split('?')[0]);
      assert(fs.existsSync(scriptPath), `${file} references non-existent script: ${src}`);
    }
  }

  // Check internal href links
  const hrefRegex = /href=["']([^"'#?]+)(\?[^"']*)?["']/g;
  while ((match = hrefRegex.exec(content)) !== null) {
    const target = match[1];
    if (target.endsWith('.html') && !target.startsWith('http://') && !target.startsWith('https://')) {
      const targetPath = path.join(root, target);
      assert(fs.existsSync(targetPath), `${file} has broken link to: ${target}`);
    }
  }

  // Check for localhost or Windows absolute path leaks
  assert(!content.includes('localhost:5000') && !content.includes('C:\\Users'), `${file} contains hardcoded local path`);
});

// 2. Check all JS files
console.log('\n[TEST 2] Verifying JavaScript modules syntax and database structure...');
const jsFiles = fs.readdirSync(path.join(root, 'js')).filter(f => f.endsWith('.js'));

jsFiles.forEach(file => {
  const filePath = path.join(root, 'js', file);
  const code = fs.readFileSync(filePath, 'utf8');

  try {
    new Function(code);
    assert(true, `${file} syntax valid`);
  } catch (e) {
    assert(false, `${file} syntax error: ${e.message}`);
  }

  assert(!code.includes('C:\\Users') && !code.includes('C:/Users'), `${file} contains hardcoded Windows paths`);
});

// 3. Test Database Seed Data & Logic in Node.js environment
console.log('\n[TEST 3] Testing Database engine (db.js) data initialization and methods...');

// Mock localStorage and window
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

global.window = {
  localStorage: global.localStorage
};

// Load db.js
const dbCode = fs.readFileSync(path.join(root, 'js', 'db.js'), 'utf8');
const vm = require('vm');
const context = vm.createContext({
  window: global.window,
  localStorage: global.localStorage,
  console: console,
  Date: Date,
  Math: Math,
  JSON: JSON
});

try {
  vm.runInContext(dbCode, context);
  const DB = context.window.DB;

  assert(DB !== undefined, 'window.DB is initialized');
  
  // Test seed data
  const services = DB.getServices();
  assert(services && services.length >= 10, `Database has ${services.length} services (expected >= 10)`);

  const vehicles = DB.getVehicles();
  assert(vehicles && vehicles.length >= 4, `Database has ${vehicles.length} demo vehicles (expected >= 4)`);

  const users = DB.getUsers();
  assert(users && users.length >= 5, `Database has ${users.length} demo users across 5 roles`);

  const inventory = DB.getInventory();
  assert(inventory && inventory.length >= 8, `Database has ${inventory.length} inventory parts (expected >= 8)`);

  const jobCards = DB.getJobCards();
  assert(jobCards && jobCards.length >= 3, `Database has ${jobCards.length} demo job cards`);

  // Test Booking creation
  const testBooking = {
    bookingId: 'BKG-TEST-99',
    customerId: 'USR-001',
    customerName: 'Test Customer',
    vehicleNo: 'MH-04-TEST-1234',
    serviceIds: ['SRV-001'],
    preferredDate: '2026-10-01',
    timeSlot: '10:00 AM',
    status: 'Booked'
  };
  DB.saveBooking(testBooking);
  const fetchedBooking = DB.getBookingById('BKG-TEST-99');
  assert(fetchedBooking && fetchedBooking.vehicleNo === 'MH-04-TEST-1234', 'Booking creation and retrieval OK');

  // Test Invoice Generation from Job Card
  const firstJob = DB.getJobCards()[0];
  const invoice = DB.generateInvoiceFromJobCard(firstJob.jobCardId, 5);
  assert(invoice !== null && invoice.invoiceId.startsWith('INV-'), `Invoice generation OK: ${invoice ? invoice.invoiceId : 'Failed'}`);
  assert(invoice.grandTotal > 0, `Invoice grandTotal is valid (${invoice.grandTotal})`);

  // Test Inventory Stock deduction
  const initialPart = DB.getInventoryPartById('PRT-001');
  const initialStock = initialPart.quantity;
  const deductResult = DB.addPartToJobCard(firstJob.jobCardId, 'PRT-001', 1);
  const updatedPart = DB.getInventoryPartById('PRT-001');
  assert(deductResult.success === true, 'addPartToJobCard success');
  assert(updatedPart.quantity === initialStock - 1, `Inventory properly deducted (was ${initialStock}, now ${updatedPart.quantity})`);

  // Test Inventory Restock
  const restockResult = DB.restockInventoryPart('PRT-001', 5);
  assert(restockResult.success === true && restockResult.part.quantity === initialStock + 4, 'Inventory restock logic OK');

  console.log('  Database operations completed with full consistency.');
} catch (e) {
  assert(false, 'Database test threw exception: ' + e.stack);
}

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL INTEGRITY, LINK, SYNTAX & DATABASE TESTS PASSED 100%!');
}
