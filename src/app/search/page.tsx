import Search from "@/components/search/search";
import { Container } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Search your track",
	description: "Vibe music",
};

const SearchPage = () => {
    return (
        <Container sx={{mt: 3}}>
            <Search />
        </Container>
    )
}

export default SearchPage;