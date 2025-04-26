"use client";
import { useState } from "react";

const LikePage = () => {
  const [name, setName] = useState("Cao Tri Ngoc");
  return (<>Like page {name}</>);
}
export default LikePage;