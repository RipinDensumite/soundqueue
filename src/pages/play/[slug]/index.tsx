import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";

interface VideoType {
    title: string;
    videoId: string;
    thumbnails: string;
}

export default function PlayPage() {
    const router = useRouter();
    const [videos, setVideos] = useState<VideoType[]>([]);
    const [shuffleVideos, setShuffleVideos] = useState<VideoType[]>([]);
    const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;
    const playlistId = router.query.slug as string;
    const [nextPageToken, setNextPageToken] = useState<string>("");

    useEffect(() => {

        const fetchPlaylistVideos = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/playlistItems`,
                    {
                        params: {
                            part: 'snippet',
                            playlistId: playlistId,
                            maxResults: 50,
                            pageToken: nextPageToken,
                            key: API_KEY,
                        },
                    }
                );

                console.log('Response:', response);

                if (response.data.nextPageToken === undefined) {
                    // do nothing
                } else {
                    setNextPageToken(response.data.nextPageToken);
                }


                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const videoData = response.data.items.map((item: any) => {
                    const thumbnail =
                        item.snippet.thumbnails.standard?.url ||
                        item.snippet.thumbnails.high?.url ||
                        item.snippet.thumbnails.medium?.url ||
                        item.snippet.thumbnails.default?.url ||
                        'path/to/default/image.jpg'; // Provide a default image path

                    return {
                        title: item.snippet.title,
                        videoId: item.snippet.resourceId.videoId,
                        thumbnails: thumbnail,
                    };
                });

                setVideos((prev) => [...prev, ...videoData]);
                setError(null);
            } catch (e) {
                console.error('Error fetching the playlist:', e);
                setError('Error fetching the playlist');
            }
        };

        if (playlistId) {
            fetchPlaylistVideos();
        }
    }, [playlistId, API_KEY, error, nextPageToken]);

    useEffect(() => {
        console.log("videos: ", currentIndex);
    }, [currentVideo])

    const handlePlay = (video: VideoType) => {
        setCurrentVideo(video);
        setCurrentIndex(videos.indexOf(video));
    };

    const prevVideo = () => {
        if (currentIndex === null) return

        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentVideo(videos[currentIndex]);
            console.log(currentIndex)
        }
    }

    const nextVideo = () => {
        if (currentIndex === null) return

        if (currentIndex < videos.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentVideo(videos[currentIndex]);
            console.log(currentIndex)
        }
    }

    const shufflePlaylist = () => {
        const shuffledVideos = [...videos];
        for (let i = shuffledVideos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledVideos[i], shuffledVideos[j]] = [shuffledVideos[j], shuffledVideos[i]];
        }
        setShuffleVideos(shuffledVideos);
    }

    const playOneRandomizeVideo = () => {
        const randomIndex = Math.floor(Math.random() * videos.length);
        setCurrentIndex(randomIndex);
        setCurrentVideo(videos[randomIndex]);
    }

    const isShuffleVideo = shuffleVideos.length > 0 ? shuffleVideos : videos;

    return (
        <section className="px-4 py-2 sm:px-0 sm:py-0">
            {error && <div>{error}</div>}
            {/* {currentVideo && ( */}
            <div className="max-w-2xl mx-auto space-y-3 mt-11">
                <h2>Now Playing: {currentVideo?.title}</h2>
                <div className="video-container">
                    <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${currentVideo?.videoId}`}
                        title={currentVideo?.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="mx-auto w-fit space-x-3">
                    <Button onClick={prevVideo} type="button" variant="outline" className="w-fit px-4 py-1">prev</Button>
                    <Button onClick={nextVideo} type="button" variant="outline" className="w-fit px-4 py-1">next</Button>
                </div>
            </div >
            {/* ) */}
            {/* } */}

            <div className="max-w-2xl mx-auto mt-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h2>Playlist Videos</h2>
                        <p>Total videos: {currentIndex !== null && `${currentIndex + 1} /`}  {videos.length}</p>
                    </div>
                    <div className="space-x-2">
                        <Button onClick={() => setShuffleVideos([])} type="button" variant="outline" className="w-fit px-4 py-1">Original Playlist</Button>
                        <Button onClick={shufflePlaylist} type="button" variant="outline" className="w-fit px-4 py-1">Shuffle Playlist</Button>
                        <Button onClick={playOneRandomizeVideo} type="button" variant="outline" className="w-fit px-4 py-1">Play a randomize video</Button>
                    </div>
                </div>
                <div className="h-56 overflow-scroll border p-3">
                    {isShuffleVideo.map((video, index) => (
                        <div key={index} className="flex items-center space-x-4 cursor-pointer p-2 hover:bg-slate-300 hover:text-black" onClick={() => handlePlay(video)}>
                            <img src={video.thumbnails} className="size-12 object-cover" />
                            <h3>
                                {video.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
