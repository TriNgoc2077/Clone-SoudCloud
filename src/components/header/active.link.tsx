"use client"; 

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now imported from navigation

const ActiveLink = ({
  children,
  ...rest
 }: { children: React.ReactNode } & LinkProps) => {
   const { href } = rest;
   const pathName = usePathname();

   const isActive = pathName.startsWith(href as string);
     return (
    // you get a global isActive class name, it is better than 
    // nothing, but it means you do not have scoping ability in 
    // certain cases
       <Link {...rest} className={isActive ? "active" : ""} style={{ padding: "5px 10px" }}> 
         {children}
       </Link>
   );
  };

export default ActiveLink;