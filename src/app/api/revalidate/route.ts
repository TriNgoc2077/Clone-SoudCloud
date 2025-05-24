import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const tag = request.nextUrl.searchParams.get('tag');

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
    }

    try {
        revalidateTag(tag);
        return NextResponse.json({ message: `Revalidated tag: ${tag}` }, { status: 200 });
    } catch (error) {
        console.error("Error revalidating tag:", error);
        return NextResponse.json({ message: 'Failed to revalidate tag' }, { status: 500 });
    }
}
