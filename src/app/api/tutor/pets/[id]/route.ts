import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        qrCode: {
          select: {
            code: true,
          },
        },
      },
    })

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    if (pet.tutorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error('Failed to fetch pet:', error)
    return NextResponse.json({ error: 'Failed to fetch pet' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // Check ownership
    const existingPet = await prisma.pet.findUnique({
      where: { id },
    })

    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    if (existingPet.tutorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only update photo if explicitly provided in the request
    const updateData: Record<string, unknown> = {
      name: data.name,
      species: data.species,
      breed: data.breed,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      sex: data.sex,
      observations: data.observations,
      tutorName: data.tutorName,
      tutorPhone: data.tutorPhone,
      contactType: data.contactType,
      secondaryPhone: data.secondaryPhone,
    }

    // Only update photo if it's explicitly in the request body
    if ('photo' in data) {
      updateData.photo = data.photo
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(pet)
  } catch (error) {
    console.error('Failed to update pet:', error)
    return NextResponse.json({ error: 'Failed to update pet' }, { status: 500 })
  }
}
