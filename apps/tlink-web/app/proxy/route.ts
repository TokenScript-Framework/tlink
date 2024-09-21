import { NextRequest, NextResponse } from 'next/server'

async function handleRequest(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Proxy',
      },
      body: ['GET', 'HEAD'].includes(request.method)
        ? null
        : await request.arrayBuffer(),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch the URL' },
        { status: response.status },
      )
    }

    const contentType = response.headers.get('content-type')
    const body = await response.arrayBuffer()

    const proxyResponse = new NextResponse(body, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Security-Policy': 'connect-src *',
      },
    })

    return proxyResponse
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const DELETE = handleRequest
export const PATCH = handleRequest

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Security-Policy': 'connect-src *',
    },
  })
}
