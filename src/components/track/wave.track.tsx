"use client";
import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";

const WaveTrack = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	const searchParams = useSearchParams();
	const fileName = searchParams.get("audio");
	const optionsMemo = useMemo(() => {
		return {
			waveColor: "rgb(200, 0, 200)",
			progressColor: "rgb(100, 0, 100)",
			url: `/api?audio=${fileName}`,
		};
	}, []);
	const wavesurfer = useWavesurfer(containerRef, optionsMemo);

	return <div ref={containerRef}>Wave Track</div>;
};

export default WaveTrack;
