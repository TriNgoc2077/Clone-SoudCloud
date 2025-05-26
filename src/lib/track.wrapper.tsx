"use client";
import React, { createContext, useContext, useState } from "react";

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

	return (
		<TrackContext.Provider value={{ currentTrack, setCurrentTrack, currentTime, setCurrentTime }}>
			{children}
		</TrackContext.Provider>
	);
};

export const useTrackContext = () => useContext(TrackContext);
