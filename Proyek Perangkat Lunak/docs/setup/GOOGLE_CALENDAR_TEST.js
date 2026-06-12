/**
 * Test Script untuk Google Calendar Sync
 * Jalankan di browser console atau gunakan untuk testing
 */

// Test 1: Buat task via API endpoint
async function testCreateTask() {
  console.log('🧪 Test: Membuat task via API...')
  
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Task - Google Calendar Sync',
        description: 'This is a test task from API',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        priority: 'HIGH',
        estimatedDuration: 30,
      }),
    })

    const data = await response.json()
    console.log('📊 Response:', data)
    console.log('✅ Status:', response.status)
    
    if (data.data?.googleCalendarSync?.synced) {
      console.log('✅ BERHASIL SYNC KE GOOGLE CALENDAR!')
      console.log('📅 Event ID:', data.data.googleCalendarSync.eventId)
      console.log('🔗 Link:', data.data.googleCalendarSync.webLink)
    } else {
      console.error('❌ GAGAL SYNC KE GOOGLE CALENDAR')
      console.error('Error:', data.data?.googleCalendarSync?.error)
    }
    
    return data
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Test 2: Ambil events dari Google Calendar
async function testGetCalendarEvents() {
  console.log('🧪 Test: Mengambil events dari Google Calendar...')
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7) // 7 hari ke belakang
  
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 30) // 30 hari ke depan
  
  try {
    const response = await fetch(
      `/api/sync/calendar?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    )
    
    const data = await response.json()
    console.log('📊 Response:', data)
    console.log(`📅 Total events: ${data.data?.count || 0}`)
    
    if (data.data?.events) {
      data.data.events.forEach((event) => {
        console.log(`  - ${event.title} (${event.start})`)
      })
    }
    
    return data
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run tests
console.log('📋 Google Calendar Sync Testing Suite')
console.log('=====================================')
console.log('')
console.log('Gunakan command berikut di browser console:')
console.log('  testCreateTask()         - Buat task baru dan sync ke Google Calendar')
console.log('  testGetCalendarEvents()  - Ambil events dari Google Calendar')
console.log('')
console.log('Atau ketik langsung untuk manual test!')
