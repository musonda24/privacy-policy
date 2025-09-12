import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, datetime, location, plot } = body || {}

    if (!name || !phone || !datetime || !location || !plot) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: { name, phone, datetime, location, plot },
    })

    // Fire-and-forget n8n webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: appointment.id,
          createdAt: appointment.createdAt,
          name,
          phone,
          datetime,
          location,
          plot,
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ id: appointment.id })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

