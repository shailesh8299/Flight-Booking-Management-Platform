import { NextResponse } from 'next/server';
import { db, Discount } from '@/lib/db';

export async function GET() {
    try {
        const discounts = await db.getDiscounts();
        return NextResponse.json(discounts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newDiscount = {
            ...data,
            id: `d${Date.now()}`,
            is_active: true
        } as Discount;
        await db.addDiscount(newDiscount);
        return NextResponse.json(newDiscount, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create discount' }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, ...updates } = data;
        const updated = await db.updateDiscount(id, updates);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update discount' }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        await db.deleteDiscount(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
