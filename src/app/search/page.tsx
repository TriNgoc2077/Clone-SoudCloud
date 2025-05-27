import Search from "@/components/search/search";
import { Container } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Search your track",
	description: "Vibe music",
};

const SearchPage = () => {
    return (
        <Suspense>
            <Container sx={{mt: 3}}>
                <Search />
            </Container>
        </Suspense>
    )
}

export default SearchPage;