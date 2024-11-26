interface YouTubeVideoProps {
  videoId: string;
  title: string;
  description?: string;
}

export default function YouTubeVideo({ videoId, title, description }: YouTubeVideoProps) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full rounded-lg"
    />
  );
}
