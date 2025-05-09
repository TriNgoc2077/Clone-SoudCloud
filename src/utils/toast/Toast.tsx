"use client";
import { Alert, IconButton, Snackbar, SnackbarProps } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { ToastMessage } from "./useToast";
import CloseIcon from "@mui/icons-material/Close";

export type ToastStyle = Omit<
	SnackbarProps,
	"TransitionProps" | "onClose" | "open" | "children" | "message"
>;

export type ToastProps = {
	message: ToastMessage;
	onExited: () => void;
} & ToastStyle;

// https://mui.com/material-ui/react-snackbar/#consecutive-snackbars
export const Toast: FC<ToastProps> = ({
	message,
	onExited,
	autoHideDuration,
	...props
}) => {
	const [open, setOpen] = React.useState(true);

	const handleClose = (
		_event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	return (
		<Snackbar
			key={message.key}
			open={open}
			onClose={handleClose}
			TransitionProps={{ onExited }}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			autoHideDuration={autoHideDuration ?? 3000}
			{...props}
			sx={{
				mt: 5,
			}}
		>
			<Alert
				severity={message.severity}
				action={
					<IconButton
						aria-label="close"
						color="inherit"
						size="small"
						onClick={() => setOpen(false)}
					>
						<CloseIcon fontSize="inherit" />
					</IconButton>
				}
			>
				{message.message}
			</Alert>
		</Snackbar>
	);
};
