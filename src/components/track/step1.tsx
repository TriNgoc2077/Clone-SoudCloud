"use client";
import { FileWithPath, useDropzone } from "react-dropzone";
import "./theme.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useCallback } from "react";
import ButtonFileUpload from "./button.upload";

const Step1 = () => {
	const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
		console.log(acceptedFiles);
	}, []);
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		onDrop,
	});

	const files = acceptedFiles.map((file: FileWithPath) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	return (
		<section className="container">
			<div {...getRootProps({ className: "dropzone" })}>
				<input {...getInputProps()} />
				<ButtonFileUpload />
				<p>Drag and drop some files here, or click to select files</p>
			</div>
			<aside>
				<h4>Files</h4>
				<ul>{files}</ul>
			</aside>
		</section>
	);
};
export default Step1;
