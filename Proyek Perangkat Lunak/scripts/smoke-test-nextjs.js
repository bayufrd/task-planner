#!/usr/bin/env node

const { spawn } = require('child_process')

const BASE_URL = process.env.NEXTJS_BASE_URL || 'http://localhost:3000'
const TIMEOUT_MS = Number(process.env.SMOKE_TEST_TIMEOUT_MS || 10000)

const endpoints = [
  { method: 'GET', path: '/', expected: [200] },
  { method: 'GET', path: '/auth/signin', expected: [200] },
  { method: 'GET', path: '/api/auth/session', expected: [200] },
  { method: 'GET', path: '/api/auth/providers', expected: [200] },
]

function request(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`

  return new Promise((resolve) => {
    const curl = spawn('curl', [
      '-sS',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code}',
      '-X',
      endpoint.method,
      '--max-time',
      String(Math.ceil(TIMEOUT_MS / 1000)),
      url,
    ])

    let output = ''
    let error = ''

    curl.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })

    curl.stderr.on('data', (chunk) => {
      error += chunk.toString()
    })

    curl.on('close', (code) => {
      const status = Number(output.trim())
      const ok = code === 0 && endpoint.expected.includes(status)

      resolve({
        ...endpoint,
        url,
        status,
        ok,
        error: error.trim(),
      })
    })
  })
}

async function main() {
  console.log(`Smoke testing Next.js app at ${BASE_URL}`)

  const results = []
  for (const endpoint of endpoints) {
    results.push(await request(endpoint))
  }

  for (const result of results) {
    const icon = result.ok ? '✅' : '❌'
    const expected = result.expected.join('/')
    console.log(`${icon} ${result.method} ${result.path} -> ${result.status || 'NO_RESPONSE'} (expected ${expected})`)
    if (result.error) {
      console.log(`   ${result.error}`)
    }
  }

  const failed = results.filter((result) => !result.ok)

  if (failed.length > 0) {
    console.error(`\n${failed.length}/${results.length} Next.js smoke checks failed.`)
    process.exit(1)
  }

  console.log(`\nAll ${results.length} Next.js smoke checks passed.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})