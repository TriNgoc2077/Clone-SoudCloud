"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export const TrackContext = createContext<ITrackContext | null>(null);

export const TrackContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const initValue: IShareTrack = {
		isPlaying: false,
		_id: "",
		title: "",
		description: "",
		category: "",
		imgUrl: "",
		trackUrl: "",
		countLike: 0,
		countPlay: 0,
		uploader: {
			_id: "",
			email: "",
			name: "",
			role: "",
			type: "",
		},
		isDeleted: false,
		createdAt: "",
		updatedAt: "",
	};
	const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initValue);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [playlist, setPlaylist] = useState<IShareTrack[]>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	// setCurrentTrack(playlist[currentIndex]);
	const nextTrack = () => {
		if (currentIndex < playlist.length - 1) {
			setCurrentTrack({...playlist[currentIndex + 1], isPlaying: true})
			setCurrentIndex(currentIndex + 1);
		} else {
			setCurrentIndex(0);
		}
	}

	const prevTrack = () => {
		console.log(currentIndex);
		if (currentIndex > 0) {
			setCurrentTrack({...playlist[currentIndex - 1], isPlaying: true})
			setCurrentIndex(currentIndex - 1);
		} else {
			setCurrentIndex(playlist.length - 1);
		}
	}
	// useEffect(() => {
	// 	console.log("Playlist has changed", playlist);
	//   }, [playlist]);
	return (
		<TrackContext.Provider 
			value={{ 
				currentTrack, 
				setCurrentTrack, 
				currentTime, 
				setCurrentTime,
				currentIndex,
				setCurrentIndex,
				playlist,
				setPlaylist,
				nextTrack,
				prevTrack
			}}>
			{children}
		</TrackContext.Provider>
	);
};

export const useTrackContext = () => useContext(TrackContext);
