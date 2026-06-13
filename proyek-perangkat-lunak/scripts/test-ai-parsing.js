#!/usr/bin/env node

/**
 * AI Parsing Integration Test
 *
 * Runs Indonesian natural language parsing cases against the Express backend:
 * POST /api/ai/parse-task
 *
 * Usage:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000 node scripts/test-ai-parsing.js
 *   API_BASE_URL=http://localhost:8000 node scripts/test-ai-parsing.js
 */

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000'

const PASSWORD = 'Testpass123!'
const email = `ai-parse-test-${Date.now()}@example.com`

const pad = (value) => String(value).padStart(2, '0')

const localDateParts = (offsetDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

const toLocalSummary = (isoString) => {
  const date = new Date(isoString)

  return {
    iso: isoString,
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}

const expectedDate = (offsetDays = 0) => {
  const { year, month, day } = localDateParts(offsetDays)
  return `${year}-${pad(month)}-${pad(day)}`
}

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(
      `${options.method || 'GET'} ${path} failed HTTP ${response.status}: ${text}`
    )
  }

  return body
}

const registerAndLogin = async () => {
  await requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'AI Parsing Test',
      email,
      password: PASSWORD,
    }),
  })

  const login = await requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password: PASSWORD,
    }),
  })

  const token = login?.data?.token
  if (!token) {
    throw new Error('Login response did not include token')
  }

  return token
}

const parseCommand = async (token, command) => {
  const result = await requestJson('/api/ai/parse-task', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ command }),
  })

  if (!result.success || !result.data) {
    throw new Error(`AI parse failed for command: ${command}`)
  }

  return result.data
}

const cases = [
  {
    command: 'besok meeting jam 10 malam',
    expected: {
      titleIncludes: 'meeting',
      date: expectedDate(1),
      hour: 22,
      minute: 0,
      estimatedDuration: 60,
      priority: 'MEDIUM',
    },
  },
  {
    command: 'besok meeting jam 8 malam',
    expected: {
      titleIncludes: 'meeting',
      date: expectedDate(1),
      hour: 20,
      minute: 0,
      estimatedDuration: 60,
      priority: 'MEDIUM',
    },
  },
  {
    command: 'besok review tugas jam 3 sore 45 menit #kuliah penting',
    expected: {
      titleIncludes: 'review',
      date: expectedDate(1),
      hour: 15,
      minute: 0,
      estimatedDuration: 45,
      priority: 'HIGH',
      tagsIncludes: 'kuliah',
    },
  },
  {
    command: 'hari ini bayar listrik jam 9 pagi low #rumah',
    expected: {
      titleIncludes: 'bayar',
      date: expectedDate(0),
      hour: 9,
      minute: 0,
      estimatedDuration: 60,
      priority: 'LOW',
      tagsIncludes: 'rumah',
    },
  },
  {
    command: 'lusa presentasi proyek jam 12 siang urgent 2 jam #kampus',
    expected: {
      titleIncludes: 'presentasi',
      date: expectedDate(2),
      hour: 12,
      minute: 0,
      estimatedDuration: 120,
      priority: 'HIGH',
      tagsIncludes: 'kampus',
    },
  },
  {
    command: 'test jam 10 malam',
    expected: {
      titleIncludes: 'test',
      hour: 22,
      minute: 0,
      estimatedDuration: 60,
      priority: 'MEDIUM',
    },
  },

  // Extreme order / messy user input cases
  {
    command: 'meeting jam 10 malam besok',
    expected: {
      titleIncludes: 'meeting',
      date: expectedDate(1),
      hour: 22,
      minute: 0,
      estimatedDuration: 60,
      priority: 'MEDIUM',
    },
  },
  {
    command: 'jam 8 malam besok kerjakan laporan #kerja penting 30 menit',
    expected: {
      titleIncludes: 'laporan',
      date: expectedDate(1),
      hour: 20,
      minute: 0,
      estimatedDuration: 30,
      priority: 'HIGH',
      tagsIncludes: 'kerja',
    },
  },
  {
    command: 'urgent #kampus 2 jam lusa jam 7 sore presentasi proposal',
    expected: {
      titleIncludes: 'presentasi',
      date: expectedDate(2),
      hour: 19,
      minute: 0,
      estimatedDuration: 120,
      priority: 'HIGH',
      tagsIncludes: 'kampus',
    },
  },
  {
    command: 'low besok jam 9 pagi #rumah bersihkan kamar',
    expected: {
      titleIncludes: 'bersihkan',
      date: expectedDate(1),
      hour: 9,
      minute: 0,
      estimatedDuration: 60,
      priority: 'LOW',
      tagsIncludes: 'rumah',
    },
  },
  {
    command: 'jam 10:15 malam besok call client 90 menit #client',
    expected: {
      titleIncludes: 'call',
      date: expectedDate(1),
      hour: 22,
      minute: 15,
      estimatedDuration: 90,
      priority: 'MEDIUM',
      tagsIncludes: 'client',
    },
  },
  {
    command: 'besok jam 21.30 baca paper #riset',
    expected: {
      titleIncludes: 'baca',
      date: expectedDate(1),
      hour: 21,
      minute: 30,
      estimatedDuration: 60,
      priority: 'MEDIUM',
      tagsIncludes: 'riset',
    },
  },
  {
    command: '#kuliah #deadline penting kumpulkan tugas basis data besok jam 11 malam 1 jam 30 menit',
    expected: {
      titleIncludes: 'tugas',
      date: expectedDate(1),
      hour: 23,
      minute: 0,
      estimatedDuration: 90,
      priority: 'HIGH',
      tagsIncludes: 'kuliah',
    },
  },
  {
    command: 'buat rangkuman materi 25 menit nanti jam 3 sore',
    expected: {
      titleIncludes: 'rangkuman',
      hour: 15,
      minute: 0,
      estimatedDuration: 25,
      priority: 'MEDIUM',
    },
  },
]

