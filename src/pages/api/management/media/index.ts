import type { APIRoute } from 'astro';
import { prisma } from '@/lib/prisma';

export const GET: APIRoute = async () => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return new Response(JSON.stringify(media), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { key, filename, mimeType, size, width, height } = body;

    if (!key || !filename || !mimeType || size === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const media = await prisma.media.create({
      data: {
        key,
        filename,
        mimeType,
        size,
        width,
        height,
      },
    });

    return new Response(JSON.stringify(media), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
