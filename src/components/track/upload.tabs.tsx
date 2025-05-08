"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Step1 from "./step1";
import Step2 from "./step2";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const UploadTabs = () => {
	const [value, setValue] = React.useState(0);
	const [trackUpload, setTrackUpload] = React.useState({
		fileName: "",
		percent: 0,
		uploadedTrackName: "",
	});

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box
			sx={{
				width: "100%",
				border: "1px solid #ddd",
				mt: 5,
				height: "100%",
			}}
		>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
					sx={{
						"& .MuiTabs-indicator": {
							backgroundColor: "#ff69b4",
						},
					}}
				>
					<Tab
						label="Tracks"
						{...a11yProps(0)}
						sx={{
							"&.Mui-selected": {
								color: "#ff69b4",
							},
						}}
					/>
					<Tab
						label="Your Track Information"
						{...a11yProps(1)}
						sx={{
							"&.Mui-selected": {
								color: "#ff69b4",
							},
						}}
					/>
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<Step1
					setValue={setValue}
					setTrackUpload={setTrackUpload}
					trackUpload={trackUpload}
				/>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<Step2 trackUpload={trackUpload} />
			</CustomTabPanel>
		</Box>
	);
};

export default UploadTabs;
