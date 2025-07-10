import React from "react";

function getCountdown(startDate: number, endDate: number) {
  const now = Date.now();
  let target = startDate > now ? startDate : endDate;
  let diff = target - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

const ExhibitionCard = ({ exhibition }: { exhibition: any }) => {
  const { title, coverImage: coverImageUrl, startDate, endDate, location, artworkCount, status } = exhibition;
  const countdown = getCountdown(startDate, endDate);
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 flex flex-col gap-3 border border-zinc-200 dark:border-zinc-800">
      {coverImageUrl && (
        <img src={coverImageUrl} alt={title} className="rounded-md w-full h-40 object-cover mb-2" />
      )}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {location ? (
            <span>{location.name}, {location.city}, {location.country}</span>
          ) : (
            <span>Virtual</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {status === "upcoming" ? "Starts in" : "Ends in"} {countdown}
          </span>
          <span className="text-xs bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
            {artworkCount} artworks
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionCard; 