const checkCase = (testCase, parsed) => {
  const errors = []
  const summary = toLocalSummary(parsed.deadline)
  const expected = testCase.expected

  if (
    expected.titleIncludes &&
    !String(parsed.title || '').toLowerCase().includes(expected.titleIncludes)
  ) {
    errors.push(`title expected to include "${expected.titleIncludes}", got "${parsed.title}"`)
  }

  if (expected.date && summary.date !== expected.date) {
    errors.push(`date expected ${expected.date}, got ${summary.date} (${parsed.deadline})`)
  }

  if (typeof expected.hour === 'number' && summary.hour !== expected.hour) {
    errors.push(`hour expected ${expected.hour}, got ${summary.hour} (${parsed.deadline})`)
  }

  if (typeof expected.minute === 'number' && summary.minute !== expected.minute) {
    errors.push(`minute expected ${expected.minute}, got ${summary.minute} (${parsed.deadline})`)
  }

  if (
    typeof expected.estimatedDuration === 'number' &&
    parsed.estimatedDuration !== expected.estimatedDuration
  ) {
    errors.push(
      `estimatedDuration expected ${expected.estimatedDuration}, got ${parsed.estimatedDuration}`
    )
  }

  if (expected.priority && parsed.priority !== expected.priority) {
    errors.push(`priority expected ${expected.priority}, got ${parsed.priority}`)
  }

  if (
    expected.tagsIncludes &&
    !(Array.isArray(parsed.tags) && parsed.tags.includes(expected.tagsIncludes))
  ) {
    errors.push(`tags expected to include "${expected.tagsIncludes}", got ${JSON.stringify(parsed.tags)}`)
  }

  return {
    ok: errors.length === 0,
    errors,
    summary,
  }
}

const main = async () => {
  console.log(`AI parsing test target: ${API_BASE_URL}`)

  const health = await requestJson('/health')
  console.log(`Health OK: ${health.status}`)

  const token = await registerAndLogin()
  console.log(`Auth OK: ${email}`)

  let passed = 0

  for (const testCase of cases) {
    const parsed = await parseCommand(token, testCase.command)
    const result = checkCase(testCase, parsed)

    if (result.ok) {
      passed += 1
      console.log(`✅ ${testCase.command}`)
      console.log(`   -> ${parsed.title} | ${result.summary.date} ${pad(result.summary.hour)}:${pad(result.summary.minute)} | ${parsed.priority} | ${parsed.estimatedDuration}m | tags=${JSON.stringify(parsed.tags)}`)
    } else {
      console.error(`❌ ${testCase.command}`)
      console.error(`   parsed=${JSON.stringify(parsed, null, 2)}`)
      for (const error of result.errors) {
        console.error(`   - ${error}`)
      }
    }
  }

  console.log(`\nResult: ${passed}/${cases.length} passed`)

  if (passed !== cases.length) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('AI parsing test failed:', error)
  process.exit(1)
})