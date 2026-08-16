import { redirect } from "next/navigation";

/** Dev convenience + static export root entry. Production also uses postbuild/htaccess → /sv/. */
export default function RootPage() {
  redirect("/sv/");
}
