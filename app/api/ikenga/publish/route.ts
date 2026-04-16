// app/api/ikenga/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { publishToplatform } from "../../../../lib/publisher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, platform, caption, hashtags, mediaUrls, credentials } = body;

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    // If full post data + credentials are provided, attempt real publish
    if (platform && caption && credentials) {
      try {
        const result = await publishToplatform(platform, {
          caption,
          hashtags: hashtags || [],
          mediaUrls: mediaUrls || [],
        }, credentials);

        return NextResponse.json({
          success: true,
          postId,
          platformPostId: result.postId,
          url: result.url,
          message: `Published to ${platform} successfully`,
        });
      } catch (publishError) {
        console.error(`Publish error for ${platform}:`, publishError);
        return NextResponse.json({
          success: false,
          postId,
          error: publishError instanceof Error ? publishError.message : "Platform publish failed",
        }, { status: 502 });
      }
    }

    // Demo / queue mode: no credentials provided yet
    // In production this would look up the post + credentials from DB and enqueue
    return NextResponse.json({
      success: true,
      postId,
      url: null,
      message: "Post queued for publishing. Connect platform credentials in Settings to enable live publishing.",
      queued: true,
    });
  } catch (error) {
    console.error("Publish route error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
