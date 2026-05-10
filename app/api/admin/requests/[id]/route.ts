import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceRequest = await prisma.request.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const serviceRequest = await prisma.request.update({
      where: { id },
      data: {
        status: body.status,
        details: body.details
      }
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE_REQUEST',
        details: `Updated request ${id} status to ${body.status}`,
      }
    });

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.request.delete({
      where: { id }
    });

    await prisma.log.create({
      data: {
        action: 'DELETE_REQUEST',
        details: `Deleted request ${id}`,
      }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
