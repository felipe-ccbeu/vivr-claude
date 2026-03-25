import * as https from 'https'

const REPLIT_API = 'https://ad-creative-suite.replit.app/api/html'

export async function pushToReplit(html: string): Promise<{ editorUrl: string; savedAt: string }> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ html })
    const url = new URL(REPLIT_API)
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            resolve({ editorUrl: json.editorUrl ?? REPLIT_API, savedAt: json.savedAt ?? '' })
          } catch {
            reject(new Error(`Replit API parse error: ${data}`))
          }
        })
      }
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

export async function fetchFromReplit(): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(REPLIT_API, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (!json.html) throw new Error('No HTML in response')
          resolve(json.html)
        } catch {
          reject(new Error(`Replit API error: ${data}`))
        }
      })
    }).on('error', reject)
  })
}