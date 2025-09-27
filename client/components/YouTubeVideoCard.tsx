import React from 'react';
import { ExternalLink, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeVideoCardProps {
  videoUrl: string;
  title?: string;
  duration?: string;
  className?: string;
}

export const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({
  videoUrl,
  title,
  duration,
  className = ""
}) => {
  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Extract title from the formatted string
  const getVideoTitle = (videoString: string) => {
    if (videoString.includes(' - ')) {
      return videoString.split(' - ')[1] || videoString;
    }
    return title || 'Watch Video';
  };

  const videoId = getVideoId(videoUrl);
  const videoTitle = getVideoTitle(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  const handleVideoClick = () => {
    window.open(videoUrl.split(' - ')[0], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`group relative overflow-hidden rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-300 ${className}`}>
      {/* Thumbnail Section */}
      {thumbnailUrl && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={videoTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to default thumbnail if maxres doesn't exist
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3 shadow-lg group-hover:bg-red-700 transition-colors duration-300">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <div className="bg-red-600 rounded-full p-1 mt-1">
            <Play className="h-3 w-3 text-white fill-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 text-sm leading-tight mb-1">
              {videoTitle}
            </h4>
            <p className="text-red-600 text-xs">YouTube Video Tutorial</p>
          </div>
        </div>

        <Button
          onClick={handleVideoClick}
          size="sm"
          className="w-full bg-red-600 hover:bg-red-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <ExternalLink className="h-3 w-3 mr-2" />
          Watch on YouTube
        </Button>
      </div>
    </div>
  );
};

export default YouTubeVideoCard;
